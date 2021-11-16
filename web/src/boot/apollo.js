import VueApollo from 'vue-apollo'
import { ApolloLink, Observable } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import Vuex from 'vuex'
import _ from 'lodash'

let defaultUrl = '/graphql'

const httpLink = new HttpLink({
  uri: defaultUrl
})

// we use a usefull error handling tool provided by Apollo in order to execute some code when errors occur.
const onErrorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // We log every GraphQL errors
  window.$loader.hide()
  if (graphQLErrors) {
    let msg = ''
    let code = void 0
    graphQLErrors.map(({ message, locations, path, extensions }) => {
      msg += `${message}\n`
      if (_.get(extensions, 'code', false)) {
        code = extensions.code
      } else {
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      }
    })
    if (code === 'RETRY_FORCE') { // 강제로 추가/수정요청을 팝업으로 질의 하여 요청
      return new Observable(observer => {
        const opts = {
          title: '강제 추가/수정',
          useButtons: ['confirm', 'cancel'],
          textAlign: 'left'
        }
        const subscriber = {
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer)
        }
        window.$msg.show(msg, opts, btnKey => {
          window.$msg.hide()
          if (btnKey !== 'confirm') return
          operation.variables.force = true
          forward(operation).subscribe(subscriber)
        })
      })
    } else {
      window.$notify.error(msg)
    }
  }
  // When a 401 error occur, we log-out the user.
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
    window.$notify.error(`[Network error]: ${networkError}`)
    if (networkError.statusCode === 401) {
      window.location.href = '/'
    }
  }
})

const dictLoading = {
  Read: '가져오는 중...',
  Search: '검색 중...',
  Create: '등록 중...',
  Update: '변경 중...',
  Delete: '삭제 중...',
  Transfer: '양도 중...',
  Refund: '환불 중...',
  Check: '확인 중...'
}
const dictMsg = {
  Search: '검색 되었습니다.',
  Create: '추가 되었습니다.',
  Update: '수정 되었습니다.',
  Delete: '삭제 되었습니다.',
  Transfer: '양도 되었습니다.',
  Refund: '환불 되었습니다.',
  Check: '확인 되었습니다.'
}

const loadingLink = new ApolloLink((operation, forward) => {
  const opName = _.get(operation, 'operationName', '')
  if (dictLoading[opName]) window.$loader.show({ state: dictLoading[opName] })
  return forward(operation).map((data) => {
    if (_.has(data, 'errors')) return data
    if (dictMsg[opName]) {
      window.$notify.info(dictMsg[opName])
    }
    window.$loader.hide()
    return data
  })
})

const link = ApolloLink.from([
  onErrorLink,
  loadingLink,
  httpLink
])

const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache({ addTypename: false }),
  connectToDevTools: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }
  }
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vuex.Store.prototype.$apollo = apolloClient
export default ({ app, Vue }) => {
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}
