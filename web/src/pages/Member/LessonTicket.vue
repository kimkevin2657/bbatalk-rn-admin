/*
  수강권 현황 페이지
 */
<template>
  <div>
    <top>
      <template #body>
        <q-btn
          label="양도"
          @click="onTransfer(rowsSelected[0])"
          style="margin-right: 10px;"
          dense
          flat
          :disable="isDisableSubBtn || gymData.transferPolicy === 0"
        />
        <q-btn
          label="환불"
          @click="onRefund(rowsSelected[0])"
          style="margin-right: 10px;"
          dense
          flat
          :disable="isDisableSubBtn"
        />
        <div style="border-right: 1px solid #ccc2c2;; width: 5px; height: 15px; margin-right: 10px;" />
        <header-edit-template
          @add="onAdd"
          @edit="onEdit"
          @remove="onRemove(removeTicket)"
          :disables="buttonDisables"
        />
      </template>
    </top>
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
      <!-- 수강권 테이블 -->
      <lesson-ticket-data-list
        ref="dataTable"
        @selected="(val) => { rowsSelected = val }"
        @updated="(row) => $refs.lessonRegistPopup.show({ticketInfo: row})"
        @payment="onPayment"
        @transfer="onTransfer"
        @refund="onRefund"
        @delay="onDelay"
        @pause="onPause"
      />

      <!-- 수강권 등록 팝업 -->
      <lesson-regist-popup ref="lessonRegistPopup" />
      <!-- 환불 처리 팝업 -->
      <ticket-refund-popup ref="TicketRefundPopup" />
      <!-- 양도 처리 팝업 -->
      <ticket-transfer-popup
        ref="TicketTransferPopup"
        :type="'lesson'"
      />
      <!-- 기간 연장 팝업 -->
      <ticket-delay-popup
        ref="TicketDelayPopup"
        :type="'lesson'"
      />
      <!-- 기간 정지 팝업 -->
      <ticket-pause-popup
        ref="TicketPausePopup"
        :type="'lesson'"
      />
    </div>
  </div>
</template>

<script>
// 상태 관리용 스토어 등록
import { mapState, mapActions } from 'vuex'

// 컴포넌트
import Top from 'src/layouts/component/Top'
import HeaderEditTemplate from 'src/layouts/template/HeaderEditTemplate'

// Mixin
import MsgMixin from 'src/mixins/msgMixin'

// DataTable
import LessonTicketDataList from './dataTable/LessonTicketDataList'

// Popup
import LessonRegistPopup from './popup/LessonRegistPopup'
import TicketRefundPopup from './popup/TicketRefundPopup'
import TicketTransferPopup from './popup/TicketTransferPopup'
import TicketDelayPopup from './popup/TicketDelayPopup'
import TicketPausePopup from './popup/TicketPausePopup'

export default {
  name: 'LessonTicket',
  mixins: [MsgMixin],
  components: {
    Top,
    HeaderEditTemplate,
    LessonRegistPopup,
    TicketRefundPopup,
    TicketTransferPopup,
    TicketDelayPopup,
    TicketPausePopup,
    LessonTicketDataList
  },
  data () {
    return {
      rowsSelected: []
    }
  },
  computed: {
    ...mapState('ticket', [
      'lessonDataList'
    ]),
    ...mapState('gym', [
      'gymData'
    ]),
    buttonDisables () {
      const selectedSize = _.size(this.rowsSelected)
      if (selectedSize === 0) return ['remove', 'edit']
      if (selectedSize === 1) return []
      if (selectedSize > 1) return ['edit']
      return []
    },
    isDisableSubBtn () {
      if (_.size(this.rowsSelected) !== 1) return true
      if (_.get(this.rowsSelected, [0, 'pay_state'], void 0) === 1) return false
      return true
    }
  },
  async mounted () {
    // 회원권 항목
    await this.reqGetTicketDataList({ type: 'lesson' })
  },
  methods: {
    ...mapActions('ticket', [
      'reqGetTicketDataList', // 모든 회원권 리스트 가져오기 요청
      'reqRemoveTicket',
      'reqUpdateTicket'
    ]),
    onAdd () {
      this.$refs.lessonRegistPopup.show()
    },
    onEdit () {
      this.$refs.lessonRegistPopup.show({ ticketInfo: this.rowsSelected[0] })
    },
    async removeTicket () {
      try {
        let reqQuery = { type: 'lesson' }
        if (_.size(this.rowsSelected) === 1) {
          reqQuery._id = _.get(this.rowsSelected, [0, '_id'], void 0)
        } else {
          reqQuery.ids = _.map(this.rowsSelected, o => {
            return o._id
          })
        }
        const { code } = await this.reqRemoveTicket(reqQuery)
        if (code === 'ok') {
          this.$refs.dataTable.init()
          this.rowsSelected = []
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    // 결재 완료
    onPayment (row) {
      const msgArr = [
        `회원명: ${row.name}(${row.special_n})`,
        `수강권: ${row.session}`,
        '수강권을 결재완료 처리하시겠습니까?'
      ]
      const opts = {
        title: '결재완료 처리',
        useButtons: ['confirm', 'cancel'],
        textAlign: 'left'
      }
      const self = this
      this.$msg.show(msgArr.join('\n'), opts, function (btnKey) {
        this.$msg.hide()
        if (btnKey !== 'confirm') return
        const setRow = _.cloneDeep(row)
        setRow.pay_state = 1
        setRow.pay_d = this.$moment().format('YYYY-MM-DD HH:mm')
        self.reqUpdateTicket({ type: 'lesson', row: setRow })
      })
    },
    // 만료 여부 확인
    isExpired (edate) {
      return this.$moment().isAfter(this.$moment(edate))
    },
    // 수강권 양도 팝업 출력
    onTransfer (row) {
      if (!row) return this.$notify.error('선택된 수강권이 없습니다.')
      if (this.gymData.transferPolicy === 0) return this.$notify.error('양도 정책에 의하여 양도가 불가능합니다.')
      if (this.isExpired(row.edate)) {
        this.$notify.error('이미 만료되어 양도 할 수 없습니다.')
        return
      }
      this.$refs.TicketTransferPopup.show(row)
    },
    // 수강권 환불 팝업 출력
    onRefund (row) {
      if (!row) return this.$notify.error('선택된 수강권이 없습니다.')
      if (this.isExpired(row.edate)) {
        this.$notify.error('이미 만료되어 양도 할 수 없습니다.')
        return
      }
      this.$refs.TicketRefundPopup.show(row)
    },
    // 수강권 기간 연장 팝업 출력
    onDelay (row) {
      if (!row) return this.$notify.error('선택된 수강권이 없습니다.')
      if (this.isExpired(row.edate)) {
        this.$notify.error('이미 만료되어 기간연장을 할 수 없습니다.')
        return
      }
      this.$refs.TicketDelayPopup.show(row)
    },
    // 수강권 일시정지 팝업 출력
    onPause (row) {
      if (!row) return this.$notify.error('선택된 수강권이 없습니다.')
      if (this.isExpired(row.edate)) {
        this.$notify.error('이미 만료되어 일시정지를 할 수 없습니다.')
        return
      }
      this.$refs.TicketPausePopup.show(row)
    },
    showRegPopup (rowData) {
      this.$refs.lessonRegistPopup.show({ ticketInfo: rowData })
    }
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
