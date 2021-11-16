/**
 * 일정 등록 팝업
 */
<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    :useButtons="buttonList"
    title-icon="mdi-account-clock"
    :width="300"
    :height="350"
    @regist="onAddSchedule"
    @edit="onEditSchedule"
    @remove="onRemoveSchedule"
    @continue="onAddSchedule(true)"
  >
    <div class="row">
      <!-- 강사 명 -->
      <q-select
        label="* 강사"
        v-model="scheduleData.staffid"
        :options="teachersOpts"
        class="col-12 q-mt-sm"
        option-value="_id"
        option-label="label"
        emit-value
        map-options
        data-vv-scope="regschedule"
        v-validate="'required'"
        :error="errors.has('regschedule.staffid')"
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
      >
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
      <!-- 스케줄 일자 -->
      <q-input
        name="scheduleDate"
        label="* 등록일"
        v-model="scheduleData.date"
        mask="####-##-##"
        class="col-12"
        data-vv-scope="regschedule"
        v-validate="'required|date'"
        :error="errors.has('regschedule.scheduleDate')"
        :error-message="getValidateMessage('scheduleDate')"
        dense
        hide-bottom-space
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
              <q-date v-model="scheduleData.date" mask="YYYY-MM-DD" @input="() => $refs.qDateProxy1.hide()" :locale="locale" minimal/>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        name="scheduletime"
        v-model="scheduleData.time"
        label="* 일정 시간"
        mask="time"
        data-vv-scope="regschedule"
        v-validate="'required|time'"
        :error="errors.has('regschedule.scheduletime')"
        :error-message="getValidateMessage('scheduletime')"
        class="col-8 q-pr-sm"
        dense>
        <template v-slot:hint>
          {{`${scheduleData.time} ~ ${classBeforeTime}`}}
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time
                v-model="scheduleData.time"
                :hour-options="[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                :minute-options="[0, 10, 20, 30, 40, 50]"
                format24h
                now-btn
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- 일정 등록 시간 -->
      <q-select
        v-model="scheduleData.duration"
        label="등록 시간"
        :options="timeOpts"
        class="col-4"
        option-value="duration"
        option-label="label"
        emit-value
        map-options
        dense
        :hint="' '"
      />
    </div>
    <q-select
      name="content"
      v-model="scheduleData.content"
      label="일정"
      :options="scheduleOpts"
      data-vv-scope="regschedule"
      v-validate="'required'"
      :error="errors.has('regschedule.content')"
      :error-message="getValidateMessage('content')"
      use-input
      new-value-mode="add"
      class="col-12"
      dense
      flat
    >
      <template #selected-item="scope">
        <q-chip
          dense
          square
          size="12px"
          :tabindex="scope.tabindex"
        >
          {{ scheduleData.content }}
        </q-chip>
      </template>
    </q-select>
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import ValidateMixin from 'src/mixins/validateMixin'
import CalendarMixin from 'src/mixins/calendarMixin'
import DefaultDialog from 'components/dialog/DefaultDialog'
export default {
  name: 'RegSchedulePopup',
  mixins: [ValidateMixin, CalendarMixin],
  inject: ['$validator'],
  components: {
    DefaultDialog
  },
  props: {
    teachers: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      popupType: 'add',
      popupTitle: '일정 추가',
      buttonList: ['cancel', 'continue', 'regist'],
      teacherInfo: {},
      timeInfo: {},
      eventInfo: {},
      selectedData: {
        teacher: '',
        avatar: ''
      },
      techarFilterStr: '',
      timeOpts: [
        { label: '30분', value: 0.5, hour: 0, minute: 30, duration: 30 },
        { label: '1시간', value: 1, hour: 1, minute: 0, duration: 60 },
        { label: '1시간 반', value: 1.5, hour: 1, minute: 30, duration: 90 },
        { label: '2시간', value: 2, hour: 2, minute: 0, duration: 120 },
        { label: '2시간 반', value: 2.5, hour: 2, minute: 30, duration: 150 },
        { label: '3시간', value: 3, hour: 3, minute: 0, duration: 180 }
      ],
      timeType: { label: '1시간', value: 1, hour: 1, minute: 0, duration: 60 }, // 시간
      content: void 0,
      scheduleOpts: ['식사', '외근', '상담']
    }
  },
  computed: {
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('schedule', [
      'scheduleData'
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
    classBeforeTime () {
      const dateStr = this.scheduleData.date
      const timeStr = this.scheduleData.time
      const duration = this.scheduleData.duration
      let time = this.$moment(`${dateStr} ${timeStr}`)
      time.add(duration, 'm')
      return time.format('HH:mm')
    },
    selectedTeacher () {
      const staffIndex = _.findIndex(this.teachers, o => o._id === this.scheduleData.staffid)
      if (staffIndex === -1) return {}
      return _.get(this.teachers, [staffIndex], {})
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
      'initScheduleData'
    ]),
    async initData () {
      if (this.popupType === 'edit') {
        this.popupTitle = '일정 수정'
        this.buttonList = ['remove', 'cancel', 'edit']
        const _id = this.eventInfo._id
        await this.reqGetScheduleData({ _id })
      } else {
        this.popupTitle = '일정 추가'
        this.buttonList = ['cancel', 'continue', 'regist']
        this.initScheduleData()
        this.scheduleData.date = this.timeInfo.date
        this.scheduleData.time = this.timeInfo.time
        this.scheduleData.staffid = this.teacherInfo._id
      }
    },
    show ({ teacherInfo, timeInfo, event, isAdd = true }) {
      this.teacherInfo = teacherInfo
      this.timeInfo = timeInfo
      this.eventInfo = event
      this.popupType = isAdd ? 'add' : 'edit'
      this.initData()

      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    async onAddSchedule (isContinue) {
      const reqValidate = await this.$validator.validateAll('regschedule')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const dateStr = this.scheduleData.date
        this.scheduleData.stime = this.$moment(`${dateStr} ${this.scheduleData.time}`)
        this.scheduleData.etime = this.$moment(`${dateStr} ${this.classBeforeTime}`)
        const { code } = await this.reqAddSchedule({})
        if (code === 'ok') {
          if (!isContinue) {
            this.hide()
          }
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    },
    async onEditSchedule () {
      const reqValidate = await this.$validator.validateAll('regschedule')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const dateStr = this.scheduleData.date
        this.scheduleData.stime = this.$moment(`${dateStr} ${this.scheduleData.time}`)
        this.scheduleData.etime = this.$moment(`${dateStr} ${this.classBeforeTime}`)
        const { code } = await this.reqUpdateSchedule()
        if (code === 'ok') {
          this.hide()
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    },
    async onRemoveSchedule () {
      try {
        const { code } = await this.reqRemoveSchedule({ _id: this.scheduleData._id })
        if (code === 'ok') {
          this.hide()
        }
      } catch (e) {
        this.$notify.error(e)
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

<style lang="scss" scoped>
.form-content {
  display: grid;
  grid-template-columns: auto 50px auto;
  .f-label {
    align-self: center;
  }
  .form-all {
    grid-column: 1/4;
  }
}
</style>
