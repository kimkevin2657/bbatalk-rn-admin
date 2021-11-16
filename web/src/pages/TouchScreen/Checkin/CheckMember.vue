<template>
<div>
  <div class="row" v-show="!this.$q.fullscreen.isActive">
    <q-space />
    <q-btn icon="mdi-fullscreen" @click="$q.fullscreen.toggle()" flat/>
  </div>
  <div class="column items-center">
    <div class="col">
      <p class="auto-title">
        회원번호를 입력해주세요.
      </p>
    </div>
  </div>
  <!-- 터치 키보드 -->
  <touch-keyboard
    ref="touchKeyboard"
    @confirm="onConfirm"
    style="width: 55vw;"
  />
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TouchKeyboard from 'components/TouchKeyboard'
export default {
  name: 'Checkin',
  components: {
    TouchKeyboard
  },
  async mounted () {
    await this.reqGetGymData()
  },
  computed: {
    ...mapState('gym', [
      'gymData'
    ]),
    ...mapState('memberAccess', [
      'memberAccessData'
    ])
  },
  methods: {
    ...mapActions('gym', [
      'reqGetGymData'
    ]),
    ...mapActions('memberAccess', [
      'reqGetMemberAccessData',
      'reqAddMemberAccess'
    ]),
    // 회원 본인이 맞는지 확인
    memberCheck () {
      return new Promise((resolve, reject) => {
        const msg = `${this.memberAccessData.name}(${this.memberAccessData.special_n}) 회원님이 맞습니까?`
        const opts = {
          title: '본인확인',
          useButtons: ['confirm', 'close'],
          textAlign: 'left'
        }
        this.$msg.show(msg, opts, function (btnKey) {
          this.$msg.hide()
          if (btnKey === 'close') return resolve(false)
          return resolve(true)
        })
      })
    },
    // 회원 로그 추가
    async addLog () {
      await this.reqAddMemberAccess()
    },
    async onConfirm (val) {
      const { code } = await this.reqGetMemberAccessData({ specialn: +val })
      if (code === 'ok') {
        const isMemberCheck = await this.memberCheck()
        if (!isMemberCheck) return this.$refs.touchKeyboard.onClear()
        await this.addLog()
        this.$emit('next')
      }
    }
  }
}
</script>
