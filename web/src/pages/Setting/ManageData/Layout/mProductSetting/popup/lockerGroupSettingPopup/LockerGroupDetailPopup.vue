<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    title-icon="mdi-calendar-edit"
    :width="300"
    :height="270"
    :useButtons="buttonList"
    @regist="onAdd"
    @edit="onEdit"
    @continue="onAdd(true)"
  >
  <div class="row">
    <div class="q-gutter-sm">
      <q-radio v-model="mode" val="pay" label="금액(원)" dense @input="selectedData.discount = 0"/>
      <q-radio v-model="mode" val="percent" label="퍼센트(%)" dense @input="percent = 0"/>
    </div>
    <!-- 개월 -->
    <q-input
      ref="defineMonth"
      name="defineMonth"
      v-model.number="selectedData.month"
      type="number"
      label="기간(개월)"
      suffix="월"
      data-vv-scope="regdetail"
      v-validate="'required'"
      :error="errors.has('regdetail.defineMonth')"
      :error-message="getValidateMessage('defineMonth')"
      autofocus
      dense
      class="col-12"
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
      hide-bottom-space
    />
    <!-- 할인 금액 -->
    <q-input
      v-show="mode === 'pay'"
      ref="defineDiscount"
      name="defineDiscount"
      v-model.number="selectedData.discount"
      type="number"
      :label="'할인 금액'"
      suffix="원"
      data-vv-scope="regdetail"
      v-validate="'required'"
      :error="errors.has('regdetail.defineDiscount')"
      :error-message="getValidateMessage('defineDiscount')"
      autofocus
      dense
      class="col-12"
      @blur="() => { if(!selectedData.discount) selectedData.discount = 0 }"
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
      hide-bottom-space
    >
    </q-input>
    <!-- 퍼센트 -->
    <q-input
      v-show="mode === 'percent'"
      name="percent"
      v-model.number="percent"
      :label="'할인율'"
      suffix="%"
      mask="###"
      data-vv-scope="regdetail"
      v-validate="'required|min_value:0|max_value:100'"
      :error="errors.has('regdetail.percent')"
      :error-message="getValidateMessage('percent')"
      autofocus
      dense
      hide-bottom-space
      class="col-4"
      @blur="() => { if(!percent) percent = 0 }"
      @input="(val) => {
        // 전체값 X 퍼센트 ÷ 100
        selectedData.discount = Math.ceil((defPrice * val) / 100)
      }"
      @keypress.enter="isAdd ? onAdd(true) : onEdit()"
    >
    </q-input>
    <div class="col-12" style="margin-top: 15px; font-weight: 500; text-align: end;">
      {{`가격: ${priceData.toLocaleString()}원`}}
    </div>
  </div>
  </default-dialog>
</template>

<script>
import { mapState } from 'vuex'
import defaultDialog from 'components/dialog/DefaultDialog'
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'LockerGroupSettingPopup',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  components: {
    defaultDialog
  },
  data () {
    return {
      isAdd: true,
      mode: 'pay',
      percent: 0,
      selectedData: {
        id: void 0,
        month: 1,
        discount: 0,
        price: 0
      }
    }
  },
  computed: {
    ...mapState('defineDatas', [
      'lockerGroupData'
    ]),
    popupTitle () {
      if (this.isAdd) return '상세 항목 추가'
      else return '상세 항목 수정'
    },
    buttonList () {
      if (this.isAdd) return ['cancel', 'continue', 'regist']
      else return ['cancel', 'edit']
    },
    defPrice () {
      return this.selectedData.month * this.lockerGroupData.defPrice
    },
    priceData () {
      return (this.selectedData.month * this.lockerGroupData.defPrice) - this.selectedData.discount
    }
  },
  methods: {
    async onAdd (isContinue) {
      const reqValidate = await this.$validator.validateAll('regdetail')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      // 중복확인
      const duplIndex = _.findIndex(this.lockerGroupData.product, o => {
        return o.month === this.selectedData.month
      })
      if (duplIndex !== -1) return this.$notify.error('중복되는 설정이 있습니다.')

      this.selectedData.id = Date.now().toString()
      let row = _.cloneDeep(this.selectedData)
      row.price = this.priceData
      let tempDataList = _.cloneDeep(this.lockerGroupData.product)
      tempDataList.push(row)
      this.lockerGroupData.product = _.sortBy(tempDataList, ['month'])
      this.$notify.info('추가 되었습니다.')
      if (!isContinue) this.$refs.dialog.hide()
    },
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('regdetail')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      let tempDataList = _.cloneDeep(this.lockerGroupData.product)

      // 중복확인
      const duplIndex = _.findIndex(this.lockerGroupData.product, o => {
        return o.month === this.selectedData.month && o.id !== this.selectedData.id
      })
      if (duplIndex !== -1) return this.$notify.error('중복되는 설정이 있습니다.')

      let rowIndex = _.findIndex(tempDataList, (o) => {
        return o.id === this.selectedData.id
      })
      if (rowIndex === -1) return this.$notify.error('항목을 찾을 수 없습니다.')
      this.selectedData.price = this.priceData
      tempDataList[rowIndex] = this.selectedData
      this.lockerGroupData.product = _.sortBy(tempDataList, ['month'])
      this.$notify.info('수정 되었습니다.')
      this.$refs.dialog.hide()
    },
    async show (row) {
      this.mode = 'pay'
      this.percent = 0
      if (row) {
        this.isAdd = false
        this.selectedData = _.cloneDeep(row)
      } else {
        this.isAdd = true
        this.selectedData.id = void 0
        this.selectedData.month = 1
        this.selectedData.discount = 0
        this.selectedData.price = 0
      }
      this.$refs.dialog.show()
    }
  }
}
</script>
