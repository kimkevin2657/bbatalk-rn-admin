<template>
  <div>
    <!-- 상태 현황 -->
    <div class="row q-mb-sm q-mx-sm">
      <template v-for="(item, index) in legend">
        <span
          :key="index"
          class="legend none-select"
          :class="legendIgnore.indexOf(item.key) >= 0 ? 'legend-disable' : ''"
          @click="onLegend(item.key)"
        >
          <q-icon
            name="mdi-checkbox-blank"
            :color="stateColor(item.key)"
          />
          {{item.label}}: {{item.cnt}}
        </span>
      </template>
      <q-space />
      <q-input
        style="max-width:150px;"
        dense
        debounce="300"
        v-model="filter"
        placeholder="이름 검색"
        flat
        square
        hide-bottom-space
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <!-- 구분선 -->
    <q-separator />
    <q-scroll-area style="height:calc( 100vh - 190px )">
      <!-- 락커 현황 -->
      <div class="row q-ma-sm">
        <q-card
          class="locker-card"
          v-for="locker in filterdDataList"
          :key="`locker-${locker.num}`"
          :class="lockerStateColorClass(locker.num)"
        >
          <q-card-section class="q-pa-none q-pl-sm">
            {{locker.num}}
          </q-card-section>
          <q-separator />
          <!-- 사용안함 -->
          <q-card-section
            v-if="locker.state === 'notuse'"
            class="q-pa-none q-pl-sm q-mb-md"
            style="font-size: 13px;"
          >
            사용안함
          </q-card-section>
          <!-- 락커 정보 -->
          <q-card-section
            v-if="locker.state === 'use'"
            class="q-pa-none q-pl-sm q-mb-md"
            style="font-size: 13px;"
          >
            <div>{{locker.name}}({{locker.special_n}})</div>
          </q-card-section>
          <!-- 만료일 -->
          <q-card-section
            v-if="locker.state === 'use'"
            class="q-pa-none row"
            style="font-size: 11px;"
          >
            <q-space />
            <div>~ {{locker.expired}}</div>
          </q-card-section>
        </q-card>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LockerEditor',
  mounted () {
    this.selectGroupId = _.get(this.lockerGroupData, '_id', void 0)
  },
  data () {
    return {
      selectGroupId: void 0,
      filter: void 0, // 검색
      legendIgnore: [], // 사용 안하는 범례 필터
      items: [
        {
          lockerGroupId: '600eee624040da8847854e40',
          num: 2,
          name: '김정민',
          mid: '',
          special_n: '2420',
          state: 'use',
          expired: '2021-02-23',
          desc: ''
        },
        {
          lockerGroupId: '600eee624040da8847854e40',
          num: 4,
          mid: '',
          name: '김남욱',
          special_n: '8721',
          state: 'use',
          expired: '2021-03-22',
          desc: ''
        },
        {
          lockerGroupId: '600eee624040da8847854e40',
          num: 10,
          state: 'notuse',
          desc: '고장으로 인하여 사용할 수 없습니다.'
        }
      ]
    }
  },
  computed: {
    ...mapState('defineDatas', [
      'lockerGroupData'
    ]),
    legend () {
      let empty = this.lockerGroupData.cnt
      let use = 0, caution = 0, expired = 0, notuse = 0
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i]
        const state = this.getState(item.num)
        if (state === 'use') { use++; empty-- }
        if (state === 'caution') { caution++; empty-- }
        if (state === 'expired') { expired++; empty-- }
        if (state === 'notuse') { notuse++; empty-- }
      }
      return [
        { key: 'empty', label: '빈락커', cnt: empty },
        { key: 'use', label: '사용중', cnt: use },
        { key: 'caution', label: '만료예정(~7일)', cnt: caution },
        { key: 'expired', label: '만료', cnt: expired },
        { key: 'notuse', label: '사용안함', cnt: notuse }
      ]
    },
    filterdDataList () {
      const list = []
      for (let i = 1, l = this.lockerGroupData.cnt; i <= l; i++) {
        const lockerData = this.lockerIndex[i]
        // filter
        const name = _.get(lockerData, 'name', '')
        if (this.filter && name.indexOf(this.filter) === -1) continue
        // legend filter
        const state = this.getState(_.get(lockerData, 'num', -1))
        if (this.legendIgnore.indexOf(state) >= 0) continue
        // inject
        if (!lockerData) list.push({ num: i, state: 'empty' })
        else list.push(lockerData)
      }
      return list
    },
    lockerIndex () { // 락커 사용자 인덱스
      const indexs = {}
      _.forEach(this.items, (item) => {
        indexs[item.num] = item
      })
      return indexs
    }
  },
  methods: {
    stateColor (key) {
      if (key === 'empty') return 'grey'
      if (key === 'use') return 'primary'
      if (key === 'caution') return 'warning'
      if (key === 'expired') return 'negative'
      if (key === 'notuse') return 'deep-purple'
    },
    lockerStateColorClass (idx) {
      const state = this.getState(idx)
      if (state === 'empty') return 'locker-state-empty'
      if (state === 'use') return 'locker-state-use'
      if (state === 'caution') return 'locker-state-caution'
      if (state === 'expired') return 'locker-state-expired'
      if (state === 'notuse') return 'locker-state-notuse'
    },
    // idx를 통해 락커의 상태를 확인
    getState (idx) {
      const lockerData = _.get(this.lockerIndex, [idx], void 0)
      // 빈락커
      if (!lockerData) return 'empty'
      // 사용안함
      if (lockerData.state === 'notuse') return 'notuse'
      const currentTime = this.$moment(this.$moment().format('YYYY-MM-DD'))
      const lockerExpiredTime = new this.$moment(lockerData.expired)
      // 만료된 락커
      if (currentTime.isAfter(lockerExpiredTime)) return 'expired'
      // 만료예정
      lockerExpiredTime.add(-7, 'd')
      if (currentTime.isAfter(lockerExpiredTime)) return 'caution'
      // 사용중인 락커
      return 'use'
    },
    // 범례 on/off
    onLegend (key) {
      const idx = _.findIndex(this.legendIgnore, o => o === key)
      const tempDataList = _.cloneDeep(this.legendIgnore)
      if (idx === -1) tempDataList.push(key)
      else tempDataList.splice(idx, 1)
      this.legendIgnore = tempDataList
    }
  },
  watch: {
    'lockerGroupData._id': function (val) {
      this.selectGroupId = val
    }
  }
}
</script>

<style scoped>
.locker-card {
  width: 105px;
  height: 80px;
  margin: 10px;
  border-bottom-width: 3px;
  border-bottom-style: solid;
}
.legend {
  margin-right: 5px;
  align-self: center;
  cursor: pointer;
}
.legend-disable {
  text-decoration-line: line-through;
}
.locker-state-empty {
  border-bottom-color: #9e9e9e !important;
}
.locker-state-use {
  border-bottom-color: #1976d2 !important;
}
.locker-state-caution {
  border-bottom-color: #f2c037 !important;
}
.locker-state-expired {
  border-bottom-color: #c10015 !important;
}
.locker-state-notuse {
  border-bottom-color: #673ab7 !important;
}
</style>
