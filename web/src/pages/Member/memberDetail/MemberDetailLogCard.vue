// 회원정보 - 가입 정보 템플릿
<template>
  <q-card class="q-pb-sm">
    <div class="q-px-md">
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="membershipTicketHistory" label="회원권" />
        <q-tab name="lessonTicketHistory" label="수강권" />
        <q-tab name="reservationHistory" label="예약 현황" />
        <q-tab name="delayHistory" label="기간변경" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="membershipTicketHistory" class="q-pa-none">
          <membership-ticket-history />
        </q-tab-panel>

        <q-tab-panel name="lessonTicketHistory" class="q-pa-none">
          <lesson-ticket-history />
        </q-tab-panel>

        <q-tab-panel name="reservationHistory">
          <reserve-history />
        </q-tab-panel>

        <q-tab-panel name="delayHistory">
          <delay-history />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import lessonTicketHistory from './memberDetailLogCard/lessonTicketHistory'
import membershipTicketHistory from './memberDetailLogCard/membershipTicketHistory'
import reserveHistory from './memberDetailLogCard/reserveHistory'
import delayHistory from './memberDetailLogCard/delayTicketHistory'

export default {
  name: 'MemberDetailLogCard',
  components: {
    lessonTicketHistory,
    membershipTicketHistory,
    reserveHistory,
    delayHistory
  },
  computed: {
    ...mapState('member', [
      'memberData'
    ])
  },
  data () {
    return {
      tab: 'membershipTicketHistory'
    }
  }
}
</script>
