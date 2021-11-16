<template>
  <div>
    <q-table
      :data="lockerGroupData.product"
      :columns="columns"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :selected.sync="rowsSelected"
      style="height: 250px"
      row-key="id"
      selection="multiple"
      separator="cell"
      no-data-label="데이터를 찾지 못하였습니다."
      no-results-label="검색된 결과가 없습니다."
      @row-click="(evt, row) => onMultiRowClick(evt, row, 'id')"
      @row-dblclick="(evt, row) => {
        $refs.regPopup.show(row)
        rowsSelected = [row]
      }"
      virtual-scroll
      dense
      square
      class="q-py-sm"
    >
      <template #top>
        <edit-template
          @add="onAdd"
          @edit="onEdit"
          @remove="onRemove"
          :disables="buttonDisables"
          :flex="false"
        />
      </template>
      <template #pagination />
      <template #bottom="{pagesNumber}">
        <div class="row col-12" style="display: grid; height: 33px;">
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
    <locker-group-detail-popup ref="regPopup" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// Popup
import LockerGroupDetailPopup from './LockerGroupDetailPopup'
import EditTemplate from 'components/template/EditTemplate'
// Mixin
import TableMixin from 'src/mixins/tableMixin'
export default {
  name: 'LockerGroupDetailList',
  components: {
    LockerGroupDetailPopup,
    EditTemplate
  },
  mixins: [TableMixin],
  data () {
    return {
      rowsSelected: [],
      columns: [
        { name: 'month', align: 'right', label: '개월', field: 'month', sortable: true },
        {
          name: 'discount',
          align: 'right',
          label: '할인',
          field: 'discount',
          sortable: true,
          format: (val, row) => {
            const total = row.price + row.discount
            const percent = 100 - (row.price / total) * 100
            return `${val.toLocaleString()} (${percent.toPrecision(2)}%)`
          }
        },
        { name: 'price', align: 'right', label: '가격', field: 'price', sortable: true, format: (val) => val.toLocaleString() }
      ]
    }
  },
  computed: {
    ...mapState('defineDatas', [
      'lockerGroupData'
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
      if (_.size(this.rowsSelected) === 1) {
        const id = _.get(this.rowsSelected, [0, 'id'], void 0)
        const index = _.findIndex(this.lockerGroupData.product, o => {
          return o.id === id
        })
        this.lockerGroupData.product.splice(index, 1)
      } else {
        _.forEach(this.rowsSelected, o => {
          const index = _.findIndex(this.lockerGroupData.product, item => {
            return item.id === o.id
          })
          this.lockerGroupData.product.splice(index, 1)
        })
      }
      // this.$notify.error(e)
    }
  }
}
</script>
