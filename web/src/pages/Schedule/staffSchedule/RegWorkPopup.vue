/**
 * 업무 등록 팝업
 */
<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    :title-icon="popupType === 'add' ? 'mdi-calendar-plus' : 'mdi-calendar-edit'"
    :width="350"
    :height="340"
    :useButtons="buttonList"
    @regist="onAddWork"
    @edit="onEditWork"
    @remove="onRemoveWork"
    @continue="onAddWork(true)"
  >
    <!-- 강사명 부분-시작 -->
    <q-select
      v-model="selectedData.teacher"
      :options="teachersOpts"
      dense
      use-input
      @filter="onTeacherFilter"
      :disable="popupType === 'edit'"
      label="강사명"
      class="form-all"
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
          dense
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
    <!-- 강사명 부분-종료 -->
    <div style="display: grid; grid-template-columns: 1fr 50px 1fr;">
      <div style="grid-column: 1/4;">
        <q-select
          v-model="workState"
          :options="workOpt"
          label="업무 유형"
          dense
        />
      </div>
      <!-- 업무 시간 -->
      <q-input
        ref="startTime"
        name="starttime"
        v-model="stime"
        label="업무 시작"
        mask="time"
        data-vv-scope="regwork"
        v-validate="workState.value === 'work' ? 'required|time' : 'time'"
        :error="errors.has('regwork.starttime')"
        :error-message="getValidateMessage('starttime')"
        :disable="workState.value !== 'work'"
        dense
      >
        <template v-slot:hint>
          <!-- {{`${timeInfo.time} ~ ${classBeforeTime}`}} -->
        </template>
        <template v-slot:append>
          <q-icon
            name="access_time"
            class="cursor-pointer"
          >
            <q-popup-proxy
              ref="qTimeProxy1"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time
                v-model="stime"
                :hour-options="[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                :minute-options="[0, 10, 20, 30, 40, 50]"
                format24h
                now-btn
                @input="$refs.qTimeProxy1.hide()"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div style="align-self: center; justify-self: center;">~</div>
      <q-input
        name="endtime"
        v-model="etime"
        label="업무 종료"
        mask="time"
        data-vv-scope="regwork"
        v-validate="workState.value === 'work' ? 'required|time' : 'time'"
        :error="errors.has('regwork.endtime')"
        :error-message="getValidateMessage('endtime')"
        :disable="workState.value!=='work'"
        dense
      >
        <template v-slot:hint>
          <!-- {{`${timeInfo.time} ~ ${classBeforeTime}`}} -->
        </template>
        <template v-slot:append>
          <q-icon
            name="access_time"
            class="cursor-pointer"
          >
            <q-popup-proxy
              ref="qTimeProxy2"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time
                v-model="etime"
                :hour-options="[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                :minute-options="[0, 10, 20, 30, 40, 50]"
                format24h
                now-btn
                @input="$refs.qTimeProxy2.hide()"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- 등록 일자 -->
      <div style="grid-column: 1/4;">
        <q-input
          name="workdate"
          label="등록일"
          v-model="workDate"
          mask="####-##-##"
          data-vv-scope="regwork"
          v-validate="workState.value === 'work' ? 'required|date' : 'date'"
          :error="errors.has('regwork.workdate')"
          :error-message="getValidateMessage('workdate')"
          :disable="workState.value!=='work' || popupType==='edit'"
          dense
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="qDateProxy1"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="workDate"
                  @input="() => $refs.qDateProxy1.hide()"
                  :locale="locale"
                  minimal
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
  </default-dialog>
</template>

<script>
import { date } from 'quasar'
import { mapState, mapActions } from 'vuex'
import ValidateMixin from '../../../mixins/validateMixin'
import DefaultDialog from '../../../components/dialog/DefaultDialog'
export default {
  name: 'RegWorkPopup',
  mixins: [ValidateMixin],
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
      popupType: 'add', // 팝업 유형, add, edit
      popupTitle: '업무 추가',
      buttonList: ['cancel', 'continue', 'regist'],
      teacherInfo: {},
      workOpt: [
        { label: '업무', value: 'work' },
        { label: '휴일', value: 'vacation' }
      ],
      workState: { label: '미등록', value: 'none' }, // none, work,
      workDate: '', // 등록 일자
      stime: '', // 업무 시간
      etime: '', // 업무 종료 시간
      selectedData: {
        teacher: '',
        avatar: ''
      },
      techarFilterStr: '',
      locale: { // 미니 캘린더 한글 정보
        days: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        daysShort: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        firstDayOfWeek: 1
      }
    }
  },
  computed: {
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('gym', [
      'gymData'
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
    selectedTeacher () {
      return _.get(this.selectedData, ['teacher'], {})
    }
  },
  methods: {
    ...mapActions('schedule', [
      'reqAddWorkTime',
      'reqUpdateWorkTime',
      'reqRemoveWorkTime'
    ]),
    onTeacherFilter (val, update) {
      this.techarFilterStr = val
      update()
    },
    initData () {
      const work = _.get(this.teacherInfo, ['work'])
      if (work) {
        // 수정
        this.popupType = 'edit'
        if (work.type === 'work') this.workState = { label: '업무', value: 'work' }
        if (work.type === 'vacation') this.workState = { label: '휴일', value: 'vacation' }
        this.workDate = this.$moment(work.date).format('YYYY-MM-DD')
        this.stime = this.$moment(work.stime).format('HH:mm')
        this.etime = this.$moment(work.etime).format('HH:mm')
      } else {
        // 추가
        this.popupType = 'add'
        this.workState = { label: '미등록', value: 'none' }
        // this.workDate = date.formatDate(Date.now(), 'YYYY-MM-DD')
        this.stime = '09:00'
        this.etime = '18:00'
      }

      this.selectedData.teacher = _.assignIn(this.teacherInfo, {
        label: `${this.teacherInfo.team} ${this.teacherInfo.name}`,
        value: this.teacherInfo.name
      })

      if (this.popupType === 'add') {
        this.popupTitle = '업무 추가'
        this.buttonList = ['cancel', 'continue', 'regist']
      } else {
        this.popupTitle = '업무 수정'
        this.buttonList = ['remove', 'cancel', 'edit']
      }
    },
    show ({ teacherInfo, selectedDate }) {
      this.teacherInfo = teacherInfo
      this.initData()
      if (this.popupType === 'add') {
        this.workDate = date.formatDate(selectedDate, 'YYYY-MM-DD')
      }
      this.$refs.dialog.show()
    },
    isValidTime () {
      // 영업시간 안으로 업무시간을 설정하는지 체크
      const gymStime = this.$moment(this.gymData.stime, 'HH:mm')
      const stime = this.$moment(this.stime, 'HH:mm')
      if (stime < gymStime) return false
      const gymEtime = this.$moment(this.gymData.etime, 'HH:mm')
      const etime = this.$moment(this.etime, 'HH:mm')
      if (etime > gymEtime) return false
      return true
    },
    async onAddWork (isContinue) {
      if (this.workState.value === 'none') return this.$notify.error('업무 유형를 선택하세요.')
      const reqValidate = await this.$validator.validateAll('regwork')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      if (!this.isValidTime()) return this.$notify.error('영업시간 내로 설정해야 합니다.')
      try {
        const { code } = await this.reqAddWorkTime({
          gymid: this.gymInfo.id,
          staffid: this.selectedData.teacher._id,
          type: this.workState.value,
          date: new Date(this.workDate),
          stime: this.$moment(`${this.workDate} ${this.stime}`),
          etime: this.$moment(`${this.workDate} ${this.etime}`)
        })
        if (code === 'ok') {
          if (!isContinue) {
            this.hide()
          }
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    async onEditWork () {
      const reqValidate = await this.$validator.validateAll('regwork')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      if (!this.isValidTime()) return this.$notify.error('영업시간 내로 설정해야 합니다.')
      try {
        const { code } = await this.reqUpdateWorkTime({
          query: {
            _id: _.get(this.teacherInfo, ['work', '_id'])
          },
          row: {
            gymid: this.gymInfo.id,
            staffid: this.selectedData.teacher._id,
            type: this.workState.value,
            date: new Date(this.workDate),
            stime: this.$moment(`${this.workDate} ${this.stime}`),
            etime: this.$moment(`${this.workDate} ${this.etime}`)
          }
        })
        if (code === 'ok') {
          this.hide()
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    async onRemoveWork () {
      try {
        const id = _.get(this.teacherInfo, ['work', '_id'])
        const { code } = await this.reqRemoveWorkTime({ _id: id })
        if (code === 'ok') {
          this.hide()
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    hide () {
      this.$refs.dialog.hide()
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
