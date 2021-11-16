<template>
  <div class="auth-grid-container">
    <div class="auth-gird-header"></div>
    <!-- 타이틀 & 로고 영역 -->
    <!-- <div class="grid-title"></div> -->
    <!-- 배경 영역 -->
    <div
      id="particles-js"
      :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
    ></div>
    <div class="auth-grid-body">
      <div class="auth-grid-left" />
      <!-- 카드 영역 -->
      <div class="auth-grid-center">
        <q-card>
          <q-card-section>
            <div class="column items-center">
              <div class="col">
                <p class="auto-title">
                  Finest 로그인
                </p>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <!-- ID 입력 -->
            <q-input
              name="authid"
              v-model="id"
              label="ID"
              v-validate="'required'"
              @keyup.enter="onClickLoginBtn"
              :error="errors.has('authid')"
              :error-message="getValidateMessage('authid')"
            />
            <!-- PASSWORD 입력 -->
            <q-input
              ref="authpwd"
              name="authpwd"
              v-model="pwd"
              label="Password"
              type="password"
              v-validate="'required'"
              @keyup.enter="onClickLoginBtn"
              :error="errors.has('authpwd')"
              :error-message="getValidateMessage('authpwd')"
            />
            <q-checkbox
              v-model="isSaveLogin"
              color="indigo"
              label="ID 저장"
            />
            <q-btn
              label="로그인"
              glossy
              color="indigo"
              class="full-width q-mt-md"
              @click="onClickLoginBtn"
            />
          </q-card-section>

          <q-card-section>
            <q-separator />
            <!-- 하단 -->
            <div class="find_info">
              <div @click="renderToFindAccount">
                아이디/비밀번호 찾기
              </div>
              <span
                class="bar"
                aria-hidden="true"
              >|</span>
              <div @click="renderToJoin">
                회원가입
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="auth-grid-right" />
    </div>
    <div class="auth-grid-footer"></div>
  </div>
</template>

<script>
import ValidateMixin from '../../mixins/validateMixin'
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  data () {
    return {
      id: '',
      pwd: '',
      isSaveLogin: false
    }
  },
  mounted () {
    this.loadLoginState()
    /* global particlesJS */
    /* eslint no-undef: "error" */
    particlesJS.load('particles-js', 'particles.json', () => {
      console.log('callback - particles.js config loaded')
    })
  },
  methods: {
    ...mapActions('auth', [
      'reqLogin'
    ]),
    async onClickLoginBtn () {
      const reqValidate = await this.$validator.validateAll()
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      this.$loader.show({
        state: '로그인 중...'
        // useButtons: ['confirm']
      })
      if (this.isSaveLogin) this.saveLoginState(this.id)
      if (!this.isSaveLogin) this.saveLoginState('')
      this.$loader.setState('정보를 가져오는 중')
      const { code, msg } = await this.reqLogin({ id: this.id, password: this.pwd })
      // if (code === 'ok') {
      if (code === 'ok') {
        await this.$sleep(1000)
        this.$loader.setState('페이지에 접속합니다.')
        await this.$sleep(1000)
        this.$loader.hide()
        this.$router.push('/manager/schedule/StaffSchedule')
      } else if (code === 'err') {
   
        this.$loader.hide()
        this.pwd = ''
        this.$alert.show('info', msg)
     
      }
    },
    /**
     * 로그인 상태 로드
     */
    loadLoginState () {
      const id = window.localStorage.getItem('id')
      if (id) {
        this.id = id
        this.isSaveLogin = true
      }
    },
    /**
     * 로그인 상태 저장
     */
    saveLoginState (id) {
      window.localStorage.setItem('id', id)
    },
    /**
     * ID/PW 찾기 페이지로 이동
     */
    renderToFindAccount () {
      this.$router.push({ path: '/auth/findAccountCert' })
    },
    /**
     * 회원가입 페이지로 이동
     */
    renderToJoin () {
      this.$router.push({ path: '/auth/join' })
    }
  }
}
</script>

<style lang="scss" scoped>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(145deg, rgb(74, 94, 137) 15%, #b61924 70%);
}
.dark_gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}

.find_info {
  font-size: 12px;
  padding-top: 6px;
  text-align: center;
  color: #8e8e8e;
  border-top: 1px solid #e4e4e5;
  cursor: pointer;
  div {
    font-size: 12px;
    line-height: 13px;
    display: inline-block;
    text-decoration: none;
    color: #8e8e8e;
  }
  .bar {
    display: inline-block;
    width: 1px;
    height: 13px;
    text-indent: -999em;
    background: #e4e4e5;
    margin: 0 4px;
    position: relative;
    top: 1px;
    line-height: 1.25em;
  }
}
</style>
