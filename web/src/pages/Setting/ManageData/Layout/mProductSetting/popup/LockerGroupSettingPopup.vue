<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    title-icon="mdi-ticket-account"
    :width="500"
    :height="720"
    :useButtons="buttonList"
    @regist="onAdd"
    @edit="onEdit"
    @continue="onAdd(true)"
  >
    <div class="row">
      <!-- 락커 그룹 이름 -->
      <q-input
        ref="defineName"
        name="defineName"
        v-model="lockerGroupData.name"
        label="*락커 그룹 명"
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
      <!-- 락커 그룹 이름 -->
      <q-input
        ref="defineCnt"
        name="defineCnt"
        v-model.number="lockerGroupData.cnt"
        type="number"
        label="*락커 수"
        data-vv-scope="regdefine"
        v-validate="'required'"
        :error="errors.has('regdefine.defineCnt')"
        :error-message="getValidateMessage('defineCnt')"
        autofocus
        dense
        class="col-12"
        @keypress.enter="isAdd ? onAdd(true) : onEdit()"
        hide-bottom-space
      />
      <!-- 개월당 가격 -->
      <q-input
        ref="defineDefPrice"
        name="defineDefPrice"
        v-model.number="lockerGroupData.defPrice"
        type="number"
        label="*개월당 가격"
        suffix="원"
        data-vv-scope="regdefine"
        v-validate="'required'"
        :error="errors.has('regdefine.defineDefPrice')"
        :error-message="getValidateMessage('defineDefPrice')"
        autofocus
        dense
        class="col-12"
        @keypress.enter="isAdd ? onAdd(true) : onEdit()"
        @input="onInputDefPriceCalc"
        hide-bottom-space
      />

      <!-- 설명 -->
      <q-input
        name="desc"
        v-model="lockerGroupData.desc"
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
      <locker-group-detail-list class="col-12" />
      <!-- 환불 정책 -->
      <div class="col-12 q-my-sm">
        <b>환불 정책</b>
      </div>
      <q-input
        name="refundPrice"
        v-model.number="lockerGroupData.refundPrice"
        label="1일 환불 가격"
        suffix="원"
        data-vv-scope="regdefine|numeric"
        v-validate="'required'"
        :error="errors.has('regdefine.refundPrice')"
        :error-message="getValidateMessage('refundPrice')"
        autofocus
        dense
        class="col-12"
        hint="1일 환불 가격을 기준으로 남은 기간에 대한 환불금이 책정됩니다."
        @keypress.enter="isAdd ? onAdd(true) : onEdit()"
      />
      <!-- 기간변경 정책 -->
      <div class="col-12 q-my-sm">
        <b>기간변경 정책</b>
        <q-icon name="mdi-information" color="primary" style="margin-left: 5px;">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
            기간이 유효한 락커에 한하여 일괄적으로 적용됩니다. 신중하게 변경하세요.
          </q-tooltip>
        </q-icon>
      </div>
      <q-input
        name="delayCnt"
        v-model.number="lockerGroupData.delayCnt"
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
        v-model.number="lockerGroupData.delayDay"
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
        v-model.number="lockerGroupData.pauseCnt"
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
        v-model.number="lockerGroupData.pauseDay"
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
import LockerGroupDetailList from './lockerGroupSettingPopup/LockerGroupDetailList'
export default {
  name: 'LockerGroupSettingPopup',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  components: {
    defaultDialog,
    LockerGroupDetailList
  },
  data () {
    return {
      isAdd: true
    }
  },
  computed: {
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('defineDatas', [
      'lockerGroupData'
    ]),
    popupTitle () {
      if (this.isAdd) return '락커 그룹 추가'
      else return '락커 그룹 수정'
    },
    buttonList () {
      if (this.isAdd) return ['cancel', 'continue', 'regist']
      else return ['cancel', 'edit']
    },
    priceData () {
      return (this.selectedData.month * this.selectedData.defPrice) - this.selectedData.discount
    }
  },
  methods: {
    ...mapActions('defineDatas', [
      'reqAddDefineData',
      'reqUpdateDefineData'
    ]),
    ...mapMutations('defineDatas', [
      'initDefineData',
      'setDefineData'
    ]),
    onInputDefPriceCalc (val) {
      this.lockerGroupData.refundPrice = Math.ceil(val / 30)
      _.forEach(this.lockerGroupData.product, (o) => {
        o.price = (o.month * val) - o.discount
      })
    },
    async onAdd (isContinue) {
      const reqValidate = await this.$validator.validateAll('regdefine')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      this.lockerGroupData.gymid = this.gymInfo.id
      const { code } = await this.reqAddDefineData('lockergroup')
      if (code === 'ok') {
        if (!isContinue) this.$refs.dialog.hide()
      }
    },
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('regdefine')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const { code } = await this.reqUpdateDefineData({
        _id: this.lockerGroupData._id,
        type: 'lockergroup'
      })
      if (code === 'ok') {
        this.$refs.dialog.hide()
      }
    },
    show (row) {
      if (row) {
        this.isAdd = false
        this.setDefineData({ type: 'lockergroup', value: _.cloneDeep(row) })
      } else {
        this.isAdd = true
        this.initDefineData()
        this.lockerGroupData.refundPrice = Math.ceil(this.lockerGroupData.defPrice / 30)
      }
      this.$refs.dialog.show()
    }
  }
}
</script>
