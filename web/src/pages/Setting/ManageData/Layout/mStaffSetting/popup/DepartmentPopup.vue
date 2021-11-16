<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    title-icon="mdi-calendar-edit"
    :width="350"
    :height="230"
    :useButtons="buttonList"
    @regist="onAddDepartment"
    @edit="onEditDepartment"
    @continue="onAddDepartment(true)"
  >
  <!-- 부서 이름 -->
  <q-input
    ref="departmentName"
    name="departmentName"
    v-model="departmentDefineData.name"
    label="부서 명"
    data-vv-scope="regdepartment"
    v-validate="'required'"
    :error="errors.has('regdepartment.departmentName')"
    :error-message="getValidateMessage('endtime')"
    autofocus
    dense
    @keypress.enter="isAdd ? onAddDepartment(true) : onEditDepartment()"
  />
  <!-- 설명 -->
  <q-input
    name="desc"
    v-model="departmentDefineData.desc"
    label="설명"
    dense
    @keypress.enter="isAdd ? onAddDepartment(true) : onEditDepartment()"
  />
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import defaultDialog from 'components/dialog/DefaultDialog'
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'RegDepartment',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  components: {
    defaultDialog
  },
  data () {
    return {
      isAdd: true,
      selectedData: {
        id: void 0,
        name: '',
        desc: ''
      }
    }
  },
  computed: {
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('defineDatas', [
      'departmentDefineData'
    ]),
    popupTitle () {
      if (this.isAdd) return '부서 추가'
      else return '부서 수정'
    },
    buttonList () {
      if (this.isAdd) return ['cancel', 'continue', 'regist']
      else return ['cancel', 'edit']
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
    async onAddDepartment (isContinue) {
      const reqValidate = await this.$validator.validateAll('regdepartment')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      this.departmentDefineData.gymid = this.gymInfo.id
      const { code } = await this.reqAddDefineData('department')
      if (code === 'ok') {
        if (!isContinue) this.$refs.dialog.hide()
      }
    },
    async onEditDepartment () {
      const reqValidate = await this.$validator.validateAll('regdepartment')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const { code } = await this.reqUpdateDefineData({
        _id: this.departmentDefineData._id,
        type: 'department'
      })
      if (code === 'ok') {
        this.$refs.dialog.hide()
      }
    },
    show (rows) {
      if (rows) {
        this.isAdd = false
        this.setDefineData({ type: 'department', value: _.cloneDeep(rows) })
      } else {
        this.isAdd = true
        this.initDefineData()
      }
      this.$refs.dialog.show()
    }
  }
}
</script>
