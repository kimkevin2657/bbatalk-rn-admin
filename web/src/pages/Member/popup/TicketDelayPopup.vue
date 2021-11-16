<template>
  <agree-dialog
    ref="agreeDialog"
    :title="title"
    :titleIcon="'mdi-calendar-arrow-right'"
    :width="660"
    :height="630"
    :textArr="accountTextArr"
    @confirm="onDelay()"
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
      <div class="col-12">
        <div class="q-mt-md">
          <b>기간연장</b>
        </div>
        <div class="row" style="margin: 5px 0px 5px 0px">
          <div class="col-6 bg-primary text-white" style="text-align: center;">유효 기간({{delayInfo.dayCnt}}일)</div>
          <!-- <div class="col-4 bg-negative text-white" style="text-align: center;">정지 기간</div> -->
          <div class="col-6 bg-secondary text-white" style="text-align: center;">연장 기간({{delayDay}}일)</div>
          <div class="col-12 bg-green text-white" style="text-align: center;">변경 기간({{delayInfo.dayCnt + delayDay}}일)</div>
        </div>
        <q-list class="q-mt-sm q-pa-sm" bordered dense>
          <!-- 유효 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">
                유효 기간 <div class="legend-primary" />
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{delayInfo.date}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 연장 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">
                연장 기간 <div class="legend-secondary" />
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{delayInfo.delay_date}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <!-- 변경 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">
                변경 기간 <div class="legend-green" />
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{delayInfo.after_date}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-input
        label="* 연장일"
        name="delayDay"
        v-model.number="delayDay"
        data-vv-scope="ticket"
        v-validate="`required|min_value: 1|max_value: ${limitDay}`"
        :error="errors.has('ticket.delayDay')"
        :error-message="getValidateMessage('delayDay')"
        dense
        suffix="일"
        :hint="`1~${limitDay}일 사이에서 연장일을 설정 할 수 있습니다.`"
        class="col-12"
      >
        <template #before>
          <q-icon name="mdi-calendar-arrow-right" />
        </template>
      </q-input>
      <q-input
        label="* 연장 사유"
        name="cause"
        v-model="delayTicketData.cause"
        data-vv-scope="ticket"
        v-validate="'required'"
        :error="errors.has('ticket.cause')"
        :error-message="getValidateMessage('cause')"
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
import { mapState, mapMutations, mapActions } from 'vuex'
// mixin
// import CalendarMixin from 'src/mixins/calendarMixin'
import ValidateMixin from 'src/mixins/validateMixin'
// 계약서
import delayTicket from 'assets/json/delayTicket.json'

import AgreeDialog from 'components/dialog/AgreeDialog'
export default {
  name: 'TicketDelayPopup',
  components: {
    AgreeDialog
  },
  mixins: [ValidateMixin],
  inject: ['$validator'],
  mounted () {
    this.accountTextArr = delayTicket.account
  },
  props: {
    type: { // 회원권 유형
      type: String,
      default: 'membership'
    }
  },
  data () {
    return {
      title: '기간연장 등록',
      accountTextArr: [],
      delayDay: 1,   // 연장 일
      limitDay: 0,   // 연장 가능일
      limitCnt: 0    // 연장 가능 횟수
    }
  },
  computed: {
    ...mapState('ticket', [
      'lessonData',
      'membershipData'
    ]),
    ...mapState('delayTicket', [
      'delayTicketData'
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
    delayInfo () {
      // 유효 기간
      let sdate = this.$moment(this.ticketData.sdate)
      let edate = this.$moment(this.ticketData.edate)
      let dateStr = void 0
      let dayCnt = edate.diff(sdate, 'days') + 1
      if (sdate.year() === edate.year()) {
        dateStr = `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('MM-DD')}`
      } else {
        dateStr = `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('YYYY-MM-DD')}`
      }
      // 연장 기간
      let d_sdate, d_edate, delayDateStr
      if (this.delayDay > 0) {
        d_sdate = this.$moment(edate).add(1, 'days')
        d_edate = this.$moment(d_sdate).add(this.delayDay - 1, 'days')
        if (d_sdate.year() === d_edate.year()) {
          delayDateStr = `${d_sdate.format('YYYY-MM-DD')} ~ ${d_edate.format('MM-DD')}`
        } else {
          delayDateStr = `${d_sdate.format('YYYY-MM-DD')} ~ ${d_edate.format('YYYY-MM-DD')}`
        }
      }
      let afterDateStr
      let a_edate = d_edate ? this.$moment(d_edate) : this.$moment(edate)
      if (sdate.year() === a_edate.year()) {
        afterDateStr = `${sdate.format('YYYY-MM-DD')} ~ ${a_edate.format('MM-DD')}`
      } else {
        afterDateStr = `${sdate.format('YYYY-MM-DD')} ~ ${a_edate.format('YYYY-MM-DD')}`
      }

      return {
        sdate,  // 유효 시작기간
        edate,  // 유효 종료기간
        dayCnt, // 유효기간 일
        d_sdate,  // 연장 시작기간
        d_edate,  // 연장 종료기간
        date: dateStr,  // 유효 기간
        delay_date: delayDateStr, // 연장 기간
        after_date: afterDateStr  // 변경 기간
      }
    }
  },
  methods: {
    ...mapActions('defineDatas', [
      'reqGetDefineData'
    ]),
    ...mapActions('ticket', [
      'reqGetTicketData',
      'reqDelayTicket'
    ]),
    ...mapMutations('ticket', [
      'initTicketData'
    ]),
    ...mapMutations('delayTicket', [
      'initDelayTicketData',
      'setDelayTicketData'
    ]),
    async onDelay () {
      const reqValidate = await this.$validator.validateAll('ticket')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      // 기간변경 주입
      const pickList = [
        'gymid',  // 기본정보
        'memberid', 'name', 'engName', 'special_n', // 회원 정보
        'staffid', 'staffName', 'staffEng', 'staffSpecial_n' // 강사 정보
      ]
      this.setDelayTicketData(_.assignIn(this.delayTicketData, _.pick(this.ticketData, pickList)))
      this.setDelayTicketData(_.assignIn(this.delayTicketData, {
        ticketid: this.ticketData._id,
        ticketName: this.ticketData.session,
        type: 'delay',      // 연장 유형
        d_type: this.type,  // 티켓 유형
        before_sdate: this.delayInfo.sdate, // 변경 전 시작일
        before_edate: this.delayInfo.edate, // 변경 전 종료일
        after_sdate: this.delayInfo.sdate,  // 변경 후 시작일
        after_edate: this.delayInfo.d_edate // 변경 후 종료일
      }))
      this.ticketData.sdate = this.delayInfo.sdate
      this.ticketData.edate = this.delayInfo.d_edate
      this.ticketData.delayCnt = _.get(this.ticketData, 'delayCnt', 0) + 1
      // 기간 연장 요청
      try {
        const { code } = await this.reqDelayTicket({ type: this.type })
        if (code === 'ok') {
          this.$refs.agreeDialog.hide()
        }
      } catch (e) {
        return this.$notify.error(e.toString())
      }
    },
    async initData (data) {
      this.delayDay = 1
      this.initTicketData()
      this.initDelayTicketData()
      await Promise.all([
        this.reqGetTicketData({ _id: data._id, type: this.type }) // 수강/회원권
      ])
      await this.reqGetDefineData({ type: this.type, _id: this.ticketData.sessionid }) // 관리 데이터(티켓)
      if (this.type === 'lesson') {
        this.limitCnt = _.get(this.lessonDefineData, 'delayCnt', 0)
        this.limitDay = _.get(this.lessonDefineData, 'delayDay', 0)
      } else {
        this.limitCnt = _.get(this.membershipDefineData, 'delayCnt', 0)
        this.limitDay = _.get(this.membershipDefineData, 'delayDay', 0)
      }
    },
    async show (ticketInfo) {
      await this.initData(ticketInfo)
      if (this.limitDay === 0) return this.$notify.error('연장 가능 일이 0일로 설정되어있습니다.')
      if (this.limitCnt === 0) return this.$notify.error('연장 가능 횟수가 0회로 설정되어있습니다.')
      this.$refs.agreeDialog.show()
    }
  }
}
</script>
