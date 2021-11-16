/*
  개인 회원의 기간변경 현황 페이지
 */
<template>
  <delay-ticket-data-list mini/>
</template>

<script>
// 상태 관리용 스토어 등록
import { mapState, mapActions } from 'vuex'

// 테이블
import DelayTicketDataList from 'src/pages/Member/dataTable/DelayTicketDataList'

export default {
  name: 'DelayTicketHistory',
  components: {
    DelayTicketDataList
  },
  data () {
    return {
    }
  },
  async mounted () {
    // 회원권 항목
    await this.reqGetDelayTicketDataList({ memberid: this.memberData._id })
  },
  computed: {
    ...mapState('member', [
      'memberData'
    ])
  },
  methods: {
    ...mapActions('delayTicket', [
      'reqGetDelayTicketDataList' // 모든 회원권 리스트 가져오기 요청
    ])
  }
}
</script>
