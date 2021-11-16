<template>
  <div class="auth-grid-container">
    <div class="auth-gird-header"></div>
    <!-- 타이틀 & 로고 영역 -->
    <!-- <div class="grid-title"></div> -->
    <div class="auth-grid-body">
      <div class="auth-grid-left" />
      <!-- 카드 영역 -->
      <div class="auth-grid-center">
        <q-card>
          <q-card-section>
            <div class="column items-center">
              <div class="col">
                <p class="auto-title">
                  Finest 회원가입
                </p>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-btn
              label="일반 회원 가입"
              glossy
              color="indigo"
              class="full-width q-mt-md"
              disable
              @click="renderToRegister('user')"
            />
            <q-btn
              label="강사 회원 가입"
              glossy
              color="teal"
              class="full-width q-mt-md"
              disable
              @click="renderToRegister('teacher')"
            />
            <q-btn
              label="기업 회원 가입"
              glossy
              color="red"
              class="full-width q-mt-md"
              @click="renderToRegister('manager')"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="auth-grid-right" />
    </div>
    <div class="auth-grid-footer"></div>
  </div>
</template>

<script>
export default {
  name: 'Join',
  data () {
    return {
    }
  },
  methods: {
    /**
     * 회원가입 페이지로 이동
     */
    renderToRegister (type) {
      if (type === 'user') return this.$router.push({ path: '/auth/regmember/user' })
      if (type === 'teacher') return this.$router.push({ path: '/auth/regmember/teacher' })
      if (type === 'manager') return this.$router.push({ path: '/auth/regmember/manager' })
    }
  }
}
</script>
