<template>
  <div>
    <top>
    </top>
    <q-scroll-area style="height: calc(100vh - 108px);">
      <div
        class="row q-col-gutter-sm q-mt-sm q-bm-sm"
        :class="$q.screen.lt.sm ? '' : 'q-mx-sm'"
      >
        <sales-range
          type="membership"
          class="col-12"
          @refresh="refresh"
        />
        <sales-table
          ref="salesTable"
          type="membership"
          class="col-12"
          :data-list="dataList"
          :columns="columns"
        />
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Top from 'src/layouts/component/Top'

import SalesRange from './Components/SalesRange'
import SalesTable from './Components/SalesTable'

export default {
  name: 'SalesMember',
  components: {
    Top,
    SalesRange,
    SalesTable
  },
  mounted () {
    // this.initStateData()
  },
  data () {
    return {
      dataList: [],
      columns: [
        {
          name: 'reg_d',
          align: 'left',
          label: '등록 일자',
          field: 'reg_d',
          format: (val) => {
            if (!val) return ''
            return this.$moment(val).format('YYYY-MM-DD HH:mm')
          }
        },
        {
          name: 'pay_state',
          align: 'left',
          label: '결재 구분',
          field: 'pay_state',
          format: (val) => {
            if (val === 0) return '미결재'
            if (val === 1) return '결재 완료'
            if (val === 2) return '양도'
            if (val === 3) return '환불'
            if (val === 4) return '양수'
            return '미결재'
          }
        },
        {
          name: 'name',
          align: 'left',
          label: '회원명',
          field: 'name',
          format: (val, row) => {
            let name = val
            let nameEtcArr = []
            if (row.engName) nameEtcArr.push(row.engName)
            if (row.special_n) nameEtcArr.push(row.special_n)
            return _.size(nameEtcArr) > 0 ? `${name} (${nameEtcArr.join(', ')})` : name
          }
        },
        { name: 'session', align: 'left', label: '회원권', field: 'session' },
        {
          name: 'purchase',
          align: 'right',
          label: '구매금',
          field: 'purchase',
          format: (val) => _.isNumber(val) ? `${val.toLocaleString()}원` : '-'
        },
        {
          name: 'priceType',
          align: 'left',
          label: '결재 방법',
          field: 'priceType'
        },
        {
          name: 'price',
          align: 'right',
          label: '원가',
          field: 'price',
          format: (val) => _.isNumber(val) ? `${val.toLocaleString()}원` : '-'
        },
        {
          name: 'discount',
          align: 'right',
          label: '할인',
          field: 'discount',
          format: (val) => _.isNumber(val) ? `${val.toLocaleString()}원` : '-'
        },
        {
          name: 'addDiscount',
          align: 'right',
          label: '추가 할인',
          field: 'addDiscount',
          format: (val) => _.isNumber(val) ? `${val.toLocaleString()}원` : '-'
        },
        {
          name: 'vat',
          align: 'right',
          label: '부가세',
          field: 'vat',
          format: (val) => _.isNumber(val) ? `${val.toLocaleString()}원` : '-'
        },
        {
          name: 'cash',
          align: 'right',
          label: '현금',
          field: 'cash',
          format: (val) => _.isNumber(val) ? `${val.toLocaleString()}원` : '-'
        },
        {
          name: 'card',
          align: 'right',
          label: '카드',
          field: 'card',
          format: (val) => _.isNumber(val) ? `${val.toLocaleString()}원` : '-'
        },
        {
          name: 'point',
          align: 'right',
          label: '포인트',
          field: 'point',
          format: (val) => _.isNumber(val) ? `${val.toLocaleString()}원` : '-'
        }
      ]
    }
  },
  computed: {

  },
  methods: {
    ...mapMutations('salesDetail', [
      'initStateData'
    ]),
    async refresh () {
      if (_.has(this, ['$refs', 'salesTable', 'refresh'])) {
        this.$refs.salesTable.refresh()
      }
    }
  }
}
</script>
