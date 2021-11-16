<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    title-icon="mdi-calendar-edit"
    :width="350"
    :height="230"
    :useButtons="buttonList"
    @regist="onAddRank"
    @edit="onEditRank"
    @continue="onAddRank(true)"
  >
  <!-- 직급 이름 -->
  <q-input
    ref="rankName"
    name="rankName"
    v-model="rankDefineData.name"
    label="직급 명"
    data-vv-scope="regrank"
    v-validate="'required'"
    :error="errors.has('regrank.rankName')"
    :error-message="getValidateMessage('endtime')"
    autofocus
    dense
    @keypress.enter="isAdd ? onAddRank(true) : onEditRank()"
  />
  <!-- 설명 -->
  <q-input
    name="desc"
    v-model="rankDefineData.desc"
    label="설명"
    dense
    @keydown.enter="isAdd ? onAddRank(true) : onEditRank()"
  />
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import defaultDialog from 'components/dialog/DefaultDialog'
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'RegRank',
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
      'rankDefineData'
    ]),
    popupTitle () {
      if (this.isAdd) return '직급 추가'
      else return '직급 수정'
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
    async onAddRank (isContinue) {
      const reqValidate = await this.$validator.validateAll('regrank')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      this.rankDefineData.gymid = this.gymInfo.id
      try {
        const { code } = await this.reqAddDefineData('rank')
        if (code === 'ok') {
          if (!isContinue) this.$refs.dialog.hide()
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    async onEditRank () {
      const reqValidate = await this.$validator.validateAll('regrank')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const { code } = await this.reqUpdateDefineData({
          _id: this.rankDefineData._id,
          type: 'rank'
        })
        if (code === 'ok') {
          this.$refs.dialog.hide()
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    show (rows) {
      if (rows) {
        this.isAdd = false
        this.setDefineData({ type: 'rank', value: _.cloneDeep(rows) })
      } else {
        this.isAdd = true
        this.initDefineData()
      }
      this.$refs.dialog.show()
    }
  }
}
</script>
