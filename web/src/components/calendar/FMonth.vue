<template>
  <div class="grid-container">
    <div style="display: grid; grid-template-columns: max-content auto;">
      <div>
        <q-btn
          outline
          color="primary"
          label="일간"
          style="margin-right:5px;"
          icon="mdi-calendar-today"
          @click="$emit('changeDaily')"
          dense
        />
      </div>
      <!-- 일간 출력 & 이동 -->
      <div style="text-align: center;">
        <q-btn
          dense
          flat
          icon="keyboard_arrow_left"
          style="padding-bottom: 5px;"
          @click="onClickChangeMonth(-1)"
        />
        <span style="font-size:1.4em; vertical-align: middle;">
          {{monthTitle}}
        </span>
        <q-btn
          dense
          flat
          icon="keyboard_arrow_right"
          @click="onClickChangeMonth(1)"
        />
        <q-btn
          dense
          flat
          label="이번달"
          :color="currentDate === selectedDate ? 'primary' : 'grey-6'"
          @click="onClickTomorrow"
        />
      </div>
    </div>
    <!-- 필터 & 부수 기능 -->
    <div style="display: grid;">
      <div style="justify-self: end; display: grid; grid-template-columns: auto auto auto; grid-gap: 10px">
        <slot
          name="filter"
          :changeTeam="onChangeTeam"
        />
        <!-- 강사명 부분-시작 -->
        <q-select
          v-model="selectedTeacher"
          :options="teachersOpts"
          dense
          use-input
          @filter="onTeacherFilter"
          @input="onChangeTeacher"
          label="강사"
          style="width: 200px"
          behavior="menu"
        >
          <template #after>
            <q-avatar
              side
              size="xl"
              :icon="selectedTeacher.photo === null ? getFace(selectedTeacher.gender) : void 0"
              :text-color="selectedTeacher.photo === null ? getFaceColor(selectedTeacher.gender) : void 0"
            >
              <img
                v-if="selectedTeacher.photo"
                :src="selectedTeacher.photo"
              />
            </q-avatar>
          </template>
          <template #option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section avatar>
                <q-avatar
                  :icon="scope.opt.photo === null ? getFace(scope.opt.gender) : void 0"
                  :text-color="scope.opt.photo === null ? getFaceColor(scope.opt.gender) : void 0"
                >
                  <img :src="scope.opt.photo">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.name" />
                <q-item-label caption>{{ scope.opt.team }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template #selected-item="scope">
            <q-chip
              dense
              square
              size="12px"
              :tabindex="scope.tabindex"
              class="q-ma-none"
            >
              {{ scope.opt.label }}
            </q-chip>
          </template>
        </q-select>
      </div>
    </div>
    <q-separator style="margin: 2px 0 0 0;" />
    <!-- 스케줄표 -->
    <div>
      <q-calendar
        ref="calendar"
        :view="calendarView"
        :style="calendarStyle"
        v-model="selectedDate"
        hour24-format
        short-interval-label
        animated
        no-default-header-btn
        no-default-header-text
        :interval-minutes="60 * intervalRangeStep"
        :interval-start="intervalStart"
        :interval-count="intervalCount"
        :column-header-after="true"
        locale="ko"
        transition-prev="slide-right"
        transition-next="slide-left"
        :class="'f-monthall'"
      >
        <template #column-header-after="day">
          <div class="q-ma-xs">
            <div sytle="display: grid; grid-template-rows: repeat(5, auto);">
              <div style="display: grid; grid-template-columns: auto auto;">
                <div>{{`${day.day}`}}</div>
                <div
                  :class="getWorkColor(day.date)"
                  class="text-caption q-item__label--caption"
                  style="justify-self: end;"
                >
                  {{getWorkState(day.date)}}
                </div>
              </div>
              <q-separator />
              <div style="display: grid; grid-template-columns: auto auto;">
                <div
                  :style="`color: ${weekDays[day.weekday].color}`"
                  style="align-self: center;"
                >
                  {{weekDays[day.weekday].name}}
                </div>
                <q-btn
                  flat
                  round
                  size="sm"
                  color="teal"
                  icon="mdi-account-edit"
                  style="justify-self: end;"
                  @click.prevent.stop="onClickWork(day)"
                />
              </div>
            </div>
          </div>
        </template>
        <!-- body 부분 -->
        <template #interval="timeInfo">
          <!-- 일정 활성화 -->
          <div
            v-if="isWorkTime(timeInfo.time, timeInfo.date)"
            class="f-cell"
            @click.prevent.stop="onSelectCell(timeInfo)"
            :class="isSelected(timeInfo.date, timeInfo.time) ? 'f-cell-selected' : ''"
          >
            <!-- 강의 등록 -->
            <q-btn
              v-if="isSelected(timeInfo.date, timeInfo.time)"
              icon="mdi-calendar-plus"
              size="sm"
              color="indigo"
              dense
              flat
              @click.prevent.stop="addEventMenu('lesson', timeInfo)"
            >
              <q-tooltip
                content-class="bg-primary"
                v-if="!$q.screen.lt.sm"
              >수업 등록</q-tooltip>
            </q-btn>
            <!-- 일정 등록 -->
            <q-btn
              v-if="isSelected(timeInfo.date, timeInfo.time)"
              icon="mdi-account-clock"
              size="sm"
              color="indigo"
              dense
              flat
              @click.prevent.stop="addEventMenu('schedule', timeInfo)"
            >
              <q-tooltip
                content-class="bg-primary"
                v-if="!$q.screen.lt.sm"
              >일정 등록</q-tooltip>
            </q-btn>
            <!-- 마우스 오버 시간정보 -->
            <div
              v-if="!isSelected(timeInfo.date, timeInfo.time)"
              class="f-cell-background"
            >
              {{timeInfo.time}}
            </div>
          </div>
          <!-- 휴가 활성화 -->
          <div
            v-else-if="isVacationTime(timeInfo.time, timeInfo.date)"
            class="f-cell f-cell-vacation"
          >
            <div class="f-cell-background">
              {{timeInfo.time}}
            </div>
          </div>
          <!-- 일정 비활성화 -->
          <div
            v-else
            class="f-cell f-cell-disable"
          >
            <div class="f-cell-background">
              {{timeInfo.time}}
            </div>
          </div>
        </template>
        <!-- events 부분 -->
        <template #day-body="timeInfo">
          <template v-for="(event, i) in events">
            <!-- 수업 이벤트 -->
            <q-badge
              v-if="event.time && isLesson(timeInfo.date, event.date, event.type)"
              :key="`evt-${i}`"
              class="f-event f-color-blue justify-center ellipsis"
              style="display: block;"
              :class="badgeClasses(event, 'body')"
              :style="badgeStyles(event, 'body', timeInfo.timeStartPos, timeInfo.timeDurationHeight)"
            >
              <div class="q-mb-xs"><b>{{event.session.name}}</b></div>
              <template v-for="(member, j) in event.members">
                <div
                  :key="`mem-${j}`"
                  style="margin-bottom: 5px;"
                >
                  <q-icon
                    :name="memberState[member.state].icon"
                    :color="memberState[member.state].color"
                    size="14px"
                    class="q-mr-xs"
                  />
                  <span class="ellipsis">{{`${member.mName}(${member.useCnt}/${member.totCnt})`}}</span>
                </div>
              </template>
              <!-- 수업 이벤트 툴팁 -->
              <q-tooltip
                v-if="!$q.screen.lt.sm"
                transition-show="flip-right"
                transition-hide="flip-left"
                content-class="bg-grey-10"
              >
                <b>{{`${event.time} ~ ${event.etime}`}}</b>
                <template v-for="(member, j) in event.members">
                  <div :key="`tool-${j}`">
                    <span :style="`color: ${memberState[member.state].tooltipColor}`">
                      {{`[${memberState[member.state].name}]`}}
                    </span>
                    {{`${member.mName} (${member.mSpecial_n}) (${member.useCnt}/${member.totCnt})`}}
                  </div>
                </template>
                <div v-if="event.content">
                  <br>
                  <div><b>[메모]</b> {{event.content}} </div>
                </div>
              </q-tooltip>
              <!-- 아이콘 정보: 메모 등등.. -->
              <div style="position: absolute; right: 0px; bottom: 0px; display: grid; grid-columns-rows: auto;">
                <!-- 메모 Icon -->
                <q-icon
                  v-if="event.content"
                  name="mail"
                  color="amber"
                  size="14px"
                  class="q-ml-xs"
                />
                <!-- 표밖으로 오버되는 카운트 정보 -->
                <q-avatar
                  v-if="event.members.length > ((event.duration - 15) / 15)"
                  color="red"
                  text-color="white"
                  size="xs"
                >
                  {{`+${event.members.length - ((event.duration - 15) / 15)}`}}
                </q-avatar>
              </div>
              <!-- 메뉴 -->
              <q-menu
                touch-position
                square
                content-class="bg-grey-10 text-white"
              >
                <q-item
                  clickable
                  v-close-popup
                  flat
                  @click="onUpdateEventMenu('lesson', timeInfo, event)"
                >
                  <q-item-section>수정 / 삭제</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  flat
                  @click="onEventMenu('lessonCheck', timeInfo, event)"
                >
                  <q-item-section>예약 / 출결 처리</q-item-section>
                </q-item>
              </q-menu>
            </q-badge>
            <!-- 스케줄 이벤트 -->
            <q-badge
              v-if="event.time && isShedule(timeInfo.date, event.date, event.type)"
              :key="`evt-${i}`"
              class="f-event f-color-black justify-center ellipsis"
              style="display: block;"
              :class="badgeClasses(event, 'body')"
              :style="badgeStyles(event, 'body', timeInfo.timeStartPos, timeInfo.timeDurationHeight)"
              @click="onUpdateEventMenu('schedule', timeInfo, event)"
            >
              <span class="ellipsis">{{event.content}}</span>
              <q-tooltip
                v-if="!$q.screen.lt.sm"
                transition-show="flip-right"
                transition-hide="flip-left"
                content-class="bg-grey-10"
              >
                <b>{{`${event.time} ~ ${event.etime}`}}</b>
              </q-tooltip>
            </q-badge>
          </template>
        </template>
      </q-calendar>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { date } from 'quasar'
import { QCalendar } from '../qcalendar'
import calendarMixin from '../../mixins/calendarMixin'
export default {
  name: 'FMonth',
  components: {
    QCalendar
  },
  mixins: [calendarMixin],
  props: {
    teacherList: {
      type: Array,
      default: () => []
    }, // {name, team, avatar or icon}
    countLabel: {
      type: String,
      default: '인원'
    }
  },
  data () {
    return {
      calendarView: 'month-interval',
      intervalRangeStep: 0.5, // 0.25: 15분, 0.5: 30분, 1: 1시간 단위
      intervalRange: { // 0 ~ 24 시간 범위 조절
        min: 6,
        max: 23.5
      },
      currentDate: '2019-10-30', // mounted에서 설정 됨, 오늘 일자
      date: '2019-10-30', // mounted에서 설정 됨, 선택된 일자
      currentPage: 1,
      columnOptions: [24, 16, 12, 10, 8, 6, 4, 3, 2],
      selectedCell: {},
      memberState: {
        0: { name: '결석', icon: 'mdi-calendar-remove', color: 'red', tooltipColor: 'red' },
        1: { name: '예약', icon: 'mdi-calendar-clock', color: 'teal', tooltipColor: '#009688' },
        2: { name: '출석', icon: 'mdi-calendar-check', color: 'primary', tooltipColor: '#027be3' },
        3: { name: '취소', icon: 'mdi-calendar-remove', color: 'purple', tooltipColor: '#a664b1' }
      },
      weekDays: {
        0: { name: '일', color: 'red' },
        1: { name: '월', color: 'black' },
        2: { name: '화', color: 'black' },
        3: { name: '수', color: 'black' },
        4: { name: '목', color: 'black' },
        5: { name: '금', color: 'black' },
        6: { name: '토', color: 'blue' }
      },
      selectedTeacher: {},
      techarFilterStr: ''
    }
  },
  async mounted () {
    const current = new Date()
    const currentStr = date.formatDate(current, 'YYYY-MM-DD')
    this.currentDate = currentStr
    this.date = currentStr
    await this.getDate(currentStr)
    // 센터 운영시간 주입
    this.intervalRange.min = this.$moment(this.gymData.stime, 'hh:mm').hour()
    this.intervalRange.max = this.$moment(this.gymData.etime, 'hh:mm').hour() || 24
  },
  computed: {
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('schedule', [
      'workTimeDataList',
      'scheduleDataList'
    ]),
    ...mapState('gym', [
      'gymData'
    ]),
    teachersOpts () {
      const datas = _.map(this.teacherList, o => {
        return _.assignIn(o, { label: `${o.team} ${o.name}`, value: o.name })
      })
      return _.filter(datas, o => {
        if (o.name.indexOf(this.techarFilterStr) >= 0) return true
        return false
      })
    },
    events () {
      const tempDateList = _.cloneDeep(this.scheduleDataList)
      const schedules = _.map(tempDateList, (schedule) => {
        return _.assignIn(schedule, {
          id: schedule._id,
          details: '',
          date: this.$moment(schedule.date).format('YYYY-MM-DD'),
          time: this.$moment(schedule.stime).format('HH:mm'),
          etime: this.$moment(schedule.etime).format('HH:mm'),
          bgcolor: 'blue-grey'
        })
      })
      return schedules
    },
    selectedDate: {
      get () {
        return this.date
      },
      async set (val) {
        const dateStr = date.formatDate(val, 'YYYY-MM-DD')
        await this.getDate(dateStr)
        this.date = dateStr
      }
    },
    monthTitle () {
      return date.formatDate(this.selectedDate, 'YYYY년 MM월')
    },
    calendarStyle () {
      const columnCount = this.$moment(this.selectedDate).daysInMonth()
      const resizeWidth = columnCount * 115
      if (this.$q.screen.width > resizeWidth) return ''
      return `width:${resizeWidth}px`
    },
    intervalStart () {
      return this.intervalRange.min * (1 / this.intervalRangeStep)
    },
    intervalCount () {
      return (this.intervalRange.max - this.intervalRange.min) * (1 / this.intervalRangeStep)
    },
    workTimeIndex () {
      const index = {}
      const moment = this.$moment
      _.forEach(this.workTimeDataList, o => {
        const dateStr = moment(o.date).format('YYYY-MM-DD')
        index[dateStr] = o
      })
      return index
    }
  },
  methods: {
    ...mapActions('schedule', [
      'reqGetWorkTimeDataList',
      'reqGetScheduleDataList'
    ]),
    ...mapMutations('schedule', [
      'initWorkTimeDataList',
      'initScheduleDataList'
    ]),
    async getDate (dateStr) {
      this.$loader.show({ state: '가져오는 중...' })
      const qDate = this.$moment(dateStr)
      const sDay = this.$moment(`${qDate.format('YYYY-MM')}-01 00:00`)
      const eDay = this.$moment(`${qDate.format('YYYY-MM')}-${qDate.daysInMonth()} 23:59`)
      await this.$nextTick()
      await this.reqGetWorkTimeDataList({
        gymid: this.gymInfo.id,
        staffid: this.selectedTeacher._id,
        gte: sDay,
        lte: eDay
      })
      await this.reqGetScheduleDataList({
        gymid: this.gymInfo.id,
        staffid: this.selectedTeacher._id,
        gte: sDay,
        lte: eDay
      })
      this.$loader.hide()
    },
    /**
     * 해당 강사의 위치에 수업 활성화
     */
    isLesson (date, evtDate, eventType) {
      if (eventType !== 'lesson') return false
      return date === evtDate
    },
    /**
     * 해당 강사의 위치에 수업 활성화
     */
    isShedule (date, evtDate, eventType) {
      if (eventType !== 'schedule') return false
      return date === evtDate
    },
    /**
     * 이름: isWorkTime
     * 설명: 해당 강사의 업무 시간에만 활성화 됨
     */
    isWorkTime (time, tDate) {
      const workInfo = this.workTimeIndex[tDate]
      if (!workInfo) return false
      const workState = _.get(workInfo, ['type'])
      if (workState !== 'work') return false
      let dateTarget = this.$moment(`${tDate} ${time}`)
      let dateFrom = this.$moment(`${tDate} ${this.$moment(workInfo.stime).format('HH:mm')}`)
      let dateTo = this.$moment(`${tDate} ${this.$moment(workInfo.etime).format('HH:mm')}`)
      return date.isBetweenDates(dateTarget, dateFrom, dateTo, { inclusiveFrom: true })
    },
    /**
     * 해당 강사의 휴가인지 체크
     */
    isVacationTime (time, tDate) {
      const workInfo = this.workTimeIndex[tDate]
      if (!workInfo) return false
      const workState = _.get(workInfo, ['type'])
      if (workState === 'vacation') return true
      return false
    },
    /**
     * 이름: getWorkState
     * 설명: 업무 유형
     */
    getWorkState (qDate) {
      const workInfo = this.workTimeIndex[qDate]
      if (!_.has(workInfo, ['type'])) return '미등록'
      if (workInfo.type === 'work') return '업무'
      if (workInfo.type === 'vacation') return '휴일'
      return '미등록'
    },
    /**
     * 업무 유형 컬러
     */
    getWorkColor (qDate) {
      const workInfo = this.workTimeIndex[qDate]
      if (!_.has(workInfo, ['type'])) return ''
      if (workInfo.type === 'work') return 'text-primary'
      if (workInfo.type === 'vacation') return 'text-negative'
      return ''
    },
    /**
     * 이름: onClickTomorrow
     * 설명: 오늘 날로 변경
     */
    onClickTomorrow () {
      let timeStamp = Date.now()
      this.selectedDate = date.formatDate(timeStamp, 'YYYY-MM-DD')
      this.date = this.selectedDate
      this.selectedCell = {}
    },
    /**
     * 이름: onClickChangeMonth
     * 설명: 월간 변경
     */
    onClickChangeMonth (calcMonth) {
      const time = date.formatDate(this.selectedDate)
      const newTime = date.addToDate(time, { month: calcMonth })
      this.selectedDate = date.formatDate(newTime, 'YYYY-MM-DD')
      this.selectedCell = {}
    },
    /**
     * 이름: onClickConfig
     * 설명: 업무 등록
     */
    onClickWork (timeInfo) {
      let teacherInfo = _.cloneDeep(this.selectedTeacher)
      delete teacherInfo.work
      const workTime = this.workTimeIndex[timeInfo.date]
      if (workTime) teacherInfo.work = _.cloneDeep(workTime)

      this.$emit('registerWork', {
        teacherInfo,
        selectedDate: timeInfo.date
      })
    },
    addEventMenu (type, timeInfo) {
      let teacherInfo = _.cloneDeep(this.selectedTeacher)
      delete teacherInfo.work
      if (type === 'lesson') {
        // 수강 등록
        this.$emit('registerLesson', { timeInfo, teacherInfo })
      }
      if (type === 'schedule') {
        // 일정 등록
        this.$emit('registerSchedule', { timeInfo, teacherInfo })
      }
      this.selectedCell = {}
    },
    onUpdateEventMenu (type, timeInfo, event) {
      let teacherInfo = _.cloneDeep(this.selectedTeacher)
      delete teacherInfo.work
      const workTime = this.workTimeIndex[timeInfo.date]
      if (workTime) teacherInfo.work = _.cloneDeep(workTime)

      if (type === 'lesson') {
        this.$emit('updateLesson', { timeInfo, event, teacherInfo })
      }
      if (type === 'schedule') {
        this.$emit('updateSchedule', { timeInfo, event, teacherInfo })
      }
    },
    onEventMenu (type, timeInfo, event) {
      if (type === 'lessonCheck') { // 출결 체크
        this.$emit('lessonCheck', { timeInfo, event })
      }
      if (type === 'reserve') { // 예약 하기
        this.$emit('reserve', { event })
      }
    },
    // 클릭 시 셀 정보 저장
    onSelectCell (timeInfo) {
      this.selectedCell = timeInfo
    },
    // 마우스 클릭으로 선택된 셀
    isSelected (date, time) {
      return _.get(this.selectedCell, 'date', void 0) === date && _.get(this.selectedCell, 'time', void 0) === time
    },
    onTeacherFilter (val, update) {
      this.techarFilterStr = val
      update()
    },
    injectData ({ teacherInfo }) {
      const name = _.get(teacherInfo, 'name')
      const team = _.get(teacherInfo, 'team')
      this.selectedTeacher = _.assignIn(teacherInfo, {
        label: `${team} ${name}`,
        value: name
      })
    },
    async onChangeTeacher (teacherInfo) {
      await this.getDate(this.selectedDate)
    },
    async onChangeTeam (teamList) {
      await this.$nextTick()
      if (!this.selectedTeacher && teamList.length > 0) {
        this.selectedTeacher = this.teachersOpts[0]
        await this.$nextTick()
        await this.getDate(this.selectedDate)
      }
      if (teamList.indexOf(this.selectedTeacher.team) === -1 && teamList.length > 0) {
        this.selectedTeacher = this.teachersOpts[0]
        await this.$nextTick()
        await this.getDate(this.selectedDate)
      }
      if (teamList.length === 0) {
        this.selectedTeacher = void 0
        await this.$nextTick()
        this.initWorkTimeDataList()
        this.initScheduleDataList()
      }
    },
    getFace (gender) {
      if (gender === 'woman') return 'mdi-face-woman'
      return 'mdi-face'
    },
    getFaceColor (gender) {
      if (gender === 'man') return 'primary'
      if (gender === 'woman') return 'negative'
      return 'black'
    }
  }
}
</script>

<style lang="scss">
.f-monthall {
  .q-calendar-daily__body {
    height: calc(100vh - 220px);
  }
}
.f-cell {
  text-align: center;
  // padding: 12px 15px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: auto auto;
}
.f-cell-vacation {
  background-color: #ffebee;
}
.f-cell-disable {
  background-color: rgba(117, 117, 121, 0.1);
}
.f-cell-selected {
  background-color: rgba(0, 0, 255, 0.1);
}
.f-cell-background {
  display: none;
}

.f-cell:hover > .f-cell-background {
  grid-column: 1 / 3;
  font-size: 8px;
  color: darkgray;
  display: block;
  align-self: center;
}
// 이벤트 스타일
.calendar-container {
  position: relative;
}

.f-event {
  width: 100%;
  position: absolute;
  font-size: 12px;
  border-radius: 0px;
  padding: 6px 2px 0px;
  transition: box-shadow 150ms ease-in-out 0s, transform 150ms ease-in-out 0s,
    z-index 150ms ease-in-out 0s;
}

.f-event:hover {
  z-index: 11;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  transform: translateY(-1px);
  outline: none;
}
</style>
