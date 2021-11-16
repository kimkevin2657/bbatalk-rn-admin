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
  <!-- 마케팅 경로 이름 -->
  <q-input
    ref="defineName"
    name="defineName"
    v-model="selectedData.name"
    label="마케팅 경로 명"
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
    v-model="selectedData.desc"
    label="설명"
    dense
    @keydown.enter="isAdd ? onAdd(true) : onEdit()"
  />
  </default-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import defaultDialog from '../../../../../../components/dialog/DefaultDialog'
import ValidateMixin from '../../../../../../mixins/validateMixin'
export default {
  name: 'MarketingPathPopup',
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
    popupTitle () {
      if (this.isAdd) return '마케팅 경로 추가'
      else return '마케팅 경로 수정'
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
    async onAdd (isContinue) {
      const reqValidate = await this.$validator.validateAll('regdefine')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const { code } = await this.reqAddDefineData({
        gymid: this.gymInfo.id,
        type: 'marketingpath',
        name: this.selectedData.name,
        desc: this.selectedData.desc
      })
      if (code === 'ok') {
        if (!isContinue) this.$refs.dialog.hide()
      }
    },
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('regdefine')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const { code } = await this.reqUpdateDefineData({
        query: {
          _id: this.selectedData.id,
          type: 'marketingpath'
        },
        row: {
          gymid: this.gymInfo.id,
          type: 'marketingpath',
          name: this.selectedData.name,
          desc: this.selectedData.desc
        }
      })
      if (code === 'ok') {
        this.$refs.dialog.hide()
      }
    },
    show (rows) {
      if (rows) {
        this.isAdd = false
        this.selectedData.id = rows._id
        this.selectedData.name = rows.name
        this.selectedData.desc = rows.desc
      } else {
        this.isAdd = true
        this.selectedData.name = ''
        this.selectedData.desc = ''
      }
      this.$refs.dialog.show()
    }
  }
}
</script>
