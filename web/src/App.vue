// 앱 부팅시 한번 호출

<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'App',
  async mounted () {
    // 계정의 최초 정보를 가져옴. 쿠키값 해석본
    const { code } = await this.reqCheck()
    if (code !== 'ok') this.$router.push('/auth/login')
  },
  methods: {
    ...mapActions('auth', [
      'reqCheck'
    ])
  }
}
</script>
