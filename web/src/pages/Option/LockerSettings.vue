// 락커 현황
<template>
  <div>
    <top />
    <q-card class="q-ma-md">
      <q-card-section
        :horizontal="isSmall"
        class="q-pa-none"
        style="height: calc(100vh - 140px)"
      >
        <!-- 락커 그룹 항목: Desktop -->
        <q-card-section
          v-if="isSmall"
          style="width: 260px"
          class="q-pa-none"
        >
          <locker-group-list />
        </q-card-section>
        <q-separator
          vertical
          v-if="isSmall"
        />
        <q-card-section class="q-pa-none">
          <q-btn
            v-if="!isSmall"
            flat
            icon="mdi-menu"
            dense
            color="blue-grey"
            @click="isDialog = !isDialog"
          />
        </q-card-section>
        <q-separator v-if="!isSmall" />
        <!-- 락커 에디터 부분 -->
        <q-card-section
          style="width: 100%"
          class="q-pa-none"
        >
          <locker-editor />
        </q-card-section>
      </q-card-section>
    </q-card>
    <!-- 팝업 -->
    <locker-regist-popup ref="lockerRegistPopup" />
    <!-- 락커 그룹 항목: Mobile -->
    <q-dialog
      v-if="!isSmall"
      v-model="isDialog"
      position="left"
    >
      <q-card style="width: 260px; height: calc(100vh - 140px);">
        <q-card-section>
          <locker-group-list />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// 상태 관리용 스토어 등록
import { mapState, mapActions } from 'vuex'

// 컴포넌트
import Top from 'src/layouts/component/Top'
import LockerGroupList from './lockerSettings/LockerGroupList'
import LockerEditor from './lockerSettings/LockerEditor'

// Mixin
import MsgMixin from 'src/mixins/msgMixin'

// popup
import LockerRegistPopup from './popup/LockerRegistPopup'
export default {
  name: 'LockerSettings',
  mixins: [MsgMixin],
  components: {
    Top,
    LockerRegistPopup,
    LockerEditor,
    LockerGroupList
  },
  mounted () {
  },
  data () {
    return {
      rowsSelected: [],
      splitterModel: 30,
      isDialog: false
    }
  },
  computed: {
    ...mapState('lockerSettings', [
    ]),
    ...mapState('gym', [
      'gymData'
    ]),
    buttonDisables () {
      const selectedSize = _.size(this.rowsSelected)
      if (selectedSize === 0) return ['remove', 'edit']
      if (selectedSize === 1) return []
      if (selectedSize > 1) return ['edit']
      return []
    },
    isDisableSubBtn () {
      if (_.size(this.rowsSelected) !== 1) return true
      if (_.get(this.rowsSelected, [0, 'pay_state'], void 0) === 1) return false
      return true
    },
    isSmall () {
      return !this.$q.screen.lt.sm
    }
  },
  methods: {
    ...mapActions('lockerSettings', [
    ]),
    onAdd () {
      this.$refs.lockerRegistPopup.show()
    },
    onEdit () {
      this.$refs.lockerRegistPopup.show({ ticketInfo: this.rowsSelected[0] })
    },
    async removeLockerSettings () {
      try {
        let reqQuery = {}
        if (_.size(this.rowsSelected) === 1) {
          reqQuery._id = _.get(this.rowsSelected, [0, '_id'], void 0)
        } else {
          reqQuery.ids = _.map(this.rowsSelected, o => {
            return o._id
          })
        }
        const { code } = await this.reqRemoveLockerSettings(reqQuery)
        if (code === 'ok') {
          this.$refs.dataTable.init()
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    showRegPopup (rowData) {
      this.$refs.lockerRegistPopup.show({ ticketInfo: rowData })
    }
  }
}
</script>
