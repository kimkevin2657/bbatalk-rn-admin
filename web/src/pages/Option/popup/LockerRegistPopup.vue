<template>
  <default-dialog
    ref="defaultDialog"
    :title="updateMode ? '락커 그룹 수정' : '락커 그룹 등록'"
    :width="300"
    :height="230"
    :useButtons="updateMode ? ['cancel', 'edit'] : ['continue', 'cancel', 'confirm']"
    @confirm="onAdd()"
    @edit="onEdit()"
    @continue="onAdd(true)"
  >
    <div
      class="row"
      style="margin: 0px;"
    >
      <div class="column col-12">
        <div class="row">
          <q-input
            name="name"
            label="락커 그룹명"
            class="col-12"
            v-model="lockerGroupData.name"
            data-vv-scope="reglocker"
            v-validate="'required'"
            :error="errors.has('reglocker.name')"
            :error-message="getValidateMessage('name')"
            dense
          />
          <q-input
            name="desc"
            label="설명"
            class="col-12"
            v-model="lockerGroupData.desc"
            dense
          />
        </div>
      </div>
    </div>
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DefaultDialog from 'components/dialog/DefaultDialog'
// mixin
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'LockerRegistPopup',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  components: {
    DefaultDialog
  },
  computed: {
    ...mapState('lockerSettings', [
      'lockerGroupData'
    ]),
    ...mapState('auth', [
      'gymInfo'
    ])
  },
  data () {
    return {
      updateMode: false
    }
  },
  methods: {
    ...mapActions('lockerSettings', [
      'reqGetLockerGroupData',
      'reqAddLokcerGroupData',
      'reqUpdateLockerGroupData'
    ]),
    ...mapMutations('lockerSettings', [
      'initLokerGroupData'
    ]),
    show (data) {
      this.initData(data)
      this.$refs.defaultDialog.show()
    },
    // 초기화
    async initData (data) {
      if (!data) {
        // 화면 데이터 초기화
        this.updateMode = false
        this.initLokerGroupData()
      } else {
        this.updateMode = true
        await this.reqGetLockerGroupData({ _id: data._id })
      }
      await this.$nextTick()
      this.errors.clear()//  유효성 검사 초기화
    },
    // 락커 그룹 추가
    async onAdd (isContinue = false) {
      const reqValidate = await this.$validator.validateAll('regmember')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const { code } = await this.reqAddLokcerGroupData()
        if (code === 'ok') {
          if (!isContinue) {
            this.$refs.defaultDialog.hide()
          }
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    },
    // 락커 그룹 수정
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('regmember')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const { code } = await this.reqUpdateLockerGroupData()
        if (code === 'ok') {
          this.$refs.defaultDialog.hide()
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    }
  }
}
</script>

<style scoped>
.form-date {
  max-height: 60px;
  padding-top: 0px;
  margin-top: 0px;
}
</style>

<style lang="sass" scoped>
.row
  margin: 0px 0px 10px 0px
  padding: 0px 5px 0px 5px
</style>
