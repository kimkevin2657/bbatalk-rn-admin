<template>
  <div class="grid-container">
    <div class="auth-form-box">
      <div style="text-align:center; margin-top: 50px;">
        <q-icon name="email" class="text-indigo" style="font-size: 32px;" />
      </div>
      <h3 class="form-title" style="text-align:center; padding-top: 0; margin-top: 0;">
        이메일 인증
      </h3>
      <span>이메일 인증 키를 받으실 수 있는 메일주소를 입력해주세요.</span>
      <div class="form-rows">
        <!-- EMail 입력 -->
        <q-input
          name="authEmail"
          v-model="email"
          v-validate="'required|email'"
          dense
          outlined
          :hint="isSend ? '이메일이 발송되었습니다.': ''"
          label="이메일 입력"
          @keyup.enter="onSendBtn"
          :error="errors.has('authEmail')"
          :error-message="getValidateMessage('authEmail')"
        />
        <!-- 전송 버튼 -->
        <q-btn
          color="indigo"
          @click="onSendBtn"
          @keyup.enter="onSendBtn"
          class="block q-mt-md form-btn"
          icon="fas fa-paper-plane"
          label="보내기"
          dense
        />
      </div>
      <!-- 인증번호 확인 -->
      <div class="form-rows" v-if="isSend">
        <!-- 인증번호 입력 -->
        <q-input
          name="authKey"
          v-model="authKey"
          v-validate="'required'"
          dense
          outlined
          label="인증번호 입력"
          @keyup.enter="onSendAuthKey"
          :error="errors.has('authKey')"
          :error-message="getValidateMessage('authKey')"
        />
        <!-- 전송 버튼 -->
        <q-btn
          color="red"
          @click="onSendAuthKey"
          class="block q-mt-md form-btn"
          label="인증"
          dense
        />
      </div>
      <!-- 설명 부분 -->
      <div class="form-desc">
        <ul>
          <li>이메일 본인 인증 절차를 거쳐야지만 회원 가입을 할 수 있습니다.</li>
          <li>등록되는 이메일은 가입안내, 비밀번호 분실 또는 수정 등의 사이트 활동에 필수적인 메일이 발송됩니다.</li>
          <li>또한 직접홍보 신청 진행상황 및 세금계산서 등 주요 내용이 메일로 발송되오니 정확히 입력해주시기 바랍니다.</li>
          <li>이미 해당 이메일로 일반, 강사, 기업회원 중 하나에 가입하셨다면 다른 이메일을 사용해 주세요.</li>
          <li class="warning">이메일 요청 후 인증번호는 10분 후에 만료됩니다.</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ValidateMixin from '../../../mixins/validateMixin'
export default {
  name: 'JoinAuthInfoTemplate',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  data () {
    return {
      email: '',
      authKey: '',
      isSend: false
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    ...mapActions('auth', [
      'reqAuthEmail',
      'reqAuthKey'
    ]),
    async onSendBtn () {
      // 유효성 검사
      const reqValidate = await this.$validator.validate('authEmail')
      if (!reqValidate) return
      this.$loader.show({ state: '메일 전송 요청 중...' })
      // 이메일 전송 요청
      const { code, msg } = await this.reqAuthEmail({ email: this.email })
      if (code === 'ok') {
        this.isSend = true
        this.$loader.setState('인증번호를 발송하였습니다.')
        await this.$sleep(1500)
      }
      if (code === 'err') {
        this.$alert.show('error', msg)
      }
      this.$loader.hide()
    },
    async onSendAuthKey () {
      // 유효성 검사
      const reqValidate = await this.$validator.validate('authKey')
      if (!reqValidate) return

      // 인증키 전송 요청
      this.$loader.show({ state: '인증 중...' })
      const { code, msg } = await this.reqAuthKey({ email: this.email, key: this.authKey })
      if (code === 'ok') {
        this.$loader.setState('인증에 성공하였습니다.')
        await this.$sleep(1500)
        this.$emit('complete')
      }
      if (code === 'err') {
        this.$alert.show('error', msg)
      }
      this.$loader.hide()
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-rows: auto 40px 50px;
}

.form-title {
  color: #333;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  font-weight: normal;
  text-align: left;
}
.form-rows {
  display: grid;
  margin: 20px 0px;
  grid-template-columns: auto 100px;
  grid-gap: 10px;
}
.form-btn {
  margin: 0 0 20px 0;
  width: 100px;
}

.form-desc {
  padding: 15px 10px;
  background: #F1F1F1;
}

h3 {
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}

.auth-label {
  padding-top: 13px;
  text-align: center;
}

.warning {
  color:red;
}
</style>
