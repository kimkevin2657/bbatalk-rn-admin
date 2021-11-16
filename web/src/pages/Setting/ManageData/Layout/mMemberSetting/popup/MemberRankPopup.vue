<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    title-icon="mdi-calendar-edit"
    :width="350"
    :height="290"
    :useButtons="buttonList"
    @regist="onAdd"
    @edit="onEdit"
    @continue="onAdd(true)"
  >
  <!-- 회원 등급 명 -->
  <q-input
    ref="defineName"
    name="defineName"
    v-model="memberRankDefineData.name"
    label="회원 등급 명"
    data-vv-scope="regdefine"
    v-validate="'required'"
    :error="errors.has('regdefine.defineName')"
    :error-message="getValidateMessage('defineName')"
    autofocus
    dense
    @keypress.enter="isAdd ? onAdd(true) : onEdit()"
  />
  <!-- 기간 설정 -->
  <q-input
    ref="rankPrice"
    name="rankPrice"
    v-model.number="memberRankDefineData.rankPrice"
    type="Number"
    label="설정 금액"
    hint="설정된 금액의 이상일 경우 해당 등급으로 설정"
    suffix="원"
    data-vv-scope="regdefine"
    v-validate="'required'"
    :error="errors.has('regdefine.rankPrice')"
    :error-message="getValidateMessage('rankPrice')"
    dense
    @keypress.enter="isAdd ? onAdd(true) : onEdit()"
  />
  <!-- 설명 -->
  <q-input
    name="desc"
    v-model="memberRankDefineData.desc"
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
  name: 'MemberRankPopup',
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
      'memberRankDefineData'
    ]),
    popupTitle () {
      if (this.isAdd) return '회원 등급 추가'
      else return '회원 등급 수정'
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
      this.memberRankDefineData.gymid = this.gymInfo.id
      const { code } = await this.reqAddDefineData('memberrank')
      if (code === 'ok') {
        if (!isContinue) this.$refs.dialog.hide()
      }
    },
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('regdefine')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const { code } = await this.reqUpdateDefineData({
        _id: this.memberRankDefineData._id,
        type: 'memberrank'
      })
      if (code === 'ok') {
        this.$refs.dialog.hide()
      }
    },
    show (rows) {
      if (rows) {
        this.isAdd = false
        this.setDefineData({ type: 'memberrank', value: _.cloneDeep(rows) })
      } else {
        this.isAdd = true
        this.initDefineData()
      }
      this.$refs.dialog.show()
    }
  }
}
</script>
