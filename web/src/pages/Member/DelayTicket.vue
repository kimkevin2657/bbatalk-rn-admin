/*
  기간변경 현황 페이지
 */
<template>
  <div>
    <top />
    <div class="q-pa-md">
      <!-- 서브 타이틀 -->
      <div class="row justify-between">
        <div class="col-4 text-h6"> </div>
        <q-page-sticky
          position="top-right"
          :offset="[13, 13]"
        >
          <div class="col-3 q-gutter-sm">
            <!-- <q-btn color="red-5" label="모두 지우기" @click="onClikcTest" /> -->
          </div>
        </q-page-sticky>
      </div>
      <!-- 기간연장 목록 -->
      <delay-ticket-data-list />
    </div>
  </div>
</template>

<script>
// 상태 관리용 스토어 등록
import { mapState, mapActions } from 'vuex'

// 컴포넌트
import Top from 'src/layouts/component/Top'

// 테이블
import DelayTicketDataList from './dataTable/DelayTicketDataList'

export default {
  name: 'DelayTicket',
  components: {
    Top,
    DelayTicketDataList
  },
  data () {
    return {
      // 검색 구분
      filter: ''
    }
  },
  computed: {
    ...mapState('delayTicket', [
      'dealyTicketDataList'
    ])
  },
  async mounted () {
    // 회원권 항목
    await this.reqGetDelayTicketDataList()
  },
  methods: {
    ...mapActions('delayTicket', [
      'reqGetDelayTicketDataList' // 모든 회원권 리스트 가져오기 요청
    ])
  }
}
</script>

<style lang="sass" scoped>
.row
  margin: 0px 0px 10px 0px
  padding: 0px 5px 0px 5px
</style>

<style scoped lang="scss">
.sub-title {
  display: grid;
  gap: 10px;
  width: 100%;
}
.condition-box {
  text-align: center;
  vertical-align: middle;
}

.form-row {
  background: rgba(255, 255, 255, 1);
  border: 1px;
  border-style: solid;
  border-color: rgba(122, 122, 124, 0.2);
  border-radius: 4px;
}
</style>
