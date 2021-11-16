<template>
  <agree-dialog
    ref="agreeDialog"
    :title="title"
    :titleIcon="'mdi-pause'"
    :width="660"
    :height="630"
    :textArr="['[일시 정지 약관]', '약관을 확인해 주세요.']"
    @confirm="onPause()"
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
          <b>일시정지</b>
        </div>
        <div class="row" style="margin: 5px 0px 5px 0px">
          <div class="col-4 bg-primary text-white" style="text-align: center;">사용가능 기간 A({{pauseInfo.usedDayCnt}}일)</div>
          <div class="col-4 bg-negative text-white" style="text-align: center;">정지 기간({{pauseDay}}일)</div>
          <div class="col-4 bg-secondary text-white" style="text-align: center;">사용가능 기간 B({{pauseInfo.useDayCnt}}일)</div>
        </div>
        <q-list class="q-mt-sm q-pa-sm" bordered dense>
          <!-- 유효 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">
                변경 전 기간
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{pauseInfo.dateStr}}({{pauseInfo.dayCnt}}일)</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <!-- 사용가능 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">
                사용가능 기간 A <div class="legend-primary" />
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{pauseInfo.usedDateStr}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 정지 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">
                정지 기간 <div class="legend-negative" />
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{pauseInfo.pauseDateStr}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 사용가능 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none" header lines="1">
                사용가능 기간 B<div class="legend-secondary" />
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{pauseInfo.useDateStr}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-input
        name="pauseSdate"
        label="* 정지 시작일"
        v-model="pauseSdate"
        mask="####-##-##"
        class="col-12"
        data-vv-scope="ticket"
        v-validate="`required|date|range_date:${puaseEnableDate.sdate},${puaseEnableDate.edate}`"
        :error="errors.has('ticket.pauseSdate')"
        :error-message="getValidateMessage('pauseSdate')"
        dense
        hide-bottom-space
        :hint="`정지 가능일: ${puaseEnableDate.sdate} ~ ${puaseEnableDate.edate}`"
        @focus="onStartDate"
      >
        <template #before>
          <q-icon name="mdi-calendar-today" />
        </template>
        <template #append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
              <q-date
                v-model="pauseSdate"
                mask="YYYY-MM-DD"
                :locale="locale"
                minimal
                @input="() => {
                  $refs.qDateProxy1.hide()
                  onStartDate()
                }"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        label="* 정지일"
        name="pauseDay"
        v-model.number="pauseDay"
        data-vv-scope="ticket"
        v-validate="`required|min_value: 1|max_value: ${limitDay}`"
        :error="errors.has('ticket.pauseDay')"
        :error-message="getValidateMessage('pauseDay')"
        dense
        suffix="일"
        :hint="`1~${limitDay}일 사이에서 정지일을 설정 할 수 있습니다.`"
        class="col-12"
      >
        <template #before>
          <q-icon name="mdi-calendar-arrow-right" />
        </template>
      </q-input>
      <q-input
        label="* 일시정지 사유"
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
import CalendarMixin from 'src/mixins/calendarMixin'
import ValidateMixin from 'src/mixins/validateMixin'
// 계약서
import delayTicket from 'assets/json/delayTicket.json'

import AgreeDialog from 'components/dialog/AgreeDialog'
export default {
  name: 'TicketPausePopup',
  components: {
    AgreeDialog
  },
  mixins: [ValidateMixin, CalendarMixin],
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
      title: '일시정지 등록',
      accountTextArr: [],
      pauseDay: 1,   // 일시정지 일
      limitDay: 0,   // 일시정지 가능일
      limitCnt: 0,   // 일시정지 가능 횟수
      pauseSdate: this.$moment().add(1, 'days').format('YYYY-MM-DD')
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
    // 정지 가능일
    puaseEnableDate () {
      return {
        sdate: this.$moment().add(1, 'days').format('YYYY-MM-DD'),
        edate: this.$moment(this.ticketData.edate).format('YYYY-MM-DD')
      }
    },
    // 일시 정지 정보
    pauseInfo () {
      /* 유효 기간 */
      let sdate = this.$moment(this.ticketData.sdate)
      let edate = this.$moment(this.ticketData.edate)
      let dateStr = void 0
      let dayCnt = edate.diff(sdate, 'days') + 1
      if (sdate.year() === edate.year()) {
        dateStr = `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('MM-DD')}`
      } else {
        dateStr = `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('YYYY-MM-DD')}`
      }
      /* 사용가능 기간 */
      let usedDayCnt = 0 // 사용일
      let usedDateStr = '' // 사용가능 기간
      let used_sdate = void 0 // 사용 시작일
      let used_edate = void 0 // 사용 종료일
      used_sdate = this.$moment(this.ticketData.sdate)
      const pauseTime = this.$moment(this.pauseSdate).add(-1, 'days')
      used_edate = this.$moment(pauseTime.format('YYYY-MM-DD 23:59:59'))
      if (used_sdate.year() === used_edate.year()) {
        usedDateStr = `${used_sdate.format('YYYY-MM-DD')} ~ ${used_edate.format('MM-DD')}`
      } else {
        usedDateStr = `${used_sdate.format('YYYY-MM-DD')} ~ ${used_edate.format('YYYY-MM-DD')}`
      }
      usedDayCnt = used_edate.diff(used_sdate, 'days') + 1
      /* 정지 기간 */
      let pauseDateStr = '' // 정지 기간
      let pause_sdate = this.$moment(this.pauseSdate) // 정지 시작일
      let pause_edate = this.$moment(pause_sdate).add(this.pauseDay - 1, 'days') // 정지 종료일
      if (pause_sdate.year() === pause_edate.year()) {
        pauseDateStr = `${pause_sdate.format('YYYY-MM-DD')} ~ ${pause_edate.format('MM-DD')}`
      } else {
        pauseDateStr = `${pause_sdate.format('YYYY-MM-DD')} ~ ${pause_edate.format('YYYY-MM-DD')}`
      }
      /* 사용가능 기간 */
      let useDayCnt = 0 // 사용일
      let useDateStr = '' // 사용가능 기간
      let use_sdate = void 0 // 사용 시작일
      let use_edate = void 0 // 사용 종료일
      use_sdate = this.$moment(pause_edate).add(1, 'days')
      use_edate = this.$moment(this.ticketData.edate).add(this.pauseDay, 'days')
      if (used_sdate.year() === used_edate.year()) {
        useDateStr = `${use_sdate.format('YYYY-MM-DD')} ~ ${use_edate.format('MM-DD')}`
      } else {
        usedDateStr = `${use_sdate.format('YYYY-MM-DD')} ~ ${use_edate.format('YYYY-MM-DD')}`
      }
      useDayCnt = use_edate.diff(use_sdate, 'days') + 1
      return {
        sdate,        // 유효 시작일
        edate,        // 유효 종료일
        dateStr,      // 유효 기간
        dayCnt,       // 유효일수
        /* 사용가능 기간 */
        used_sdate,   // 사용 시작일
        used_edate,   // 사용 종료일
        usedDateStr,  // 사용가능 기간
        usedDayCnt,   // 사용일수
        /* 정지 기간 */
        pause_sdate,  // 정지 시작일
        pause_edate,  // 정지 종료일
        pauseDateStr, // 정지 기간
        /* 사용가능 기간 */
        use_sdate,   // 사용 시작일
        use_edate,   // 사용 종료일
        useDateStr,  // 사용 기간
        useDayCnt   // 사용일수
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
    async onPause () {
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
        type: 'pause',      // 연장 유형
        d_type: this.type,  // 티켓 유형
        before_sdate: this.pauseInfo.sdate, // 변경 전 시작일
        before_edate: this.pauseInfo.edate, // 변경 전 종료일
        pause_sdate: this.pauseInfo.pause_sdate,  // 정지 시작일
        pause_edate: this.pauseInfo.pause_edate,  // 정지 종료일
        after_sdate: this.pauseInfo.sdate,  // 변경 후 시작일
        after_edate: this.pauseInfo.use_edate // 변경 후 종료일
      }))
      this.ticketData.sdate = this.pauseInfo.sdate
      this.ticketData.edate = this.pauseInfo.use_edate
      this.ticketData.pauseCnt = _.get(this.ticketData, 'pauseCnt', 0) + 1
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
      this.pauseDay = 1
      this.pauseSdate = this.$moment().add(1, 'days').format('YYYY-MM-DD')
      this.initTicketData()
      this.initDelayTicketData()
      await Promise.all([
        this.reqGetTicketData({ _id: data._id, type: this.type }) // 수강/회원권
      ])
      await this.reqGetDefineData({ type: this.type, _id: this.ticketData.sessionid }) // 관리 데이터(티켓)
      if (this.type === 'lesson') {
        this.limitCnt = _.get(this.lessonDefineData, 'pauseCnt', 0)
        this.limitDay = _.get(this.lessonDefineData, 'pauseDay', 0)
      } else {
        this.limitCnt = _.get(this.membershipDefineData, 'pauseCnt', 0)
        this.limitDay = _.get(this.membershipDefineData, 'pauseDay', 0)
      }
    },
    // 일시 정지 시작일 설정
    onStartDate () {

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
