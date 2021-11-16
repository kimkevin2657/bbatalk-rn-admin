<template>
  <default-dialog
    ref="dialog"
    title="예약 / 출결처리"
    :useButtons="['close']"
    title-icon="mdi-calendar-multiple-check"
    :width="370"
    :height="555"
  >
  <div class="popup-container">
    <q-select
      label="회원 검색"
      name="classmemeber"
      v-model="reserveScheduleData.ticketid"
      :options="usersOpts"
      class="col-12 q-mt-sm"
      option-value="_id"
      option-label="label"
      emit-value
      map-options
      @filter="(val, update) => { userFilterStr = val; update () }"
      hide-selected
      use-input
      fill-input
      dense
      :input-debounce="200"
      autocomplete="off"
      clearable
      hint="유효한 수강권을 가진 회원만 검색, 예약된 회원은 목록에서 제거 할 수 없습니다."
    >
      <template #append>
        <q-icon name="search"/>
      </template>
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey">
            검색 결과가 없습니다.
          </q-item-section>
        </q-item>
      </template>
      <template #after>
        <q-btn
          :disable="!reserveScheduleData.ticketid"
          label="예약"
          class="q-px-sm"
          color="blue-grey-6"
          dense
          @click="onReserve"
        />
      </template>
      <template #option="scope">
        <q-item
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        >
          <q-item-section avatar>
            <q-avatar
              :icon="!scope.opt.photo ? getFace(scope.opt.gender) : void 0"
              :text-color="!scope.opt.photo ? getFaceColor(scope.opt.gender) : void 0"
            >
              <img v-if="scope.opt.photo" :src="scope.opt.photo">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{`${scope.opt.name} (${scope.opt.special_n})`}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-separator style="margin-top: 10px;"/>
    <span>예약 회원 목록</span>
    <div class="column items-end">
      <div class="col">
        <q-chip square dense>
          <q-avatar color="black" text-color="white" style="width:28px;" dense>총원</q-avatar>
          {{reserveMembers.length}}
        </q-chip>
        <q-chip square dense>
          <q-avatar color="purple" text-color="white" style="width:28px;" dense>취소</q-avatar>
          {{cntObj.cancel}}
        </q-chip>
        <q-chip square dense>
          <q-avatar color="teal" text-color="white" style="width:28px;" dense>예약</q-avatar>
          {{cntObj.reserve}}
        </q-chip>
        <q-chip square dense>
          <q-avatar color="negative" text-color="white" style="width:28px;" dense>결석</q-avatar>
          {{cntObj.nonCheck}}
        </q-chip>
        <q-chip square dense>
          <q-avatar color="primary" text-color="white" style="width:28px;" dense>출석</q-avatar>
          {{cntObj.check}}
        </q-chip>
      </div>
    </div>
    <div class="member-box">
      <q-list separator>
        <q-item
          v-for="reserve in reserveScheduleDataList"
          :key="reserve._id"
          class="q-mb-sm q-px-sm"
        >
          <q-item-section avatar>
            <q-avatar
              :icon="!reserve.mPhoto ? getFace(reserve.mGender) : void 0"
              :text-color="!reserve.mPhoto ? getFaceColor(reserve.mGender) : void 0"
            >
              <img v-if="reserve.mPhoto" :src="reserve.mPhoto">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ reserve.mName }}</q-item-label>
            <q-item-label caption lines="1">{{ reserve.mSpecial_n}}</q-item-label>
          </q-item-section>

          <q-item-section side class="q-px-none">
            <span>
              <q-btn
                size="sm"
                icon="message"
                :color="reserve.desc ? 'amber-14' : void 0"
                class="q-mr-sm"
                flat
                dense
                :ripple="false"
                @click="onDesc(reserve)"
              >
                <q-tooltip v-if="reserve.desc && !$q.screen.lt.sm">{{reserve.desc}}</q-tooltip>
              </q-btn>
              <q-btn-toggle
                :value="reserve.state"
                dense
                :options="[
                  {label: '취소', value: 3},
                  {label: '예약', value: 1},
                  {label: '결석', value: 0},
                  {label: '출석', value: 2}
                ]"
                :toggle-color="stateColor[reserve.state]"
                @input="(val) => onChangeState(val, reserve)"
              >
              </q-btn-toggle>
            </span>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DefaultDialog from 'components/dialog/DefaultDialog'
export default {
  name: 'LessonCheckPopup',
  components: {
    DefaultDialog
  },
  data () {
    return {
      stateColor: {
        0: 'negative', // 결석
        1: 'secondary', // 예약
        2: 'primary', // 출석
        3: 'purple' // 취소
      },
      eventInfo: {},
      reserveMembers: [], // 예약된 회원
      addMemeber: '', // 회원 추가
      userFilterStr: '' // 회원 검색 필터
    }
  },
  computed: {
    ...mapState('reserveSchedule', [
      'reserveScheduleData',
      'reserveScheduleDataList'
    ]),
    ...mapState('schedule', [
      'lessonScheduleData'
    ]),
    ...mapState('ticket', [
      'lessonDataList'
    ]),
    ...mapState('defineDatas', [
      'lessonDefineData'
    ]),
    // 검색된 티켓(회원) 목록, 검색 Select box 옵션
    usersOpts () {
      const datas = _.filter(this.lessonDataList, o => {
        // 일시정지 Ticket인지 확인
        const delayTickets = o.delayTickets
        if (!delayTickets) return true
        for (let i = 0; i < _.size(delayTickets); i++) {
          const delayTicket = delayTickets[i]
          if (delayTicket.type === 'pause') {
            const pauseStart = this.$moment(delayTicket.pause_sdate).format('YYYY-MM-DD')
            const pauseEnd = this.$moment(delayTickets.pause_edate).format('YYYY-MM-DD')
            const target = this.$moment(this.lessonScheduleData.date).format('YYYY-MM-DD')
            if (this.$moment(target).isBetween(pauseStart, pauseEnd, null, '[]')) {
              return false
            }
          }
        }
        return true
      }).map(o => {
        return _.assignIn(o, { label: `${o.name} (${o.special_n})`, value: o._id })
      })
      const ticketIndexs = {}
      _.forEach(this.reserveScheduleDataList, o => {
        ticketIndexs[o.memberid] = true
      })
      return _.filter(datas, o => {
        const memberid = _.get(o, 'memberid', void 0)
        if (ticketIndexs[memberid]) return false
        if (o.label.indexOf(this.userFilterStr) >= 0) return true
        return false
      })
    },
    selectedTicket () {
      const ticket = _.find(this.usersOpts, o => {
        return o._id === this.reserveScheduleData.ticketid
      })
      if (!ticket) return {}
      return ticket
    },
    cntObj () {
      let obj = { cancel: 0, reserve: 0, check: 0, nonCheck: 0 }
      _.forEach(this.reserveScheduleDataList, o => {
        if (Number(o.state) === 0) return obj.nonCheck++  // 결석자 수
        if (Number(o.state) === 1) return obj.reserve++   // 예약자 수
        if (Number(o.state) === 2) return obj.check++     // 출석자 수
        if (Number(o.state) === 3) return obj.cancel++    // 예약취소 수
      })
      return obj
    }
  },
  methods: {
    ...mapActions('schedule', [
      'reqGetScheduleData',
      'reqUpdateSchedule'
    ]),
    ...mapActions('reserveSchedule', [
      'reqGetReserveScheduleDataList',
      'reqAddReserveScheduleData',
      'reqUpdateReserveScheduleData'
    ]),
    ...mapActions('ticket', [
      'reqGetTicketDataList'
    ]),
    ...mapActions('defineDatas', [
      'reqGetDefineData'
    ]),
    ...mapMutations('schedule', [
      'addMemberScheduleData',
      'updateMemberScheduleData'
    ]),
    ...mapMutations('reserveSchedule', [
      'initReserveScheduleData',
      'initReserveScheduleDataList',
      'setReserveScheduleData'
    ]),
    getFace (gender) {
      if (gender === 'woman') return 'mdi-face-woman'
      return 'mdi-face'
    },
    getFaceColor (gender) {
      if (gender === 'man') return 'primary'
      if (gender === 'woman') return 'negative'
      return 'black'
    },
    onDesc (reseveSchedule) {
      this.$q.dialog({
        title: '메모',
        prompt: {
          model: reseveSchedule.desc,
          type: 'text' // optional
        },
        ok: {
          label: '확인'
        },
        cancel: {
          label: '취소',
          color: 'negative'
        },
        persistent: true,
        square: true
      }).onOk(data => {
        reseveSchedule.desc = data
        this.reqUpdateReserveScheduleData({ row: _.cloneDeep(reseveSchedule) })
      })
    },
    /**
     * 예약 상태 변경
     * state: 0: 결석, 1: 예약, 2: 출석, 3: 취소
     */
    async onChangeState (state, reseveSchedule) {
      const oldState = reseveSchedule.state
      reseveSchedule.state = state
      const { code, result } = await this.reqUpdateReserveScheduleData({ row: _.cloneDeep(reseveSchedule) })
      if (code === 'ok') {
        this.updateMemberScheduleData(result)
      } else {
        reseveSchedule.state = oldState
      }
    },
    /**
     * 스케줄 예약
     */
    async onReserve () {
      // 에약할 수 있는 인원 제한
      // if (this.reserveScheduleDataList.length >= this.lessonDefineData.peopleCnt) {
      //   this.$notify.warnning('등록할 수 있는 회원 수가 초과되어 추가할 수 없습니다.')
      //   return
      // }
      let reserve = this.reserveScheduleData
      reserve.staffid = this.lessonScheduleData.staffid
      reserve.scheduleid = this.lessonScheduleData._id
      reserve.memberid = this.selectedTicket.memberid
      reserve.mName = this.selectedTicket.name
      reserve.mSpecial_n = this.selectedTicket.special_n
      reserve.mPhoto = this.selectedTicket.photo
      reserve.mGender = this.selectedTicket.gender
      reserve.sName = this.selectedTicket.staffName
      reserve.sSpecial_n = this.selectedTicket.staffSpecial_n
      reserve.sPhoto = this.selectedTicket.staffPhoto
      reserve.tName = this.selectedTicket.session
      reserve.totCnt = this.selectedTicket.totCnt
      reserve.useCnt = this.selectedTicket.useCnt
      reserve.sdate = this.selectedTicket.sdate
      reserve.edate = this.selectedTicket.edate
      reserve.date = this.lessonScheduleData.date
      reserve.stime = this.lessonScheduleData.stime
      reserve.etime = this.lessonScheduleData.etime
      reserve.duration = this.lessonScheduleData.duration
      reserve.regDate = new Date()
      const { code, result } = await this.reqAddReserveScheduleData()
      if (code === 'ok') {
        this.addMemberScheduleData(result)
      }
      this.initReserveScheduleData()
    },
    async initData () {
      // 초기화
      this.initReserveScheduleData()
      this.initReserveScheduleDataList()

      const _id = this.eventInfo._id
      // 수업 스케줄 정보 가져오기
      await this.reqGetScheduleData({ type: 'lesson', _id })
      const date = this.lessonScheduleData.date
      const sessionid = this.lessonScheduleData.sessionid
      // 구매 된 수강권 항목(회원 목록)
      await this.reqGetTicketDataList({
        type: 'lesson',
        sessionid: sessionid,
        date: new Date(date),
        isvalid: true
      })
      // 수업 정보 가져오기
      await this.reqGetDefineData({
        type: 'lesson',
        _id: sessionid
      })
      // 예약 목록
      await this.reqGetReserveScheduleDataList({ scheduleid: _id })
    },
    show ({ event } = {}) {
      this.eventInfo = event
      this.initData()
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-container {
  display: grid;
  grid-template-rows: auto;
  grid-gap:10px;
}
.popup-label {
  text-align: center;
  justify-self: start;
  margin-bottom: 5px;
}
.popup-btn {
  margin: 0 0 20px 2px;
  width: 60px;
}
.member-box {
  height: 250px;
  overflow: scroll;
  border: 1px solid #ddd;
  background: #F1F1F1;
}
</style>
