<template>
  <div>
    <q-table
      :data="lockerGroupDataList"
      :columns="columns"
      :pagination.sync="pagination"
      :selected.sync="rowsSelected"
      :filter="filter"
      row-key="_id"
      selection="multiple"
      separator="cell"
      no-data-label="데이터를 찾지 못하였습니다. (락커 그룹을 추가하세요.)"
      no-results-label="검색된 결과가 없습니다."
      @row-click="(evt, row) => onMultiRowClick(evt, row)"
      @row-dblclick="(evt, row) => {
        $refs.regPopup.show(row)
        rowsSelected = [row]
      }"
      dense
      square
    >
      <template #body-cell-product="props">
        <q-td :props="props">
          <div v-for="(txt, index) in props.value" :key="`pr-${index}`">
            {{txt}}
          </div>
        </q-td>
      </template>
      <template #top>
        <div class="text-h6 col-12">락커 그룹</div>
        <div class="col-12 row justify-between">
          <edit-template
            @add="onAdd"
            @edit="onEdit"
            @remove="onRemove"
            :disables="buttonDisables"
          />
          <!-- 검색 -->
          <div style="min-width: 150px;" class="q-ml-md">
            <q-input
              style="max-width:150px;"
              dense
              debounce="300"
              v-model="filter"
              placeholder="검색"
              flat
              square
              hide-bottom-space
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </template>
      <template #pagination />
      <template #bottom="{pagesNumber}">
        <div class="row col-12" style="display: grid;">
          <q-pagination
            v-model="pagination.page"
            class="justify-center"
            :max="pagesNumber"
            :input="true"
            :boundary-links="false"
          />
        </div>
      </template>
    </q-table>
    <locker-group-setting-popup ref="regPopup" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// Popup
import LockerGroupSettingPopup from './popup/LockerGroupSettingPopup'
import EditTemplate from 'src/components/template/EditTemplate'
// Mixin
import TableMixin from 'src/mixins/tableMixin'
export default {
  name: 'LockerGroupTemplate',
  components: {
    LockerGroupSettingPopup,
    EditTemplate
  },
  mixins: [TableMixin],
  mounted () {
    this.reqGetDefineDataList({ type: 'lockergroup' })
  },
  data () {
    return {
      rowsSelected: [],
      columns: [
        { name: 'name', align: 'left', label: '락커그룹 명', field: 'name', sortable: true },
        { name: 'cnt', align: 'left', label: '락커 수', field: 'cnt', sortable: true },
        { name: 'defPrice', align: 'right', label: '개월당 가격', field: 'defPrice', sortable: true, format: (val) => `${val.toLocaleString()}원` },
        {
          name: 'product',
          align: 'left',
          label: '상세',
          field: 'product',
          format: (val) => {
            let productList = []
            _.forEach(val, o => {
              let str = `${o.month}개월, ${o.price.toLocaleString()}원`
              // 할인
              if (o.discount > 0) {
                const total = o.price + o.discount
                const percent = 100 - (o.price / total) * 100
                str += `[할인: ${o.discount.toLocaleString()} (${percent.toPrecision(2)}%)]`
              }
              productList.push(str)
            })
            return productList
          }
        },
        {
          name: 'refundPrice',
          align: 'right',
          label: '1일 환불 가격',
          field: 'refundPrice',
          format: (val) => {
            if (!val) return '0원'
            return `${val.toLocaleString()}원`
          }
        },
        {
          name: 'dalayCnt',
          align: 'right',
          label: '연장',
          field: 'delayCnt',
          format: (val, row) => {
            const cnt = val || 0
            const days = row.delayDay || 0
            return `${cnt}회, ${days}일`
          }
        },
        {
          name: 'pauseCnt',
          align: 'right',
          label: '일시정지',
          field: 'pauseCnt',
          format: (val, row) => {
            const cnt = val || 0
            const days = row.pauseDay || 0
            return `${cnt}회, ${days}일`
          }
        },
        { name: 'desc', align: 'left', label: '설명', field: 'desc', sortable: true }
      ]
    }
  },
  computed: {
    ...mapState('defineDatas', [
      'lockerGroupDataList'
    ]),
    buttonDisables () {
      const selectedSize = _.size(this.rowsSelected)
      if (selectedSize === 0) return ['remove', 'edit']
      if (selectedSize === 1) return []
      if (selectedSize > 1) return ['edit']
      return []
    }
  },
  methods: {
    ...mapActions('defineDatas', [
      'reqGetDefineDataList',
      'reqRemoveDefineData'
    ]),
    onAdd () {
      this.$refs.regPopup.show()
    },
    onEdit () {
      this.$refs.regPopup.show(this.rowsSelected[0])
    },
    async onRemove () {
      try {
        let reqQuery = { type: 'lockergroup' }
        if (_.size(this.rowsSelected) === 1) {
          reqQuery._id = _.get(this.rowsSelected, [0, '_id'], void 0)
        } else {
          reqQuery.ids = _.map(this.rowsSelected, o => {
            return o._id
          })
        }
        const { code } = await this.reqRemoveDefineData(reqQuery)
        if (code === 'ok') {
          this.rowsSelected = []
        }
      } catch (e) {
        this.$notify.error(e)
      }
    }
  },
  watch: {
    rowsSelected (newVal) {
      this.$emit('selected', _.cloneDeep(newVal))
    }
  }
}
</script>
