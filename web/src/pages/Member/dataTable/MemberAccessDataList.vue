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
        <!-- 년도 정보 -->
        <q-select
          v-model="logYearVal"
          dense
          emit-value
          map-options
          :options="logYearList"
          :option-value="'year'"
          :option-label="'year'"
          @input="onChangeYear"
          style="width:75px; float: right;"
        />
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
        <!-- 검색: 추후 Server-Side 페이지네이션에 필터가 필요할때에 구현-->
        <!-- <q-input
        style="max-width:160px; float: right;"
        dense
        debounce="300"
        v-model="filters"
        placeholder="검색"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input> -->
      </div>
    </div>
    <q-table
      :grid="isCard"
      :data="memberAccessDataList"
      :columns="columns"
      :pagination="pagination"
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
      hide-pagination
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
      <template #bottom="{}">
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
              @input="onChangeOffset"
              style="width: 80px"
              dense
            />
            <q-pagination
              v-model="pagination.page"
              :max="pagesNumber"
              :input="true"
              @input="onChangePage"
            />
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// Mixin
import TableMixin from 'src/mixins/tableMixin'

export default {
  name: 'MemberAccessDataList',
  mixins: [TableMixin],
  props: {
    mini: {
      type: Boolean,
      default: false
    }
  },
  async mounted () {
    // 년도별 정보 목록 요청
    await this.reqGetPartitionLogDataList({ type: 'memberaccess' })
    // 출입 현황 요청
    await this.reqGetMemberAccessDataList({
      page: this.pagination.page,
      offset: this.pagination.rowsPerPage,
      year: this.logYearVal
    })
  },
  data () {
    return {
      filters: '',
      isCard: false,
      visibleColumns: [
        'create_d', 'name', 'ticketName', 'type'
      ],
      columns: [
        {
          name: 'create_d',
          align: 'left',
          label: '입장일자',
          field: 'create_d',
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
        { name: 'ticketName', align: 'left', label: '상품명', field: 'ticketName' },
        {
          name: 'type',
          align: 'left',
          label: '입장 유형',
          field: 'type',
          format: (val) => {
            if (val === 'membership') return '회원권'
            if (val === 'lesson') return '수강권'
            return ''
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('memberAccess', [
      'memberAccessDataList',
      'listCnt'
    ]),
    ...mapState('partitionLog', [
      'logYear',
      'logYearList'
    ]),
    logYearVal: {
      get () {
        return this.logYear
      },
      set (val) {
        this.setLogYear(val)
      }
    },
    pagesNumber () {
      return Math.ceil(this.listCnt / this.pagination.rowsPerPage)
    }
  },
  methods: {
    ...mapActions('memberAccess', [
      'reqGetMemberAccessDataList' // 출입 현황 요청
    ]),
    ...mapActions('partitionLog', [
      'reqGetPartitionLogDataList' // 년도별 로그 목록 요청
    ]),
    ...mapMutations('partitionLog', [
      'setLogYear'
    ]),
    // 출입 현황 항목에 대한 요청
    onChangeYear (year) { this.getDataList({ year }) },
    onChangePage (page) { this.getDataList({ page }) },
    onChangeOffset (offset) { this.getDataList({ offset }) },
    async getDataList ({
      year = this.logYearVal,
      page = this.pagination.page,
      offset = this.pagination.rowsPerPage
    } = {}) {
      await this.reqGetMemberAccessDataList({ page, offset, year })
    }
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
