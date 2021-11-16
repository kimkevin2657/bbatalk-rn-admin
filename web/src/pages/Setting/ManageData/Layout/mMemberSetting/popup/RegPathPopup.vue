<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    title-icon="mdi-calendar-edit"
    :width="350"
    :height="240"
    :useButtons="buttonList"
    @regist="onAdd"
    @edit="onEdit"
    @continue="onAdd(true)"
  >
  <!-- 이름 -->
  <q-input
    ref="defineName"
    name="defineName"
    v-model="regPathDefineData.name"
    label="등록 경로 명"
    data-vv-scope="regdefine"
    v-validate="'required'"
    :error="errors.has('regdefine.defineName')"
    :error-message="getValidateMessage('endtime')"
    autofocus
    dense
    @keypress.enter="isAdd ? onAdd(true) : onEdit()"
  />
  <!-- 설명 -->
  <q-input
    name="desc"
    v-model="regPathDefineData.desc"
    label="설명"
    dense
    @keydown.enter="isAdd ? onAdd(true) : onEdit()"
  />
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import defaultDialog from 'components/dialog/DefaultDialog'
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'RegPathPopup',
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
      'regPathDefineData'
    ]),
    popupTitle () {
      if (this.isAdd) return '등록 경로 추가'
      else return '등록 경로 수정'
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
    async onAdd (isContinue) {
      const reqValidate = await this.$validator.validateAll('regdefine')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      this.regPathDefineData.gymid = this.gymInfo.id
      const { code } = await this.reqAddDefineData('regpath')
      if (code === 'ok') {
        if (!isContinue) this.$refs.dialog.hide()
      }
    },
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('regdefine')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const { code } = await this.reqUpdateDefineData({
        _id: this.regPathDefineData.id,
        type: 'regpath'
      })
      if (code === 'ok') {
        this.$refs.dialog.hide()
      }
    },
    show (rows) {
      if (rows) {
        this.isAdd = false
        this.setDefineData({ type: 'regpath', value: _.cloneDeep(rows) })
      } else {
        this.isAdd = true
        this.initDefineData()
      }
      this.$refs.dialog.show()
    }
  }
}
</script>
