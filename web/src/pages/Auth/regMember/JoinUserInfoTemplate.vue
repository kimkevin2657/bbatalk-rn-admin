<template>
  <div class="grid-container">
    <div class="auth-form-box">
      <h3 class="form-title">
        기본 정보 입력
      </h3>
      <div class="form-content">
        <div class="auth-label">아이디</div>
        <!-- ID 입력 -->
        <q-input
          name="authid"
          v-model="id"
          data-vv-scope="reginfo"
          v-validate="'required|id'"
          dense
          outlined
          :hint="matchid === id && id !== '' ? '사용할 수 있는 아이디 입니다.' : ''"
          :error="errors.has('reginfo.authid')"
          :error-message="getValidateMessage('authid')"
        />
        <q-btn
          color="indigo"
          label="확인"
          class="form-btn"
          @click="onIdCheck"
        />
        <div class="auth-label">패스워드</div>
        <!-- PWD 입력 -->
        <q-input
          ref="authpwd"
          name="authpwd"
          v-model="pwd"
          type="password"
          data-vv-scope="reginfo"
          v-validate="'required|password'"
          dense
          outlined
          class="form-all-input"
          :error="errors.has('reginfo.authpwd')"
          :error-message="getValidateMessage('authpwd')"
        />
        <!-- PWD 확인 입력 -->
        <div class="auth-label">패스워드 확인</div>
        <q-input
          ref="authpwdchk"
          name="authpwdchk"
          v-model="pwdchk"
          type="password"
          data-vv-scope="reginfo"
          v-validate="`required|pwdcheck:${pwd}`"
          dense
          outlined
          class="form-all-input"
          :error="errors.has('reginfo.authpwdchk')"
          :error-message="getValidateMessage('authpwdchk')"
        />
        <!-- Name 입력 -->
        <div class="auth-label">이름</div>
        <q-input
          ref="name"
          name="name"
          v-model="name"
          data-vv-scope="reginfo"
          v-validate="'required'"
          dense
          outlined
          class="form-all-input"
          :error="errors.has('reginfo.name')"
          :error-message="getValidateMessage('name')"
        />
        <!-- 성별 -->
        <div class="auth-label">성별</div>
        <div class="q-gutter-sm form-all-input">
          <q-radio left-label v-model="gender" val="man" label="남자" color="indigo"/>
          <q-radio left-label v-model="gender" val="female" label="여자" color="indigo"/>
        </div>
        <!-- 핸드폰 -->
        <div class="auth-label">핸드폰</div>
        <q-input
          ref="phone"
          name="phone"
          v-model="phone"
          data-vv-scope="reginfo"
          v-validate="'required|phone'"
          dense
          outlined
          mask="###-####-####"
          class="form-all-input"
          :error="errors.has('reginfo.phone')"
          :error-message="getValidateMessage('phone')"
        />
        <!-- 이메일 -->
        <div class="auth-label">이메일</div>
        <q-input
          ref="email"
          name="email"
          v-model="email"
          data-vv-scope="reginfo"
          v-validate="'required'"
          dense
          outlined
          disable
          class="form-all-input"
          hint="본인인증을 받은 이메일은 수정 할 수 없습니다."
          :error="errors.has('reginfo.email')"
          :error-message="getValidateMessage('email')"
        />
        <!-- 관리자 페이지 FORM:Start  -->
        <div v-if="type === 'manager'" class="auth-label">사업장 명</div>
        <q-input
          v-if="type === 'manager'"
          name="gym"
          v-model="gym"
          data-vv-scope="reginfo"
          v-validate="'required'"
          dense
          outlined
          class="form-all-input"
          :error="errors.has('reginfo.gym')"
          :error-message="getValidateMessage('gym')"
        />
        <!-- 관리자 페이지 FORM:END  -->
      </div>
      <h3 class="form-title">
        유의 사항
      </h3>
      <div class="form-desc">
        <ul style="list-style: decimal;">
          <li>등록 불가 업으로 확인될 경우 이용에 제한이 있을 수 있습니다.</li>
          <li>직접홍보 게시판 이용 신청 후 최대 24시간 이내에 관리자가 확인 후 등록합니다(주말/공휴일 제외)</li>
          <li>등록규칙을 어기면 해당 글은 삭제되며 재발 시 더 이상 글을 등록할 수 없으니, 꼭 게시물 등록규칙을 숙지하여 주시기 바랍니다.</li>
          <li>
            건전성을 해치거나 현행법을 어기는 행위는 금지하며 삭제됩니다.
            <ul>
              <li>대출, 성인, 피라미드, 짝퉁상품 판매 등</li>
              <li>기타 적합하지 않은 상품</li>
            </ul>
          </li>
          <li>
            회원기만행위는 용납되지 않습니다.
            <ul>
              <li>타 게시판에 회원인척 자사의 제품을 홍보하는 행위</li>
              <li>자신의 홍보게시물에 회원인척 리플로 상품 홍보를 보조하는 행위</li>
              <li>경쟁사 홍보물을 고의적으로 비난하는 행위</li>
              <li>기타 적법하지 못한 방법으로 홍보하는 행위</li>
            </ul>
          </li>
        </ul>
      </div>
      <q-checkbox
        v-model="isAgree"
        style="padding: 5px 0px 15px 10px; float: right;"
        class="ma-0"
        color="indigo"
        label="유의사항을 숙지하였으며, 동의합니다."
      />
    </div>
    <q-separator class="q-my-md" />
    <div>
      <div class="column items-center">
        <div class="col">
          <q-btn
            :to="'/auth/join'"
            style="margin-right:15px;"
          >
            취소
          </q-btn>
          <q-btn
            color="indigo"
            :disabled="!isAgree"
            @click="onJoinRegistor"
          >
            회원가입
          </q-btn>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ValidateMixin from '../../../mixins/validateMixin'
export default {
  name: 'JoinUserInfoTemplate',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  props: {
    type: {
      type: String,
      default: 'user'
    }
  },
  data () {
    return {
      id: '',
      pwd: '',
      pwdchk: '',
      name: '',
      gender: 'man',
      phone: '',
      gym: void 0,
      isAgree: false,
      matchid: ''
    }
  },
  computed: {
    ...mapState('auth', [
      'email'
    ])
  },
  mounted () {
  },
  methods: {
    ...mapActions('auth', [
      'reqIdCheck',
      'reqRegsterMember'
    ]),
    /**
     * 회원 가입
     */
    async onJoinRegistor () {
      const reqValidate = await this.$validator.validateAll('reginfo')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      // TODO: ID확인 후에 멤버를 추가하기.
      this.$loader.show({
        state: '아이디 확인 중...'
      })
      const resIdCheck = await this.reqIdCheck({ id: this.id })
      if (resIdCheck.code === 'ok') {
        this.$loader.setState('아이디 확인 완료')
        await this.$sleep(1000)
      }
      if (resIdCheck.code === 'err') {
        this.$alert.show('error', resIdCheck.msg)
        return
      }

      this.$loader.setState('회원 등록 중...')
      const data = {
        id: this.id,
        password: this.pwd,
        name: this.name,
        gender: this.gender,
        phone: this.phone,
        email: this.email
      }

      if (this.type === 'manager') {
        data.gym = this.gym
      }

      const resResgiser = await this.reqRegsterMember({ type: this.type, data })
      if (resResgiser.code === 'ok') {
        this.$loader.setState('회원 등록 완료')
        this.$sleep(1000)
        this.$emit('complete')
      }
      if (resResgiser.code === 'err') {
        this.$alert.show('error', resResgiser.msg)
      }
      this.$loader.hide()
    },
    /**
     * ID 확인
     */
    async onIdCheck () {
      const reqValidate = await this.$validator.validate('reginfo.authid')
      if (!reqValidate) return
      this.$loader.show({
        state: '아이디 확인 중...'
      })
      const { code, msg } = await this.reqIdCheck({ id: this.id })
      if (code === 'ok') {
        this.$loader.setState('아이디 확인 완료')
        await this.$sleep(1500)
        this.matchid = this.id.toString()
      }
      if (code === 'error') {
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
  padding: 10px 0 10px 10px;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  font-weight: normal;
  text-align: left;
}
.form-content {
  display: grid;
  grid-template-columns: 140px auto 62px;
  padding: 10px;
  border-width: 1px 1px 1px 3px;
  border-style: solid;
  border-color: rgba(0,0,0,0.12);
  background: #F1F1F1;
  border-left-color: #3f51b5;
  border-radius: 4px;
}
.form-all-input {
  grid-column: 2/4;
}
.form-btn {
  margin: 0 0 20px 2px;
  width: 60px;
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
</style>
