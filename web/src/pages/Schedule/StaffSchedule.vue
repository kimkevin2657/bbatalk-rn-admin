<template>
  <div>
    <top />
    <div class="grid-container">
      <!-- 스케줄표 -->
      <f-day-all
        v-if="dateType === 'day'"
        ref="fDayAll"
        :teacher-list="filterdDataList"
        @registerWork="onWork"
        @registerLesson="addLesson"
        @registerSchedule="addSchedule"
        @updateLesson="updateLesson"
        @updateSchedule="updateSchedule"
        @lessonCheck="onLessonCheck"
        @moveMonth="onMoveMonth"
      >
        <template #filter>
          <q-select
            v-model="selectTeams"
            :options="teamOptions"
            use-chips
            multiple
            dense
            style="width: 80px"
          >
            <template #selected>
              팀 구분
            </template>
          </q-select>
        </template>
      </f-day-all>
      <!-- 월간 스케줄표, 강사 전용 -->
      <f-month
        v-else-if="dateType === 'month'"
        ref="fMonth"
        :teacher-list="filterdDataList"
        :teacher="teacherInfo"
        @registerWork="onWork"
        @registerLesson="addLesson"
        @registerSchedule="addSchedule"
        @updateLesson="updateLesson"
        @updateSchedule="updateSchedule"
        @lessonCheck="onLessonCheck"
        @changeDaily="dateType = 'day'"
      >
        <template #filter="props">
          <q-select
            v-model="selectTeams"
            :options="teamOptions"
            use-chips
            multiple
            dense
            @input="props.changeTeam"
            style="width: 80px"
          >
            <template #selected>
              팀 구분
            </template>
          </q-select>
        </template>
      </f-month>
      <!-- 업무 등록 팝업 -->
      <reg-work-popup
        ref="workDialog"
        :teachers="staffDataList"
      />
      <!-- 수강 등록 팝업 -->
      <reg-lesson-popup
        ref="lessonDialog"
        :teachers="staffDataList"
      />
      <!-- 일정 등록 팝업 -->
      <reg-schedule-popup
        ref="scheduleDialog"
        :teachers="staffDataList"
      />
      <!-- 예약 / 출결 처리 팝업 -->
      <lesson-check-popup ref="lessonCheckDialog" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Top from 'src/layouts/component/Top'
import FDayAll from 'components/calendar/FDayAll'
import FMonth from 'components/calendar/FMonth'
import RegLessonPopup from './staffSchedule/RegLessonPopup'
import RegSchedulePopup from './staffSchedule/RegSchedulePopup'
import RegWorkPopup from './staffSchedule/RegWorkPopup'
import LessonCheckPopup from './staffSchedule/LessonCheckPopup'

export default {
  name: 'StaffSchedule',
  components: {
    Top,
    FDayAll,
    FMonth,
    RegLessonPopup,
    RegSchedulePopup,
    RegWorkPopup,
    LessonCheckPopup
  },
  async mounted () {
    await this.reqGetStaffDataList()
    this.selectTeams = [...this.teamOptions]
  },
  data () {
    return {
      dateType: 'day', // 일간(day)/월간(month)
      teacherInfo: {},
      selectTeams: [] // 선택된 팀
    }
  },
  computed: {
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('schedule', [
      'workTimeDataList'
    ]),
    ...mapState('staff', [
      'staffDataList'
    ]),
    filterdDataList () {
      const workTimeIndex = {}
      _.forEach(this.workTimeDataList, o => {
        const id = _.get(o, ['staffid'], void 0)
        workTimeIndex[id] = o
      })
      const selectTeamIndex = {}
      _.forEach(this.selectTeams, o => {
        selectTeamIndex[o] = true
      })
      const tempDataList = []
      _.forEach(this.staffDataList, o => {
        if (!selectTeamIndex[o.team]) return
        const workInfo = _.get(workTimeIndex, [o._id], void 0)
        tempDataList.push(_.assignIn(o, { work: workInfo }))
      })
      return tempDataList
    },
    teamIndex () {
      const teams = {}
      _.forEach(this.staffDataList, (o) => {
        teams[o.team] = true
      })
      return teams
    },
    teamOptions () {
      const teams = {}
      _.forEach(this.staffDataList, (o) => {
        teams[o.team] = true
      })

      return Object.keys(this.teamIndex)
    }
  },
  methods: {
    ...mapActions('staff', [
      'reqGetStaffDataList'
    ]),
    /**
     * 이름: onWork
     * 설명: 강사 업무를 등록하는 팝업창을 띄운다.
     */
    onWork ({ teacherInfo, selectedDate }) {
      this.$refs.workDialog.show({ teacherInfo, selectedDate })
    },
    /**
     * 이름: addLesson
     * 설명: 수업을 등록하는 팝업창을 띄운다.
     */
    addLesson ({ timeInfo, teacherInfo = void 0 } = {}) {
      if (!teacherInfo) {
        teacherInfo = _.get(this.filterdDataList, [timeInfo.index], void 0)
        if (!teacherInfo) {
          const msg = '강사 정보를 가져올 수 없습니다.'
          this.$notify.error(msg)
        }
      }
      this.$refs.lessonDialog.show({ timeInfo, teacherInfo })
    },
    /**
     * 이름: addSchedule
     * 설명: 일정을 등록하는 팝업창을 띄운다.
     */
    addSchedule ({ timeInfo, teacherInfo = void 0 } = {}) {
      if (!teacherInfo) {
        teacherInfo = _.get(this.filterdDataList, [timeInfo.index], void 0)
        if (!teacherInfo) {
          const msg = '강사 정보를 가져올 수 없습니다.'
          this.$notify.error(msg)
        }
      }
      this.$refs.scheduleDialog.show({ timeInfo, teacherInfo })
      // console.log('timeObj', timeObj)
    },
    /**
     * 수업을 수정하는 팝업창을 띄운다.
     */
    updateLesson ({ timeInfo, event, teacherInfo = void 0 } = {}) {
      if (!teacherInfo) {
        teacherInfo = _.get(this.filterdDataList, [timeInfo.index], void 0)
        if (!teacherInfo) {
          const msg = '강사 정보를 가져올 수 없습니다.'
          this.$notify.error(msg)
        }
      }
      this.$refs.lessonDialog.show({ timeInfo, teacherInfo, event, isAdd: false })
    },
    /**
     * 일정을 수정하는 팝업창을 띄운다.
     */
    updateSchedule ({ timeInfo, event, teacherInfo = void 0 } = {}) {
      if (!teacherInfo) {
        teacherInfo = _.get(this.filterdDataList, [timeInfo.index], void 0)
        if (!teacherInfo) {
          const msg = '강사 정보를 가져올 수 없습니다.'
          this.$notify.error(msg)
        }
      }
      this.$refs.scheduleDialog.show({ timeInfo, teacherInfo, event, isAdd: false })
    },
    /**
     * 수업 예약 / 출결 처리 팝업을 띄운다.
     */
    onLessonCheck ({ event }) {
      this.$refs.lessonCheckDialog.show({ event })
    },
    async onMoveMonth ({ teacherInfo, date }) {
      this.teacherInfo = _.cloneDeep(teacherInfo)
      this.dateType = 'month'
      await this.$nextTick()
      if (_.has(this.$refs.fMonth, 'injectData')) {
        this.$refs.fMonth.injectData({ teacherInfo })
      }
    }
  }
}
</script>

<style scoped>
.grid-container {
  margin: 10px;
}
</style>
