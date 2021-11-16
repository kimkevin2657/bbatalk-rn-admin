<template>
  <div>
    <top>
      <template v-slot:body>
        <q-btn
          label="적용"
          color="blue-grey-8"
          @click="onUpdate"
        />
      </template>
    </top>
    <q-scroll-area style="height: calc(100vh - 108px);">
      <center-basic-card class="col-12" />
      <center-member-policy-card class="col-12" />
      <center-ticket-policy-card class="col-12" />
      <center-access-policy-card class="col-12" />
    </q-scroll-area>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// component
import Top from 'src/layouts/component/Top'
import CenterBasicCard from './CenterSetting/CenterBasicCard'
import CenterMemberPolicyCard from './CenterSetting/CenterMemberPolicyCard'
import CenterTicketPolicyCard from './CenterSetting/CenterTicketPolicyCard'
import CenterAccessPolicyCard from './CenterSetting/CenterAccessPolicyCard'
// mixin
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'CenterSetting',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  components: {
    Top,
    CenterBasicCard,
    CenterMemberPolicyCard,
    CenterTicketPolicyCard,
    CenterAccessPolicyCard
  },
  computed: {
    ...mapState('gym', [
      'gymData'
    ])
  },
  mounted () {
    this.reqGetGymData()
  },
  beforeDestroy () {
    this.reqGetGymData()
  },
  methods: {
    ...mapActions('gym', [
      'reqGetGymData',
      'reqUpdateGym'
    ]),
    isValidTime () {
      // 영업시작시간이 영업종료 시간보다 크지 않아야 한다.
      let stime = this.$moment(this.gymData.stime, 'hh:mm')
      let etime = this.$moment(this.gymData.etime, 'hh:mm')
      if (stime > etime) return false
      return true
    },
    async onUpdate () {
      const isValidT = this.isValidTime()
      if (!isValidT) return this.$notify.error('영업시간을 다시 설정하여 주세요.')
      const reqValidate = await this.$validator.validateAll('gym')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      this.reqUpdateGym()
    }
  }
}
</script>
