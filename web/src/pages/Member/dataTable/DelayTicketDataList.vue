<template>
  <div>
    <!-- 검색 조건 그리드  -->
    <div>
      <div
        class="row form-row condition-box"
        style="padding: 0px 5px 0px 0px"
      >
        <!-- 테이블 그리드 -->
        <q-btn
          :icon="isCard ? 'mdi-cards' : 'mdi-table-large'"
          size="xs"
          @click="isCard = !isCard"
          flat
        />
        <q-space />
        <!-- 컬럼 필드 -->
        <q-select
          v-model="visibleColumns"
          multiple
          dense
          :display-value="'사용 컬럼'"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          :style="this.$q.screen.lt.md ? '' : 'max-width: 120px;'"
          @input="setColumns"
        />
        <!-- 검색 -->
        <q-input
          style="max-width:160px; float: right;"
          dense
          debounce="300"
          v-model="filters"
          placeholder="검색"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <q-table
      :grid="isCard"
      :data="delayTicketDataList"
      :columns="columns"
      :pagination.sync="pagination"
      :selected.sync="rowsSelected"
      :filter="filters"
      :visible-columns="visibleColumns"
      row-key="_id"
      separator="cell"
      selection="multiple"
      no-data-label="데이터를 찾지 못하였습니다."
      no-results-label="검색된 결과가 없습니다."
      @row-click="(evt, row) => onMultiRowClick(evt, row)"
      @row-dblclick="(evt, row) => {
      rowsSelected = [row]
    }"
      dense
      bordered
      :flat="mini"
    >
      <!-- 결재 구분 -->
      <template #body-cell-pay_state="props">
        <q-td :props="props">
          <div
            :class="parsePayStateColor(props.row.pay_state)"
            style="text-decoration: underline;"
          >
            {{props.value}}
            <!-- 미결재, 결재 완료 상태에서만 변경 가능 -->
            <q-menu
              v-if="[0, 1].indexOf(props.row.pay_state) >= 0"
              touch-position
              square
              content-class="bg-grey-10 text-white"
            >
              <q-item
                v-if="props.row.pay_state === 0"
                clickable
                v-close-popup
                flat
                style="margin: 0;"
                @click="onPayment(props.row)"
              >
                <q-item-section class="q-mx-sm">
                  <span style="min-width: 75px">
                    <q-icon
                      name="mdi-cash"
                      class="q-mr-sm"
                    />결재 완료
                  </span>
                </q-item-section>
              </q-item>
              <q-item
                v-if="props.row.pay_state === 1"
                clickable
                v-close-popup
                flat
                style="margin: 0;"
                @click="onTransfer(props.row)"
              >
                <q-item-section class="q-mx-sm">
                  <span style="min-width: 60px">
                    <q-icon
                      name="mdi-swap-horizontal"
                      class="q-mr-sm"
                    />양도
                  </span>
                </q-item-section>
              </q-item>
              <q-item
                v-if="props.row.pay_state === 1"
                clickable
                v-close-popup
                flat
                style="margin: 0;"
                @click="onRefund(props.row)"
              >
                <q-item-section class="q-mx-sm">
                  <span style="min-width: 60px">
                    <q-icon
                      name="mdi-cash-refund"
                      class="q-mr-sm"
                    />환불
                  </span>
                </q-item-section>
              </q-item>
            </q-menu>
          </div>
        </q-td>
      </template>
      <template #bottom="{pagesNumber}">
        <div
          class="row col-12"
          style="display: grid;"
        >
          <div
            class="justify-center"
            style="display: grid; grid-template-columns: auto auto auto;"
          >
            <q-select
              v-model="pagination.rowsPerPage"
              :options="[10, 20, 30, 40, 50]"
              :label="'현황 수'"
              style="width: 80px"
              dense
            />
            <q-pagination
              v-model="pagination.page"
              :max="pagesNumber"
              :input="true"
            />
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// Mixin
import TableMixin from 'src/mixins/tableMixin'

export default {
  name: 'DelayTicketDataList',
  mixins: [TableMixin],
  props: {
    mini: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filters: '',
      isCard: false,
      visibleColumns: [
        'reg_d', 'name', 'staffName',
        'ticketName', 'type', 'd_type', 'before_sdate',
        'pause_sdate', 'after_sdate', 'cause'
      ],
      columns: [
        {
          name: 'reg_d',
          align: 'left',
          label: '등록일자',
          field: 'reg_d',
          format: (val) => this.$moment(val).format('YYYY-MM-DD HH:mm')
        },
        {
          name: 'name',
          align: 'left',
          label: '회원명',
          field: 'name',
          format: (val, row) => {
            let name = val
            if (row.engName) name += ` (${row.engName})`
            if (row.special_n) name += ` (${row.special_n})`
            return name
          }
        },
        {
          name: 'staffName',
          align: 'left',
          label: '강사명',
          field: 'staffName',
          format: (val, row) => {
            let name = val
            if (row.staffEng) name += ` (${row.staffEng})`
            if (row.staffSpecial_n) name += ` (${row.staffSpecial_n})`
            return name
          }
        },
        { name: 'ticketName', align: 'left', label: '상품명', field: 'ticketName' },
        {
          name: 'type',
          align: 'left',
          label: '변경 유형',
          field: 'type',
          format: (val) => {
            if (val === 'delay') return '기간연장'
            if (val === 'pause') return '일시정지'
            return ''
          }
        },
        {
          name: 'd_type',
          align: 'left',
          label: '상품 유형',
          field: 'd_type',
          format: (val) => {
            if (val === 'lesson') return '수강권'
            if (val === 'membership') return '회원권'
            return ''
          }
        },
        {
          name: 'before_sdate',
          align: 'left',
          label: '변경 전 기간',
          field: 'before_sdate',
          format: (val, row) => {
            const sdate = this.$moment(val)
            const edate = this.$moment(row.before_edate)
            return `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('YYYY-MM-DD')}`
          }
        },
        {
          name: 'pause_sdate',
          align: 'left',
          label: '정지 기간',
          field: 'pause_sdate',
          format: (val, row) => {
            if (!val) return ''
            const sdate = this.$moment(val)
            const edate = this.$moment(row.pause_edate)
            return `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('YYYY-MM-DD')}`
          }
        },
        {
          name: 'after_sdate',
          align: 'left',
          label: '변경 후 기간',
          field: 'after_sdate',
          format: (val, row) => {
            const sdate = this.$moment(val)
            const edate = this.$moment(row.after_edate)
            return `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('YYYY-MM-DD')}`
          }
        },
        { name: 'cause', align: 'left', label: '사유', field: 'cause' }
      ]
    }
  },
  computed: {
    ...mapState('delayTicket', [
      'delayTicketDataList'
    ])
  },
  methods: {
    ...mapActions('delayTicket', [
    ])
  }
}
</script>

<style lang="sass" scoped>
.row
  margin: 0px 0px 10px 0px
  padding: 0px 5px 0px 5px
</style>

<style scoped lang="scss">
.sub-title {
  display: grid;
  gap: 10px;
  width: 100%;
}
.condition-box {
  text-align: center;
  vertical-align: middle;
}

.form-row {
  background: rgba(255, 255, 255, 1);
  border: 1px;
  border-style: solid;
  border-color: rgba(122, 122, 124, 0.2);
  border-radius: 4px;
}
</style>
