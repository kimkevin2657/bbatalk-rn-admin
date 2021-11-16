<template>
  <div>
    <top />
    <div class="q-pa-md column">
      <q-card>
        <q-card-section class="row">
          <div class="text-h6 col-12">{{operationNoticeData.title}}</div>
          <div class="row col-12">
            <div class="text-subtitle2">{{operationNoticeData.name}} | {{$moment(operationNoticeData.create_d).format('YYYY-MM-DD HH:mm')}}</div>
            <q-space />
            <div class="text-subtitle2">조회 {{operationNoticeData.see}} </div>
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div v-html="operationNoticeData.content" />
        </q-card-section>
        <q-separator inset />
        <div class="row q-ma-sm">
          <q-space />
          <q-btn
            label="수정"
            class="q-mr-sm"
            color="blue-grey-6"
            @click="onUpdate"
          />
          <q-btn
            label="삭제"
            class="q-mr-sm"
            color="blue-grey-4"
            @click="onDelete"
          />
          <q-btn
            label="글쓰기"
            class="q-mr-sm"
            color="blue-grey-8"
            @click="onRegister"
          />
        </div>
      </q-card>

    </div>
    <operation-notice
      mode='sub'
      @move="onMove"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// component
import Top from 'src/layouts/component/Top'
import OperationNotice from '../OperationNotice'

export default {
  name: 'OperationNoticeDetail',
  components: {
    Top,
    OperationNotice
  },
  mounted () {
    if (this.num) {
      this.reqGetOperationNoticeData({ num: Number(this.num) })
    }
  },
  props: {
    num: String
  },
  computed: {
    ...mapState('operationNotice', [
      'operationNoticeData'
    ])
  },
  methods: {
    ...mapActions('operationNotice', [
      'reqGetOperationNoticeData',
      'reqCheckOperationNoticePwd',
      'reqRemoveOperationNoticeData'
    ]),
    ...mapMutations('operationNotice', [
      'setOperationNoticeDataPwd'
    ]),
    onMove (num) {
      if (Number(this.num) !== num) {
        this.reqGetOperationNoticeData({ num: Number(num) })
      }
    },
    onRegister () {
      this.$router.push('/manager/operation/OperationNotice/Editor')
    },
    async onUpdate () {
      const pwd = await this.passwordCheck()
      if (!pwd) return
      const { code } = await this.reqCheckOperationNoticePwd({
        _id: this.operationNoticeData._id,
        pwd
      })
      if (code === 'ok') {
        this.setOperationNoticeDataPwd(pwd)
        const num = this.operationNoticeData.num
        this.$router.push(`/manager/operation/OperationNotice/Editor?mode=update&num=${num}`)
      }
    },
    async onDelete () {
      const pwd = await this.passwordCheck()
      if (!pwd) return
      const { code } = await this.reqRemoveOperationNoticeData({
        _id: this.operationNoticeData._id,
        pwd
      })
      if (code === 'ok') {
        this.$router.push('/manager/operation/OperationNotice')
      }
    },
    passwordCheck () {
      return new Promise((resolve, reject) => {
        let pwd = ''
        this.$q.dialog({
          title: '비밀번호 확인',
          message: '비밀번호를 입력하세요.',
          prompt: {
            model: pwd,
            isValid: val => val.length > 7,
            type: 'password',
            attrs: { autocomplete: 'new-password' }
          },
          ok: {
            label: '확인',
            color: 'blue-grey-8'
          },
          cancel: {
            label: '취소',
            color: 'blue-grey-6'
          },
          persistent: true,
          square: true
        }).onOk(data => {
          resolve(data)
        }).onCancel(() => {
          resolve(void 0)
        })
      })
    }
  }
}
</script>
