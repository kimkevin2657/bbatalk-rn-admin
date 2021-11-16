/*
  회원권 현황 페이지
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
      <!---그리드 끝 --->
      <membership-ticket-data-list
        ref="dataTable"
        @selected="(val) => { rowsSelected = val }"
        @updated="(row) => $refs.membershipRegistPopup.show({ticketInfo: row})"
        @payment="onPayment"
        @transfer="onTransfer"
        @refund="onRefund"
        @delay="onDelay"
        @pause="onPause"
      />

      <!-- 팝업 -->
      <membership-regist-popup ref="membershipRegistPopup" />
      <!-- 환불 처리 팝업 -->
      <ticket-refund-popup
        ref="TicketRefundPopup"
        type="membership"
      />
      <!-- 양도 처리 팝업 -->
      <ticket-transfer-popup
        ref="TicketTransferPopup"
        :type="'membership'"
      />

      <!-- 기간 연장 팝업 -->
      <ticket-delay-popup
        ref="TicketDelayPopup"
        :type="'membership'"
      />
      <!-- 기간 정지 팝업 -->
      <ticket-pause-popup
        ref="TicketPausePopup"
        :type="'membership'"
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
import MembershipTicketDataList from './dataTable/MembershipTicketDataList'

// Popup
import MembershipRegistPopup from './popup/MembershipRegistPopup'
import TicketRefundPopup from './popup/TicketRefundPopup'
import TicketTransferPopup from './popup/TicketTransferPopup'
import TicketDelayPopup from './popup/TicketDelayPopup'
import TicketPausePopup from './popup/TicketPausePopup'
export default {
  name: 'MembershipTicket',
  mixins: [MsgMixin],
  components: {
    Top,
    MembershipRegistPopup,
    HeaderEditTemplate,
    TicketRefundPopup,
    TicketTransferPopup,
    TicketDelayPopup,
    TicketPausePopup,
    MembershipTicketDataList
  },
  data () {
    return {
      rowsSelected: []
    }
  },
  computed: {
    ...mapState('ticket', [
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
    await this.reqGetTicketDataList({ type: 'membership' })
  },
  methods: {
    ...mapActions('ticket', [
      'reqGetTicketDataList', // 모든 회원권 리스트 가져오기 요청
      'reqRemoveTicket',
      'reqUpdateTicket'
    ]),
    onAdd () {
      this.$refs.membershipRegistPopup.show()
    },
    onEdit () {
      this.$refs.membershipRegistPopup.show({ ticketInfo: this.rowsSelected[0] })
    },
    async removeTicket () {
      try {
        let reqQuery = { type: 'membership' }
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
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    // 결재 완료
    onPayment (row) {
      const msgArr = [
        `회원명: ${row.name}(${row.special_n})`,
        `회원권: ${row.session}`,
        '회원권을 결재완료 처리하시겠습니까?'
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
        self.reqUpdateTicket({ type: 'membership', row: setRow })
      })
    },
    // 만료 여부 확인
    isExpired (edate) {
      return this.$moment().isAfter(this.$moment(edate))
    },
    // 회원권 양도 팝업 출력
    onTransfer (row) {
      if (!row) return this.$notify.error('선택된 회원권이 없습니다.')
      if (this.gymData.transferPolicy === 0) return this.$notify.error('양도 정책에 의하여 양도가 불가능합니다.')
      if (this.isExpired(row.edate)) {
        this.$notify.error('이미 만료되어 양도 할 수 없습니다.')
        return
      }
      this.$refs.TicketTransferPopup.show(row)
    },
    // 회원권 환불 팝업 출력
    onRefund (row) {
      if (!row) return this.$notify.error('선택된 회원권이 없습니다.')
      if (this.isExpired(row.edate)) {
        this.$notify.error('이미 만료되어 양도 할 수 없습니다.')
        return
      }
      this.$refs.TicketRefundPopup.show(row)
    },
    // 수강권 기간 연장 팝업 출력
    onDelay (row) {
      if (!row) return this.$notify.error('선택된 회원권이 없습니다.')
      if (this.isExpired(row.edate)) {
        this.$notify.error('이미 만료되어 기간연장을 할 수 없습니다.')
        return
      }
      this.$refs.TicketDelayPopup.show(row)
    },
    // 수강권 일시정지 팝업 출력
    onPause (row) {
      if (!row) return this.$notify.error('선택된 회원권이 없습니다.')
      if (this.isExpired(row.edate)) {
        this.$notify.error('이미 만료되어 일시정지를 할 수 없습니다.')
        return
      }
      this.$refs.TicketPausePopup.show(row)
    },
    showRegPopup (rowData) {
      this.$refs.membershipRegistPopup.show({ ticketInfo: rowData })
    }
  }
}
</script>
