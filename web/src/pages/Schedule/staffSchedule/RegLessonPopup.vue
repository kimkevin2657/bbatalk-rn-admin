/**
 * 강의(수업) 등록 팝업
 */
<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    :useButtons="buttonList"
    title-icon="mdi-calendar-plus"
    :width="350"
    :height="460"
    @regist="onAddLesson"
    @edit="onEditLesson"
    @remove="onRemoveLesson"
    @continue="onAddLesson(true)"
  >
    <div class="row">
      <!-- 수업 일 -->
      <q-input
        name="classDate"
        label="* 수업 일자"
        v-model="lessonScheduleData.date"
        mask="####-##-##"
        data-vv-scope="reglesson"
        v-validate="'required|date'"
        :error="errors.has('reglesson.classDate')"
        :error-message="getValidateMessage('classDate')"
        class="col-12"
        dense
        hide-bottom-space
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
              <q-date
                v-model="lessonScheduleData.date"
                mask="YYYY-MM-DD"
                @input="() => {
                  $refs.qDateProxy1.hide()
                }"
                :locale="locale"
                minimal
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- 강사명 부분-시작 -->
      <q-select
        label="* 강사"
        name="staffid"
        v-model="lessonScheduleData.staffid"
        :options="teachersOpts"
        class="col-12 q-mt-sm"
        option-value="_id"
        option-label="label"
        emit-value
        map-options
        data-vv-scope="reglesson"
        v-validate="'required'"
        :error="errors.has('reglesson.staffid')"
        :error-message="getValidateMessage('staffid')"
        @filter="(val, update) => { techarFilterStr = val; update() }"
        hide-selected
        use-input
        fill-input
        :disable="popupType === 'edit'"
        dense
        hide-bottom-space
        autocomplete="off"
        clearable
        @input="() => {
          lessonScheduleData.sessionid = void 0
          lessonScheduleData.members = []
        }"
      >
        <template #before>
          <q-icon name="mdi-teach" />
        </template>
        <template #after>
          <q-avatar
            side
            size="xl"
            :icon="!selectedTeacher.photo ? getFace(selectedTeacher.gender) : void 0"
            :text-color="!selectedTeacher.photo ? getFaceColor(selectedTeacher.gender) : void 0"
          >
            <img v-if="selectedTeacher.photo" :src="selectedTeacher.photo" />
          </q-avatar>
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
              <q-item-label v-html="scope.opt.name" />
              <q-item-label caption>{{ scope.opt.team }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <!-- 강사명 부분-종료 -->
      <!-- 세션 -->
      <q-select
        label="* 수강 목록"
        name="sessionid"
        v-model="lessonScheduleData.sessionid"
        :options="lessonOpts"
        class="col-12"
        option-value="_id"
        option_label="label"
        emit-value
        map-options
        data-vv-scope="reglesson"
        v-validate="'required'"
        :error="errors.has('reglesson.sessionid')"
        :error-message="getValidateMessage('sessionid')"
        @filter="(val, update) => { sessionFilterStr = val; update() }"
        hide-selected
        use-input
        fill-input
        :disable="popupType === 'edit'"
        dense
        hide-bottom-space
        autocomplete="off"
        clearable
        @input="onSession"
      >
        <template #before>
          <q-icon name="mdi-ticket-outline" />
        </template>
      </q-select>
      <!-- 수업 시간 -->
      <q-input
        name="classtime"
        v-model="lessonScheduleData.time"
        @input="changeTime"
        label="* 수업 시간"
        mask="time"
        data-vv-scope="reglesson"
        v-validate="'required|time'"
        :error="errors.has('reglesson.classtime')"
        :error-message="getValidateMessage('classtime')"
        class="col-8 q-pr-sm"
        dense>
        <template v-slot:hint>
          {{`${lessonScheduleData.time} ~ ${classBeforeTime}`}}
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy ref="qTimeProxy1" transition-show="scale" transition-hide="scale">
              <q-time
                v-model="lessonScheduleData.time"
                :hour-options="[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                :minute-options="[0, 10, 20, 30, 40, 50]"
                @input="changeTime"
                format24h
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- 수업 등록 시간 -->
      <q-select
        v-model="lessonScheduleData.duration"
        label="등록 시간"
        :options="timeOpts"
        class="col-4 q-pl-sm"
        option-value="duration"
        option-label="label"
        emit-value
        map-options
        dense
        :hint="' '"
      />
      <!-- 룸 -->
      <q-select
        v-model="lessonScheduleData.roomid"
        :options="filteredRoomList"
        label="룸"
        option-value="_id"
        option-label="name"
        emit-value
        map-options
        dense
        class="col-12"
        flat
      >
        <template #before>
          <q-icon name="mdi-home" />
        </template>
      </q-select>
      <q-input
        v-model="lessonScheduleData.content"
        label="메모"
        dense
        class="col-12"
        flat
      />
    </div>
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import ValidateMixin from 'src/mixins/validateMixin'
import CalendarMixin from 'src/mixins/calendarMixin'
import DefaultDialog from 'components/dialog/DefaultDialog'
export default {
  name: 'RegLessonPopup',
  mixins: [ValidateMixin, CalendarMixin],
  inject: ['$validator'],
  components: {
    DefaultDialog
  },
  props: {
    teachers: {
      type: Array,
      default: () => []
    },
    users: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      popupType: 'add',
      popupTitle: '수업 추가',
      buttonList: ['cancel', 'continue', 'regist'],
      teacherInfo: {},
      timeInfo: {},
      eventInfo: {},
      selectedData: {
        teacher: void 0,
        members: [],
        session: void 0,
        roomid: void 0,
        content: void 0,
        duration: 60
      },
      timeOpts: [
        { label: '30분', value: 0.5, hour: 0, minute: 30, duration: 30 },
        { label: '1시간', value: 1, hour: 1, minute: 0, duration: 60 },
        { label: '1시간 반', value: 1.5, hour: 1, minute: 30, duration: 90 },
        { label: '2시간', value: 2, hour: 2, minute: 0, duration: 120 },
        { label: '2시간 반', value: 2.5, hour: 2, minute: 30, duration: 150 },
        { label: '3시간', value: 3, hour: 3, minute: 0, duration: 180 }
      ],
      techarFilterStr: '',
      sessionFilterStr: '',
      userFilterStr: '',
      classDate: '',
      classTime: ''
    }
  },
  computed: {
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('schedule', [
      'lessonScheduleData'
    ]),
    ...mapState('defineDatas', [
      'lessonDefineDataList',
      'roomDefineDataList'
    ]),
    ...mapState('ticket', [
      'lessonDataList'
    ]),
    teachersOpts () {
      const datas = _.map(this.teachers, o => {
        return _.assignIn(o, { label: `${o.team} ${o.name}`, value: o.name })
      })
      return _.filter(datas, o => {
        if (o.name.indexOf(this.techarFilterStr) >= 0) return true
        return false
      })
    },
    usersOpts () {
      const datas = _.map(this.lessonDataList, o => {
        return _.assignIn(o, { label: `${o.name} (${o.special_n})`, value: o._id })
      })
      return _.filter(datas, o => {
        if (o.name.indexOf(this.userFilterStr) >= 0) return true
        return false
      })
    },
    lessonOpts () {
      let lessonIndex = {}
      const teacherTeam = _.get(this.selectedTeacher, ['team'], void 0)
      _.forEach(this.lessonDefineDataList, (o) => {
        let label = `${o.name}(1:${o.peopleCnt})`
        lessonIndex[label] = _.assignIn(o, {
          label: label,
          value: label
        })
      })
      return _.map(lessonIndex, o => o).filter(o => {
        if (teacherTeam === void 0) return true // 강사의 팀이 없다면 모든 수강종목 보여줄 것
        return o.team === teacherTeam
      }).filter(o => {
        if (o.label.indexOf(this.sessionFilterStr) >= 0) return true
        return false
      })
    },
    filteredRoomList () {
      if (!_.has(this.selectedData, 'teacher')) return []
      const team = _.get(this.selectedData, ['teacher', 'team'])
      return _.filter(this.roomDefineDataList, (o) => {
        return o.department === team
      })
    },
    classBeforeTime () {
      const dateStr = this.$moment(this.lessonScheduleData.date).format('YYYY-MM-DD')
      const timeStr = this.lessonScheduleData.time
      const duration = this.lessonScheduleData.duration
      let time = this.$moment(`${dateStr} ${timeStr}`)
      time.add(duration, 'm')
      return time.format('HH:mm')
    },
    memberInfo () {
      const count = _.get(this.selectedData, ['members', 'length'], 0)
      if (count === 0) return ''
      const firstName = _.get(this.selectedData, ['members', 0, 'name'])
      if (count === 1) return firstName
      return `${firstName} 외 ${count - 1}명`
    },
    memberFullInfo () {
      const labels = []
      _.forEach(this.selectedData.members, (o) => {
        labels.push(`${o.name} (${o.special_n})`)
      })
      return labels.join(', ')
    },
    selectedTeacher () {
      const staffIndex = _.findIndex(this.teachers, o => o._id === this.lessonScheduleData.staffid)
      if (staffIndex === -1) return {}
      return _.get(this.teachers, [staffIndex], {})
    },
    selectedSession () {
      const sessionIndex = _.findIndex(this.lessonDefineDataList, o => o._id === this.lessonScheduleData.sessionid)
      if (sessionIndex === -1) return {}
      return _.get(this.lessonDefineDataList, [sessionIndex], {})
    }
  },
  methods: {
    ...mapActions('schedule', [
      'reqAddSchedule',
      'reqUpdateSchedule',
      'reqRemoveSchedule',
      'reqGetScheduleData'
    ]),
    ...mapMutations('schedule', [
      'initLessonScheduleData'
    ]),
    ...mapActions('defineDatas', [
      'reqGetDefineDataList'
    ]),
    ...mapActions('ticket', [
      'reqGetTicketDataList'
    ]),
    onUserFilter (val, update) {
      this.userFilterStr = val
      update()
    },
    async initData () {
      if (this.popupType === 'edit') {
        this.popupTitle = '수업 수정'
        this.buttonList = ['remove', 'cancel', 'edit']
        const _id = this.eventInfo._id
        await this.reqGetScheduleData({ type: 'lesson', _id })
      } else {
        this.popupTitle = '수업 추가'
        this.buttonList = ['cancel', 'continue', 'regist']
        this.initLessonScheduleData()
        this.lessonScheduleData.date = this.timeInfo.date
        this.lessonScheduleData.time = this.timeInfo.time
        this.lessonScheduleData.staffid = this.teacherInfo._id
      }
    },
    changeTime () {
      this.timeInfo.hour = Number(this.timeInfo.time.split(':')[0])
      this.timeInfo.minute = Number(this.timeInfo.time.split(':')[1])
      if (_.has(this.$refs.qTimeProxy1, 'hide')) {
        this.$refs.qTimeProxy1.hide()
      }
    },
    async show ({ teacherInfo, timeInfo, event, isAdd = true }) {
      this.teacherInfo = teacherInfo
      this.timeInfo = timeInfo
      this.eventInfo = event
      this.popupType = isAdd ? 'add' : 'edit'
      // 수강에 필요 데이터 요청
      await Promise.all([
        this.reqGetDefineDataList({ type: 'room' }), // 룸 설정 항목
        this.reqGetDefineDataList({ type: 'lesson' }) // 수강권 설정 항목
      ])
      this.initData()
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    async onAddLesson (isContinue) {
      const reqValidate = await this.$validator.validateAll('reglesson')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const members = _.map(this.lessonScheduleData.members, o => {
          return _.assignIn(_.pick(o, ['_id', 'name', 'special_n', 'tc', 'c']), { state: 1 })
        })
        const dateStr = this.lessonScheduleData.date
        this.lessonScheduleData.stime = this.$moment(`${dateStr} ${this.lessonScheduleData.time}`)
        this.lessonScheduleData.etime = this.$moment(`${dateStr} ${this.classBeforeTime}`)
        this.lessonScheduleData.members = members
        const { code } = await this.reqAddSchedule({ type: 'lesson' })
        if (code === 'ok') {
          if (!isContinue) {
            this.hide()
          }
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
      this.$loader.hide()
    },
    async onEditLesson () {
      const reqValidate = await this.$validator.validateAll('reglesson')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const members = _.map(this.selectedData.members, o => {
          return _.assignIn(_.pick(o, ['_id', 'name', 'special_n', 'tc', 'c']), { state: 1 })
        })
        const dateStr = this.$moment(this.lessonScheduleData.date).format('YYYY-MM-DD')
        this.lessonScheduleData.stime = this.$moment(`${dateStr} ${this.lessonScheduleData.time}`)
        this.lessonScheduleData.etime = this.$moment(`${dateStr} ${this.classBeforeTime}`)
        this.lessonScheduleData.members = members
        const { code } = await this.reqUpdateSchedule({ type: 'lesson' })
        if (code === 'ok') {
          this.hide()
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
      this.$loader.hide()
    },
    async onRemoveLesson () {
      try {
        const { code } = await this.reqRemoveSchedule({ _id: this.lessonScheduleData._id })
        if (code === 'ok') {
          this.hide()
        }
      } catch (e) {
        this.$notify.error(e)
      }
      this.$loader.hide()
    },
    getFace (gender) {
      if (gender === 'woman') return 'mdi-face-woman'
      return 'mdi-face'
    },
    getFaceColor (gender) {
      if (gender === 'man') return 'primary'
      if (gender === 'woman') return 'negative'
      return 'black'
    },
    async onSession (sessionid) {
      this.lessonScheduleData.members = []
      this.lessonScheduleData.duration = _.get(this.selectedSession, ['duration'], 0)
      await this.reqGetTicketDataList({ // 구매 된 수강권 항목
        type: 'lesson',
        sessionid: sessionid,
        date: new Date(this.lessonScheduleData.date)
      })
    }
  }
}
</script>
