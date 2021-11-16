import Vue from 'vue'

// global components
import AlertDialog from 'components/dialog/AlertDialog'
import LoadingDialog from 'components/dialog/LoadingDialog'
import MessageDialog from 'components/dialog/MessageDialog'
// import ValidateDialog from 'components/dialog/ValidateDialog'

// global components
Vue.component('alert-dialog', AlertDialog)
Vue.component('loading-dialog', LoadingDialog)
Vue.component('messagedialog', MessageDialog)
// Vue.component('validate-dialog', ValidateDialog)

const AlertPopUp = {
  install (Vue, options = {}) {
    var ModalConstructor = Vue.extend(AlertDialog)
    var modalInstance = null

    if (this.installed) {
      return
    }

    this.installed = true
    this.event = new Vue()

    const $alert = {
      show (type, message, opts) {
        if (modalInstance) {
          modalInstance.show(type, message, opts)
          return
        }

        modalInstance = new ModalConstructor({
          el: document.createElement('div')
        })

        document.body.appendChild(modalInstance.$el)
        modalInstance.show(type, message, opts)
      },

      hide () {
        modalInstance.hide()
      }
    }
    Vue.prototype.$alert = $alert
    window.$alert = $alert
  }
}

const MessagePopUp = {
  install (Vue, options = {}) {
    var ModalConstructor = Vue.extend(MessageDialog)
    var modalInstance = null

    if (this.installed) {
      return
    }

    this.installed = true
    this.event = new Vue()

    const $msg = {
      show (message, opts, cb) {
        if (modalInstance) {
          modalInstance.show(message, opts, cb)
          return
        }

        modalInstance = new ModalConstructor({
          el: document.createElement('div')
        })

        document.body.appendChild(modalInstance.$el)
        modalInstance.show(message, opts, cb)
      },

      hide () {
        modalInstance.hide()
      }
    }
    Vue.prototype.$msg = $msg
    window.$msg = $msg
  }
}

// TODO: 정리 필요
// loading 팝업 plugin prototype 등록
const LoadingPopUp = {
  install (Vue, options = {}) {
    var ModalConstructor = Vue.extend(LoadingDialog)
    var modalInstance = null

    if (this.installed) {
      return
    }

    this.installed = true
    this.event = new Vue()

    const $loader = {
      show (opts) {
        if (modalInstance) {
          modalInstance.show(opts)
          return
        }

        this.loaderModalInstanceCreate()
        modalInstance.show(opts)
      },
      hide () {
        modalInstance.hide()
      },
      setState (state) {
        modalInstance.setState(state)
      },
      // 팝업 생성 등록
      loaderModalInstanceCreate () {
        modalInstance = new ModalConstructor({
          el: document.createElement('div')
        })
        document.body.appendChild(modalInstance.$el)
        this.loaderModalInstance = modalInstance
      },
      // 팝업 제거
      loaderModalInstanceDestroy () {
        if (modalInstance.$el.parentNode) {
          modalInstance.$el.parentNode.removeChild(modalInstance.$el)
        }
        modalInstance = null
        this.loaderModalInstance = null
      },
      loaderModalInstance: null
    }
    Vue.prototype.$loader = $loader
    window.$loader = $loader
  }
}

// const ValidatePopUp = {
//   install (Vue, options = {}) {
//     var ModalConstructor = Vue.extend(Components.ValidateDialog)
//     var modalInstance = null

//     if (this.installed) {
//       return
//     }

//     this.installed = true
//     this.event = new Vue()

//     Vue.prototype.$validatePopUp = {
//       show (errorBag, customErrMsgs = []) {
//         if (modalInstance) {
//           modalInstance.show(errorBag, customErrMsgs)
//           return
//         }

//         modalInstance = new ModalConstructor({
//           el: document.createElement('div')
//         })

//         document.body.appendChild(modalInstance.$el)
//         modalInstance.show(errorBag, customErrMsgs)
//       },

//       hide () {
//         ValidatePopUp.event.$emit('hide')
//       }
//     }
//   }
// }

Vue.use(LoadingPopUp)
// Vue.use(ValidatePopUp)
Vue.use(AlertPopUp)
Vue.use(MessagePopUp)

export {
  LoadingPopUp,
  MessagePopUp,
  // ValidatePopUp,
  AlertPopUp
}
