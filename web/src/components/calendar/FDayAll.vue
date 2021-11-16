<template>
  <div class="grid-container">
    <div>
      <!-- 일간 출력 & 이동 -->
      <div style="text-align: center;">
        <q-btn
          dense
          flat
          icon="keyboard_arrow_left"
          style="padding-bottom: 5px;"
          @click="onClickChangeDay(-1)"
        />
        <span
          style="font-size:1.4em; vertical-align: middle;"
          class="cursor-pointer"
        >
          {{dayTitle}}
          <!-- 미니 캘린더 -->
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="flip-left"
            transition-hide="flip-right"
            anchor="bottom middle"
            self="top left"
          >
            <q-date
              v-model="miniDate"
              minimal
              :locale="locale"
              @input="() => { this.$refs.qDateProxy.hide(); selectedCell = {} }"
            />
          </q-popup-proxy>
        </span>
        <q-btn
          dense
          flat
          icon="keyboard_arrow_right"
          @click="onClickChangeDay(1)"
        />
        <q-btn
          dense
          flat
          label="오늘"
          :color="currentDate === selectedDate ? 'primary' : 'grey-6'"
          @click="onClickTomorrow"
        />
      </div>
    </div>
    <!-- 필터 & 부수 기능 -->
    <div style="display: grid;">
      <div style="justify-self: end; display: grid; grid-template-columns: auto auto auto; grid-gap: 10px">
        <slot name="filter" />
        <q-select
          v-model="columnCount"
          :options="columnOptions"
          :label="countLabel"
          style="width: 60px"
          dense
        />
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :input="true"
        />
      </div>
    </div>
    <q-separator style="margin: 2px 0 0 0;" />
    <!-- 스케줄표 -->
    <div>
      <q-calendar
        ref="calendar"
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
        :view="calendarView"
        :column-header-after="true"
        :column-count="columnCount"
        :column-index-start="columnIndexStart"
        locale="ko"
        transition-prev="slide-right"
        transition-next="slide-left"
        :class="'f-dayall'"
      >
        <template #column-header-after="day">
          <div class="q-ma-xs">
            <template v-for="(item, index) in teacherList">
              <q-item
                v-if="day.index === index"
                clickable
                v-ripple
                :key="`s-${index}`"
                style="padding: 0px;"
                @click="onClickTeacher(item)"
              >
                <q-item-section>
                  <q-item-label overline>
                    <!-- "아바타 정보: 강사 얼굴" or Icon 정보-->
                    <q-avatar
                      side
                      size="42px"
                      :icon="item.photo === null ? getFace(item.gender) : void 0"
                      :text-color="item.photo === null ? getFaceColor(item.gender) : void 0"
                    >
                      <img
                        v-if="item.photo"
                        :src="item.photo"
                      />
                    </q-avatar>
                  </q-item-label>
                  <q-item-label caption>{{item.team}}</q-item-label>
                  <q-item-label>{{item.name}}</q-item-label>
                </q-item-section>
                <q-item-section
                  side
                  top
                >
                  <!-- 상태 -->
                  <q-item-label
                    :class="getWorkColor(item)"
                    caption
                  >{{getWorkState(item)}}</q-item-label>
                  <q-space />
                  <!-- 업무 등록 -->
                  <q-btn
                    flat
                    round
                    size="sm"
                    color="teal"
                    icon="mdi-account-edit"
                    @click.prevent.stop="onClickWork(item)"
                  />
                </q-item-section>
              </q-item>
            </template>
          </div>
        </template>
        <!-- body 부분 -->
        <template #interval="timeInfo">
          <!-- 일정 활성화 -->
          <div
            v-if="isWorkTime(teacherList[timeInfo.index], timeInfo.time, timeInfo.date)"
            class="f-cell"
            @click.prevent.stop="onSelectCell(timeInfo)"
            :class="isSelected(timeInfo.index, timeInfo.time) ? 'f-cell-selected' : ''"
          >
            <!-- 강의 등록 -->
            <q-btn
              v-if="isSelected(timeInfo.index, timeInfo.time)"
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
              v-if="isSelected(timeInfo.index, timeInfo.time)"
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
              v-if="!isSelected(timeInfo.index, timeInfo.time)"
              class="f-cell-background"
            >
              {{timeInfo.time}}
            </div>
          </div>
          <!-- 휴가 활성화 -->
          <div
            v-else-if="isVacationTime(teacherList[timeInfo.index], timeInfo.time, timeInfo.date)"
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
            {{event.time}}
            <!-- 수업 이벤트 -->
            <q-badge
              v-if="event.time && isLesson(teacherList[timeInfo.index], event.staffid, event.type)"
              :key="`evt-${i}`"
              class="f-event f-color-blue justify-center ellipsis"
              style="display: block;"
              :class="badgeClasses(event, 'body')"
              :style="badgeStyles(event, 'body', timeInfo.timeStartPos, timeInfo.timeDurationHeight)"
            >
              <div class="q-mb-xs"><b>{{`${event.session.name}(1:${event.session.peopleCnt})`}}</b></div>
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
              v-if="event.time && isShedule(teacherList[timeInfo.index], event.staffid, event.type)"
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
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'
import { QCalendar } from '../qcalendar'
import calendarMixin from 'src/mixins/calendarMixin'
export default {
  name: 'FDayAll',
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
      calendarView: 'day',
      intervalRangeStep: 0.5, // 0.25: 15분, 0.5: 30분, 1: 1시간 단위
      intervalRange: { // 0 ~ 24 시간 범위 조절
        min: 6,
        max: 24
      },
      currentDate: '2019-10-30', // mounted에서 설정 됨, 오늘 일자
      date: '2019-10-30', // mounted에서 설정 됨, 선택된 일자
      columnCount: 8,
      currentPage: 1,
      columnOptions: [24, 16, 12, 10, 8, 6, 4, 3, 2],
      selectedCell: {},
      memberState: {
        0: { name: '결석', icon: 'mdi-calendar-remove', color: 'red', tooltipColor: 'red' },
        1: { name: '예약', icon: 'mdi-calendar-clock', color: 'teal', tooltipColor: '#009688' },
        2: { name: '출석', icon: 'mdi-calendar-check', color: 'primary', tooltipColor: '#027be3' },
        3: { name: '취소', icon: 'mdi-calendar-remove', color: 'purple', tooltipColor: '#a664b1' }
      }
    }
  },
  async mounted () {
    if (this.$q.screen.lt.sm) {
      this.columnCount = 3
    } else if (this.$q.screen.lt.md) {
      this.columnCount = 6
    } else if (this.$q.screen.lt.lg) {
      this.columnCount = 12
    } else if (this.$q.screen.lt.xl) {
      this.columnCount = 16
    }
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
    events () {
      const data = _.map(this.scheduleDataList, (schedule) => {
        return _.assignIn(_.cloneDeep(schedule), {
          id: schedule._id,
          details: '',
          date: this.$moment(schedule.date).format('YYYY-MM-DD'),
          time: this.$moment(schedule.stime).format('HH:mm'),
          etime: this.$moment(schedule.etime).format('HH:mm'),
          bgcolor: 'blue-grey'
        })
      })
      return data
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
    miniDate: {
      get () {
        return date.formatDate(this.selectedDate, 'YYYY/MM/DD')
      },
      async set (val) {
        this.selectedDate = date.formatDate(val, 'YYYY-MM-DD')
      }
    },
    dayTitle () {
      return date.formatDate(this.selectedDate, 'YYYY년 MM월 DD일')
    },
    calendarStyle () {
      const resizeWidth = this.columnCount * 130
      if (this.$q.screen.width > resizeWidth) return ''
      return `width:${this.columnCount * 130}px`
    },
    intervalStart () {
      return this.intervalRange.min * (1 / this.intervalRangeStep)
    },
    intervalCount () {
      return (this.intervalRange.max - this.intervalRange.min) * (1 / this.intervalRangeStep)
    },
    columnIndexStart () {
      return (this.currentPage - 1) * this.columnCount
    },
    totalPages () {
      const num = Number(this.teacherList.length / this.columnCount)
      return Math.ceil(num)
    }
  },
  methods: {
    ...mapActions('schedule', [
      'reqGetWorkTimeDataList',
      'reqGetScheduleDataList'
    ]),
    async getDate (dateStr) {
      this.$loader.show({ state: '가져오는 중...' })
      await this.reqGetWorkTimeDataList({
        gymid: this.gymInfo.id,
        date: new Date(dateStr)
      })
      await this.reqGetScheduleDataList({
        gymid: this.gymInfo.id,
        date: new Date(dateStr)
      })
      this.$loader.hide()
    },
    /**
     * 해당 강사의 위치에 수업 활성화
     */
    isLesson (teacherInfo, evtStaffId, eventType) {
      if (eventType !== 'lesson') return false
      if (!_.has(teacherInfo, 'special_n')) return false
      return teacherInfo._id === evtStaffId
    },
    /**
     * 해당 강사의 위치에 수업 활성화
     */
    isShedule (teacherInfo, evtStaffId, eventType) {
      if (eventType !== 'schedule') return false
      if (!_.has(teacherInfo, 'special_n')) return false
      return teacherInfo._id === evtStaffId
    },
    /**
     * 이름: isWorkTime
     * 설명: 해당 강사의 업무 시간에만 활성화 됨
     */
    isWorkTime (teacherInfo, time, tDate) {
      const workInfo = _.get(teacherInfo, ['work'], void 0)
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
    isVacationTime (teacherInfo, time, tDate) {
      const workInfo = _.get(teacherInfo, ['work'], void 0)
      if (!workInfo) return false
      const workState = _.get(workInfo, ['type'])
      if (workState === 'vacation') return true
      return false
    },
    /**
     * 이름: getWorkState
     * 설명: 업무 유형
     */
    getWorkState (teacherInfo) {
      if (!_.has(teacherInfo, ['work', 'type'])) return '미등록'
      if (teacherInfo.work.type === 'work') return '업무'
      if (teacherInfo.work.type === 'vacation') return '휴일'
      return '미등록'
    },
    /**
     * 업무 유형 컬러
     */
    getWorkColor (teacherInfo) {
      if (!_.has(teacherInfo, ['work', 'type'])) return ''
      if (teacherInfo.work.type === 'work') return 'text-primary'
      if (teacherInfo.work.type === 'vacation') return 'text-negative'
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
     * 이름: onClickChangeDay
     * 설명: 일자 변경
     */
    onClickChangeDay (calcDay) {
      const time = date.formatDate(this.selectedDate)
      const newTime = date.addToDate(time, { days: calcDay })
      this.selectedDate = date.formatDate(newTime, 'YYYY-MM-DD')
      this.selectedCell = {}
    },
    /**
     * 이름: onClickConfig
     * 설명: 업무 등록
     */
    onClickWork (teacherInfo) {
      this.$emit('registerWork', { teacherInfo, selectedDate: this.selectedDate })
    },
    /**
     * 이벤트 추가
     */
    addEventMenu (type, timeInfo) {
      if (type === 'lesson') {
        // 수강 등록
        this.$emit('registerLesson', { timeInfo })
      }
      if (type === 'schedule') {
        // 일정 등록
        this.$emit('registerSchedule', { timeInfo })
      }
      this.selectedCell = {}
    },
    /**
     * 이벤트 수정
     */
    onUpdateEventMenu (type, timeInfo, event) {
      if (type === 'lesson') {
        this.$emit('updateLesson', { timeInfo, event })
      }
      if (type === 'schedule') {
        this.$emit('updateSchedule', { timeInfo, event })
      }
    },
    /**
     * 이벤트 메뉴
     */
    onEventMenu (type, timeInfo, event) {
      if (type === 'lessonCheck') { // 출결 체크
        this.$emit('lessonCheck', { event })
      }
    },
    /**
     * 강사의 월간 스케줄을 확인
     */
    onClickTeacher (teacherInfo) {
      this.$emit('moveMonth', { teacherInfo, date: this.$moment(this.selectedDate) })
    },
    // 클릭 시 셀 정보 저장
    onSelectCell (timeInfo) {
      this.selectedCell = timeInfo
    },
    // 마우스 클릭으로 선택된 셀
    isSelected (index, time) {
      return _.get(this.selectedCell, 'index', void 0) === index && _.get(this.selectedCell, 'time', void 0) === time
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
// {
//   title: 'Girlfriend',
//   details: 'Meet GF for dinner at Swanky Restaurant',
//   date: '2019-04-22',
//   time: '19:00',
//   duration: 180,
//   bgcolor: 'teal',
//   icon: 'fas fa-utensils'
// },
</script>

<style lang="scss">
.f-dayall {
  .q-calendar-daily__body {
    height: calc(100vh - 250px);
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
.f-cell-disable {
  background-color: rgba(117, 117, 121, 0.1);
}
.f-cell-vacation {
  background-color: #ffebee;
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
