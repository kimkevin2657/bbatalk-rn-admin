<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    title-icon="mdi-calendar-edit"
    :width="500"
    :height="740"
    :useButtons="buttonList"
    @regist="onAdd"
    @edit="onEdit"
    @continue="onAdd(true)"
  >
  <div class="row">
    <!-- 수강 이름 -->
    <q-input
      ref="defineName"
      name="defineName"
      v-model="lessonDefineData.name"
      label="*수강권 명"
      data-vv-scope="regdefine"
      v-validate="'required'"
      :error="errors.has('regdefine.defineName')"
      :error-message="getValidateMessage('defineName')"
      autofocus
      dense
      class="col-12"
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
      hide-bottom-space
    />
    <!-- 정원 -->
    <q-input
      ref="definePeopleCnt"
      name="definePeopleCnt"
      v-model.number="lessonDefineData.peopleCnt"
      type="number"
      label="*정원"
      suffix="명"
      data-vv-scope="regdefine"
      v-validate="'required'"
      :error="errors.has('regdefine.definePeopleCnt')"
      :error-message="getValidateMessage('definePeopleCnt')"
      autofocus
      dense
      class="col-6 q-pr-sm"
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
      hide-bottom-space
    />
    <!-- 회당 가격 -->
    <q-input
      ref="defineDefPrice"
      name="defineDefPrice"
      v-model.number="lessonDefineData.defPrice"
      type="number"
      label="*회당 가격"
      suffix="원"
      data-vv-scope="regdefine"
      v-validate="'required'"
      :error="errors.has('regdefine.defineDefPrice')"
      :error-message="getValidateMessage('defineDefPrice')"
      autofocus
      dense
      class="col-6 q-pl-sm"
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
      @input="onInputDefPriceCalc"
      hide-bottom-space
    />
    <q-select
      name="duration"
      label="*시간"
      v-model.number="lessonDefineData.duration"
      :options="timeOpts"
      option-value="duration"
      option-label="label"
      emit-value
      map-options
      data-vv-scope="regdefine"
      v-validate="'required'"
      :error="errors.has('regdefine.duration')"
      :error-message="getValidateMessage('duration')"
      class="col-6 q-pr-sm"
      dense
      hide-bottom-space
    >
    </q-select>
    <q-select
      name="team"
      label="*부서"
      v-model="lessonDefineData.team"
      :options="teamOpts"
      data-vv-scope="regdefine"
      v-validate="'required'"
      :error="errors.has('regdefine.team')"
      :error-message="getValidateMessage('team')"
      class="col-6 q-pl-sm"
      dense
      hide-bottom-space
    />
    <!-- 설명 -->
    <q-input
      name="desc"
      v-model="lessonDefineData.desc"
      label="설명"
      dense
      class="col-12"
      @keydown.enter="isAdd ? onAdd(true) : onEdit()"
      hide-bottom-space
    />
    <!-- 상세 항목 -->
    <div class="col-12 q-my-md">
      <b>상세 항목</b>
    </div>
    <lesson-detail-list class="col-12"/>
    <!-- 환불 정책 -->
    <div class="col-12 q-my-sm">
      <b>환불 정책</b>
    </div>
    <q-input
      name="refundPrice"
      v-model.number="lessonDefineData.refundPrice"
      label="회당 환불 가격"
      suffix="원"
      data-vv-scope="regdefine|numeric"
      v-validate="'required'"
      :error="errors.has('regdefine.refundPrice')"
      :error-message="getValidateMessage('refundPrice')"
      autofocus
      dense
      class="col-12"
      hint="회당 환불 가격을 기준으로 남은 횟수에 대한 환불금이 책정됩니다."
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
    />
    <!-- 기간변경 정책 -->
    <div class="col-12 q-my-sm">
      <b>기간변경 정책</b>
      <q-icon name="mdi-information" color="primary" style="margin-left: 5px;">
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          기간이 유효한 수강권에 한하여 일괄적으로 적용됩니다. 신중하게 변경하세요.
        </q-tooltip>
      </q-icon>
    </div>
    <q-input
      name="delayCnt"
      v-model.number="lessonDefineData.delayCnt"
      label="연장 가능 횟수"
      suffix="회"
      data-vv-scope="regdefine"
      v-validate="'required|numeric'"
      :error="errors.has('regdefine.delayCnt')"
      :error-message="getValidateMessage('delayCnt')"
      autofocus
      dense
      class="col-12"
      hint="유효기간 내에서 기간을 연장 할 수 있는 횟수 제한 설정"
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
    />
    <q-input
      name="delayDay"
      v-model.number="lessonDefineData.delayDay"
      label="연장 가능 일"
      suffix="일"
      data-vv-scope="regdefine"
      v-validate="'required|numeric'"
      :error="errors.has('regdefine.delayDay')"
      :error-message="getValidateMessage('delayDay')"
      autofocus
      dense
      class="col-12"
      hint="연장 가능 일 범위 내에서 기간을 연장 할 수 있습니다."
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
    />
    <q-input
      name="pauseCnt"
      v-model.number="lessonDefineData.pauseCnt"
      label="일시정지 가능 횟수"
      suffix="회"
      data-vv-scope="regdefine"
      v-validate="'required|numeric'"
      :error="errors.has('regdefine.pauseCnt')"
      :error-message="getValidateMessage('pauseCnt')"
      autofocus
      dense
      class="col-12"
      hint="유효기간 내에서 정지기간을 설정 할 수 있는 횟수 제한"
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
    />
    <q-input
      name="pauseDay"
      v-model.number="lessonDefineData.pauseDay"
      label="일시정지 가능 일"
      suffix="일"
      data-vv-scope="regdefine"
      v-validate="'required|numeric'"
      :error="errors.has('regdefine.pauseDay')"
      :error-message="getValidateMessage('pauseDay')"
      autofocus
      dense
      class="col-12"
      hint="일시정지 가능 일 범위 내에서 정지기간을 설정 할 수 있습니다."
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
    />
  </div>
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import defaultDialog from 'components/dialog/DefaultDialog'
import ValidateMixin from 'src/mixins/validateMixin'
import LessonDetailList from './lessonSettingPopup/LessonDetailList'
export default {
  name: 'LessonSettingPopup',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  components: {
    defaultDialog,
    LessonDetailList
  },
  data () {
    return {
      isAdd: true,
      productItem: {
        month: 1,
        totCnt: 20,
        discount: 0,
        price: 0
      },
      timeOpts: [
        { label: '30분', duration: 30 },
        { label: '1시간', duration: 60 },
        { label: '1시간 반', duration: 90 },
        { label: '2시간', duration: 120 },
        { label: '2시간 반', duration: 150 },
        { label: '3시간', duration: 180 }
      ]
    }
  },
  computed: {
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('defineDatas', [
      'lessonDefineData',
      'departmentDefineDataList'
    ]),
    popupTitle () {
      if (this.isAdd) return '수강권 추가'
      else return '수강권 수정'
    },
    buttonList () {
      if (this.isAdd) return ['cancel', 'continue', 'regist']
      else return ['cancel', 'edit']
    },
    teamOpts () {
      return _.map(this.departmentDefineDataList, o => o.name)
    }
  },
  methods: {
    ...mapActions('defineDatas', [
      'reqAddDefineData',
      'reqUpdateDefineData',
      'reqGetDefineDataList'
    ]),
    ...mapMutations('defineDatas', [
      'initDefineData',
      'setDefineData'
    ]),
    onInputDefPriceCalc (val) {
      this.lessonDefineData.refundPrice = +val
      _.forEach(this.lessonDefineData.product, (o) => {
        o.price = (o.totCnt * val) - o.discount
      })
    },
    async onAdd (isContinue) {
      const reqValidate = await this.$validator.validateAll('regdefine')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      this.lessonDefineData.gymid = this.gymInfo.id
      const { code } = await this.reqAddDefineData('lesson')
      if (code === 'ok') {
        if (!isContinue) this.$refs.dialog.hide()
      }
    },
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('regdefine')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const { code } = await this.reqUpdateDefineData({
        _id: this.lessonDefineData._id,
        type: 'lesson'
      })
      if (code === 'ok') {
        this.$refs.dialog.hide()
      }
    },
    async show (row) {
      // 부서 정보 가져오기
      await this.reqGetDefineDataList({ type: 'department' })
      if (row) {
        this.isAdd = false
        this.setDefineData({ type: 'lesson', value: _.cloneDeep(row) })
      } else {
        this.isAdd = true
        this.initDefineData()
        this.lessonDefineData.refundPrice = this.lessonDefineData.defPrice
      }
      this.$refs.dialog.show()
    }
  }
}
</script>
