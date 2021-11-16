<template>
  <default-dialog
    ref="dialog"
    :title="popupTitle"
    title-icon="mdi-door"
    :width="350"
    :height="300"
    :useButtons="buttonList"
    @regist="onAddRoom"
    @edit="onEditRoom"
    @continue="onAddRoom(true)"
  >
  <!-- 룸 이름 -->
  <q-input
    ref="roomName"
    name="roomName"
    v-model="roomDefineData.name"
    label="룸 명"
    data-vv-scope="regroom"
    v-validate="'required'"
    :error="errors.has('regroom.roomName')"
    :error-message="getValidateMessage('roomName')"
    autofocus
    dense
    @keypress.enter="isAdd ? onAddRoom(true) : onEditRoom()"
  />
  <!-- 부서 이름 -->
  <q-select
    name="team"
    label="*부서"
    v-model="roomDefineData.team"
    :options="teamOpts"
    data-vv-scope="regdefine"
    v-validate="'required'"
    :error="errors.has('regdefine.team')"
    :error-message="getValidateMessage('team')"
    class="col-12"
    dense
  />
  <!-- 설명 -->
  <q-input
    name="desc"
    v-model="roomDefineData.desc"
    label="설명"
    dense
    @keydown.enter="isAdd ? onAddRoom(true) : onEditRoom()"
  />
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import defaultDialog from 'components/dialog/DefaultDialog'
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'RegRoom',
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
      'departmentDefineDataList',
      'roomDefineData'
    ]),
    popupTitle () {
      if (this.isAdd) return '룸 추가'
      else return '룸 수정'
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
    async onAddRoom (isContinue) {
      const reqValidate = await this.$validator.validateAll('regroom')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      this.roomDefineData.gymid = this.gymInfo.id
      try {
        const { code } = await this.reqAddDefineData('room')
        if (code === 'ok') {
          if (!isContinue) this.$refs.dialog.hide()
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    async onEditRoom () {
      const reqValidate = await this.$validator.validateAll('regroom')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const { code } = await this.reqUpdateDefineData({
          _id: this.roomDefineData._id,
          type: 'room'
        })
        if (code === 'ok') {
          this.$refs.dialog.hide()
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    show (rows) {
      // 부서 정보 가져오기
      this.reqGetDefineDataList({ type: 'department' })
      if (rows) {
        this.isAdd = false
        this.setDefineData({ type: 'room', value: _.cloneDeep(rows) })
      } else {
        this.isAdd = true
        this.initDefineData()
      }
      this.$refs.dialog.show()
    }
  }
}
</script>
