<template>
  <div class="row">
    <div class="col-12 row">
      <q-space />
      <q-btn
        label="락커 그룹 추가"
        color="blue-grey"
        class="q-ma-md"
        style="align-content: center; width: 220px"
        @click="onAddLockerGroup"
      />
      <q-space />
    </div>
    <q-list
      padding
      plat
      class="col-12"
    >
      <q-item-label header>락커 그룹 항목</q-item-label>
      <q-item
        clickable
        v-ripple
        v-for="(lockerGroup, idx) in lockerGroupDataList"
        :key="`l-${idx}`"
        :active="selectGroup === lockerGroup.name"
        @click="
          selectGroup = lockerGroup.name
          setDefineData({type: 'lockergroup', value: lockerGroup})
        "
        active-class="select-menu"
      >
        <q-item-section class="q-pl-sm">
          <q-item-label lines="1">{{lockerGroup.name}} ({{lockerGroup.cnt}})</q-item-label>
          <q-item-label caption>{{lockerGroup.desc}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <locker-group-setting-popup ref="lockerGroupPopup" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
// popup
import LockerGroupSettingPopup from 'src/pages/Setting/ManageData/Layout/mProductSetting/popup/LockerGroupSettingPopup'
export default {
  name: 'LockerGroupList',
  components: {
    LockerGroupSettingPopup
  },
  async mounted () {
    await this.reqGetDefineDataList({ type: 'lockergroup' })
  },
  data () {
    return {
      selectGroup: void 0
    }
  },
  computed: {
    ...mapState('defineDatas', [
      'lockerGroupDataList'
    ])
  },
  methods: {
    ...mapActions('defineDatas', [
      'reqGetDefineDataList'
    ]),
    ...mapMutations('defineDatas', [
      'setDefineData'
    ]),
    onAddLockerGroup () {
      this.$refs.lockerGroupPopup.show()
    }
  }
}
</script>

<style scoped>
.select-menu {
  color: rgb(96, 125, 139);
  border-left-color: rgb(96, 125, 139);
  border-left: 2px solid;
  border-left-width: 2px;
  border-left-style: solid;
  background: rgb(236, 239, 241);
}
</style>
