<template>
  <agree-dialog
    ref="agreeDialog"
    :title="title"
    :width="660"
    :height="700"
    :useButtons="['cancel', 'confirm']"
    :textArr="['환불 관련 약관']"
    @confirm="onRefund()"
  >
    <div class="row q-col-gutter-x-md" style="margin: 0px;">
      <q-input
        name="name"
        v-model="ticketData.name"
        :hint="ticketData.memberid ? `${ticketData.name} (${ticketData.special_n})` : ''"
        label="* 회원명"
        data-vv-scope="ticket"
        v-validate="'required'"
        :error="errors.has('ticket.name')"
        :error-message="getValidateMessage('name')"
        dense
        readonly
        :disable="true"
        class="col-12"
        hide-bottom-space
      />
      <!-- 수강권 -->
      <q-input
        label="수강권"
        :value="ticketData.session"
        dense
        :disable="true"
        class="col-12"
      />
      <!-- 수강 정보 -->
      <div class="col-md-6 col-12">
        <div class="q-mt-md">
          <b>{{type === 'lesson' ? '수강권 정보' : '회원권 정보'}}</b>
        </div>
        <q-list class="q-mt-sm q-pa-sm" bordered dense>
          <!-- 등록 횟수 -->
          <q-item v-if="type === 'lesson'" style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">등록 횟수</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${ticketData.totCnt}회`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 사용 횟수 -->
          <q-item v-if="type === 'lesson'" style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">사용 횟수</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${ticketInfo.useCnt}회`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 사용 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">등록 기간</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{ticketInfo.useDate}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 사용 일 -->
          <q-item v-if="type === 'membership'" style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">사용 일</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${ticketInfo.useDayCnt}일`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 사은품 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">사은품</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">
                {{`${_.get(this.ticketData, 'gifts', []).join(', ')}`}}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <!-- 결재 유형 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">결재 유형</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{this.ticketData.priceType}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 카드+현금+vat -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">카드+현금+vat</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">
                {{`${(_.get(this.ticketData, 'cash', 0) + _.get(this.ticketData, 'card', 0) + _.get(this.ticketData, 'vat', 0)).toLocaleString()}원`}}
              </q-item-label>
            </q-item-section>
          </q-item>
          <!-- 포인트-->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">사용 포인트</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">
                {{`${_.get(this.ticketData, 'point', 0).toLocaleString()}`}}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <!-- 결재 금액 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">결재 금액</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">
                {{`${_.get(this.ticketData, 'purchase', 0).toLocaleString()}원`}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- 환불 정보 -->
      <div class="col-md-6 col-12">
        <div class="q-mt-md">
          <b>환불 정보</b>
        </div>
        <q-list class="q-mt-sm q-pa-sm" bordered dense>
          <!-- 환불 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">환불 기간</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{refundInfo.refundDate}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 환불 횟수 -->
          <q-item v-if="type === 'lesson'" style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">환불 횟수</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${refundInfo.refundCnt}회`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 환불 일 -->
          <q-item v-else style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">환불 일</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${refundInfo.refundDayCnt}일`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 1일(회) 금액 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">{{`${this.type === 'lesson' ? '1회 금액' : '1일 금액'}`}}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${defPrice.toLocaleString()}원`}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator/>
          <!-- 이용 금액 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">이용 금액</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none text-primary">{{`${ticketInfo.usePrice.toLocaleString()}원`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 추가공제 금액 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">추가공제 금액</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none text-primary">{{`${ticketData.refund_steal.toLocaleString()}원`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 위약금 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">위약금(10%)</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none text-primary">{{`${ticketData.refund_penalty.toLocaleString()}원`}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <!-- 반환 포인트 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">반환 포인트</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none text-negative">{{`${ticketData.refund_point.toLocaleString()}`}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <!-- 환불 금액 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">환불 금액</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${refundInfo.refundReturn.toLocaleString()}원`}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- 1일(회) 금액 -->
      <q-input
        :label="type === 'lesson' ? '1회 금액' : '1일 금액'"
        v-model.number="defPrice"
        dense
        suffix="원"
        class="col-12"
      >
        <template #before>
          <q-icon name="mdi-calendar-today" />
        </template>
      </q-input>
      <!-- 추가 공제 금액 -->
      <q-input
        :label="'추가 공제 금액(사은품, 상품권 등)'"
        v-model.number="ticketData.refund_steal"
        dense
        suffix="원"
        class="col-12"
      >
        <template #before>
          <q-icon name="mdi-file-document-box-minus-outline" />
        </template>
      </q-input>
      <q-input
        name="point"
        label="반환 포인트"
        v-model.number="ticketData.refund_point"
        :max="enablePoint"
        type="number"
        class="col-12"
        data-vv-scope="ticket"
        v-validate="`min_value:0|max_value:${enablePoint}`"
        :error="errors.has('ticket.point')"
        :error-message="getValidateMessage('point')"
        dense
        :hint="`반환가능한 포인트: ${enablePoint}`"
        @blur="() => { if(!ticketData.refund_point) ticketData.refund_point = 0 }"
      >
        <template #before>
          <q-icon name="mdi-file-powerpoint-box-outline" />
        </template>
      </q-input>
      <!-- 환불 설정 -->
      <div class="col-12 q-mt-md">
        <b>환불 설정</b>
      </div>
      <q-input
        name="refundReg"
        label="* 환불 등록일"
        v-model="ticketData.refund_reg"
        mask="####-##-##"
        class="col-6"
        data-vv-scope="ticket"
        v-validate="'required'"
        :disable="true"
        :error="errors.has('ticket.refundReg')"
        :error-message="getValidateMessage('refundReg')"
        dense
        hide-bottom-space
      >
        <template #append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy3" transition-show="scale" transition-hide="scale">
              <q-date v-model="ticketData.refund_reg" mask="YYYY-MM-DD" @input="() => $refs.qDateProxy3.hide()" :locale="locale" minimal/>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-select
        label="* 은행"
        name="refundBank"
        v-model="ticketData.refund_bank"
        class="col-6"
        :options="bankOpts"
        @filter="(val, update) => { filterBank = val; update() }"
        hide-selected
        use-input
        fill-input
        input-debounce="0"
        data-vv-scope="ticket"
        v-validate="'required'"
        :error="errors.has('ticket.refundBank')"
        :error-message="getValidateMessage('refundBank')"
        hide-bottom-space
        autocomplete="off"
        dense
      >
        <template #before>
          <q-icon name="mdi-bank-outline" />
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              검색 결과가 없습니다.
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        label="* 계좌"
        name="refundAccount"
        v-model="ticketData.refund_account"
        data-vv-scope="ticket"
        v-validate="'required'"
        :error="errors.has('ticket.refundAccount')"
        :error-message="getValidateMessage('refundAccount')"
        class="col-6 q-pr-sm"
        dense
      >
        <template #before>
          <q-icon name="mdi-book-open-outline" />
        </template>
      </q-input>
      <q-input
        label="* 예금주"
        name="refundtName"
        v-model="ticketData.refund_name"
        data-vv-scope="ticket"
        v-validate="'required'"
        :error="errors.has('ticket.refundtName')"
        :error-message="getValidateMessage('refundtName')"
        class="col-6"
        dense
      >
        <template #before>
          <q-icon name="mdi-account-outline"/>
        </template>
      </q-input>
      <q-input
        label="* 환불 사유"
        name="refundCause"
        v-model="ticketData.refund_cause"
        data-vv-scope="ticket"
        v-validate="'required'"
        :error="errors.has('ticket.refundCause')"
        :error-message="getValidateMessage('refundCause')"
        class="col-12"
        dense
      >
        <template #before>
          <q-icon name="mdi-comment-question-outline"/>
        </template>
      </q-input>
    </div>
  </agree-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// mixin
import CalendarMixin from 'src/mixins/calendarMixin'
import ValidateMixin from 'src/mixins/validateMixin'
// popup
import AgreeDialog from 'components/dialog/AgreeDialog'
export default {
  name: 'TicketRefundPopup',
  components: {
    AgreeDialog
  },
  inject: ['$validator'],
  mixins: [CalendarMixin, ValidateMixin],
  data () {
    return {
      title: '환불 처리',
      availablePoint: 0, // 사용가능한 포인트
      filterBank: '',
      filterInputStaff: '',
      filterConsultStaff: '',
      defPrice: 0 // 1일(회) 금액
    }
  },
  props: {
    type: {
      type: String,
      default: 'lesson'
    }
  },
  computed: {
    ...mapState('ticket', [
      'lessonData',
      'membershipData',
      'newTicket'
    ]),
    ...mapState('staff', [
      'staffDataList'
    ]),
    ...mapState('gym', [
      'gymData'
    ]),
    ...mapState('setting', [
      'bankList'
    ]),
    ...mapState('defineDatas', [
      'membershipDefineData',
      'lessonDefineData'
    ]),
    ticketData () {
      if (this.type === 'lesson') return this.lessonData
      if (this.type === 'membership') return this.membershipData
      return this.lessonData
    },
    // 상담 직원 목록
    consultStaffOpts () {
      const needle = this.filterConsultStaff.toLowerCase()
      return _.map(this.staffDataList, (staff) => {
        const team = staff.team ? `${staff.team} ` : ''
        return `${team}${staff.name}(${staff.special_n})`
      }).filter(o => {
        return o.toLowerCase().indexOf(needle) > -1
      })
    },
    // 입력 직원 목록
    inputStaffOpts () {
      const needle = this.filterInputStaff.toLowerCase()
      return _.map(this.staffDataList, (staff) => {
        const team = staff.team ? `${staff.team} ` : ''
        return `${team}${staff.name}(${staff.special_n})`
      }).filter(o => {
        return o.toLowerCase().indexOf(needle) > -1
      })
    },
    // 환불 은행 목록
    bankOpts () {
      const needle = this.filterBank.toLocaleString()
      let list = _.cloneDeep(this.bankList)
      return list.filter(o => {
        return o.toLowerCase().indexOf(needle) > -1
      })
    },
    enablePoint () {
      // 총 사용금액 = 이용금액 + 추가 공제 + 위약금
      const totUsedPrice = this.ticketInfo.usePrice + this.ticketData.refund_steal + this.ticketData.refund_penalty
      if (this.availablePoint > totUsedPrice) return totUsedPrice
      else return this.availablePoint
    },
    // 양도자 정보
    ticketInfo () {
      let sdate = void 0
      let edate = void 0
      let dateStr = ''
      let useDayCnt = 0
      // 전체 기간
      const sd = this.$moment(this.ticketData.sdate)
      const ed = this.$moment(this.ticketData.edate)
      if (sd.year() === ed.year()) {
        dateStr = `${sd.format('YYYY-MM-DD')} ~ ${ed.format('MM-DD')}`
      } else {
        dateStr = `${sd.format('YYYY-MM-DD')} ~ ${ed.format('YYYY-MM-DD')}`
      }
      // 사용 기간 도출
      if (this.$moment(this.$moment().format('YYYY-MM-DD')).isAfter(this.$moment(this.ticketData.sdate).format('YYYY-MM-DD'))) {
        sdate = this.$moment(this.ticketData.sdate)
        const currentTime = this.$moment().add(-1, 'day')
        edate = this.$moment(currentTime.format('YYYY-MM-DD 23:59:59'))
        useDayCnt = edate.diff(sdate, 'days') + 1
      } else {  // 사용하지 않은 티켓 양도
        sdate = this.$moment(this.ticketData.sdate)
        edate = this.$moment(this.ticketData.sdate)
        dateStr = '사용 안함'
        useDayCnt = 0
      }

      let usePrice = 0
      if (this.type === 'lesson') {
        usePrice = this.defPrice * this.ticketData.useCnt
      } else {
        usePrice = this.defPrice * useDayCnt
      }

      let opts = {
        sdate: sdate,
        edate: edate,
        useDate: dateStr,
        useDayCnt: useDayCnt,
        usePrice
      }
      if (this.type === 'lesson') opts.useCnt = this.ticketData.useCnt
      return opts
    },
    // 환불 정보
    refundInfo () {
      const currentTime = this.$moment()
      let sdate = void 0
      let edate = void 0
      let dateStr = void 0

      if (this.$moment().isAfter(this.ticketData.sdate)) {
        sdate = this.$moment(currentTime.format('YYYY-MM-DD 00:00:00'))
        edate = this.$moment(this.ticketData.edate)
      } else {
        sdate = this.$moment(this.ticketData.sdate)
        edate = this.$moment(this.ticketData.edate)
      }
      if (sdate.year() === edate.year()) {
        dateStr = `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('MM-DD')}`
      } else {
        dateStr = `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('YYYY-MM-DD')}`
      }
      const dayCnt = edate.diff(sdate, 'days') + 1

      const opts = {
        sdate: sdate,
        edate: edate,
        refundDate: dateStr,
        refundDayCnt: dayCnt, // 환불 일
        refundCnt: 0 // 환불 횟수

      }
      if (this.type === 'lesson') {
        // 남은 수강 횟수
        opts.refundCnt = this.ticketData.totCnt - this.ticketData.useCnt
        // 수강권 환불액
        opts.refundReturn = this.ticketData.purchase
        opts.refundReturn -= (this.defPrice * this.ticketInfo.useCnt) // 이용 금액 차감
        opts.refundReturn -= this.ticketData.refund_steal     // 추가 공제 금액 차감
        opts.refundReturn -= this.ticketData.refund_penalty   // 위약금 차감
        opts.refundReturn += this.ticketData.refund_point     // 포인트에서 차감, 환불액은 증가
      } else {
        // 회원권 환불액
        opts.refundReturn = this.ticketData.purchase
        opts.refundReturn -= (this.defPrice * this.ticketInfo.useDayCnt) // 이용 금액 차감
        opts.refundReturn -= this.ticketData.refund_steal     // 추가 공제 금액 차감
        opts.refundReturn -= this.ticketData.refund_penalty   // 위약금 차감
        opts.refundReturn += this.ticketData.refund_point     // 포인트에서 차감, 환불액은 증가
      }
      return opts
    }
  },
  methods: {
    ...mapActions('staff', [
      'reqGetStaffDataList'
    ]),
    ...mapActions('defineDatas', [
      'reqGetDefineData'
    ]),
    ...mapActions('setting', [
      'reqGetBank'
    ]),
    ...mapActions('ticket', [
      'reqRefundTicket',
      'reqGetTicketData'
    ]),
    ...mapMutations('ticket', [
      'initTicketData',
      'setNewTicket'
    ]),
    ...mapActions('gym', [
      'reqGetGymData'
    ]),
    // 결재 정보 유효성 검사
    calcValidate () {
      return this.refundInfo.refundReturn > 0
    },
    // 티켓 환불
    async onRefund () {
      const reqValidate = await this.$validator.validateAll('ticket')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const isCalcValid = this.calcValidate()
      if (!isCalcValid) return this.$notify.error('환불 금액이 결제 금액을 넘어 설 수 없습니다.')

      this.ticketData.pay_state = 3 // 환불 상태로 변경
      this.ticketData.refund_usePrice = this.ticketInfo.usePrice // 이용 금액 주입
      this.ticketData.refund_price = this.refundInfo.refundReturn // 환불금 주입
      this.ticketData.purchase -= this.refundInfo.refundReturn  // 구매금 재 설정
      this.ticketData.edate = this.$moment(this.ticketData.refund_reg)
      if (this.type === 'lesson') {
        this.ticketData.totCnt = this.ticketData.totCnt - this.refundInfo.refundCnt
      }

      try {
        const { code } = await this.reqRefundTicket({ type: this.type })
        if (code === 'ok') {
          this.$refs.agreeDialog.hide()
        }
      } catch (e) {
        return this.$notify.error(e.toString())
      }
    },
    async initData (data) {
      this.initTicketData()
      await Promise.all([
        this.reqGetStaffDataList(), // 스태프 목록
        this.reqGetTicketData({ _id: data._id, type: this.type }),
        this.reqGetBank(), // 은행 목록 조회
        this.reqGetGymData()  // 센터 정보 조회
      ])
      await this.reqGetDefineData({ type: this.type, _id: this.ticketData.sessionid })

      await this.$nextTick()
      if (this.type === 'lesson') {
        this.defPrice = _.get(this.lessonDefineData, 'refundPrice')
      } else {
        this.defPrice = _.get(this.membershipDefineData, 'refundPrice')
      }
      this.ticketData.refund_reg = this.$moment().format('YYYY-MM-DD')
      this.availablePoint = this.ticketData.point // 해당 티켓의 구매한 만큼의 포인트만 반환 받을 수 있다.
      const penaltyTime = this.$moment(this.ticketData.pay_d).add(24, 'hours')
      if (penaltyTime < new Date()) {
        this.ticketData.refund_penalty = +Math.ceil(this.ticketData.purchase / 10)
      }
    },
    async show (ticketInfo) {
      await this.initData(ticketInfo)
      this.$refs.agreeDialog.show()
    }
  }
}
</script>
