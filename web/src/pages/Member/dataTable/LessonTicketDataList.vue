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
      :data="lessonDataList"
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
      $emit('updated', row)
      rowsSelected = [row]
    }"
      dense
      bordered
    >
      <!-- 유효 기간 -->
      <template #body-cell-sdate="props">
        <q-td :props="props">
          <div
            class="text-primary"
            style="text-decoration: underline;"
          >
            {{props.value}}
            <!-- 결재 유형이 결재, 양수 상태에서만 기간 변경 가능 -->
            <q-menu
              v-if="[1, 4].indexOf(props.row.pay_state) >= 0"
              touch-position
              square
              content-class="bg-grey-10 text-white"
            >
              <q-item
                clickable
                v-close-popup
                flat
                style="margin: 0;"
                @click="$emit('pause', props.row)"
              >
                <q-item-section class="q-mx-sm">
                  <span style="min-width: 75px">
                    <q-icon
                      name="mdi-pause"
                      class="q-mr-sm"
                    />일시정지
                  </span>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                flat
                style="margin: 0;"
                @click="$emit('delay', props.row)"
              >
                <q-item-section class="q-mx-sm">
                  <span style="min-width: 75px">
                    <q-icon
                      name="mdi-calendar-arrow-right"
                      class="q-mr-sm"
                    />기간연장
                  </span>
                </q-item-section>
              </q-item>
            </q-menu>
          </div>
        </q-td>
      </template>
      <!-- 일시정지 기간 -->
      <template #body-cell-delayTickets="props">
        <q-td :props="props">
          <div
            v-for="(txt, index) in props.value"
            :key='`d${index}`'
          >
            {{txt}}
          </div>
        </q-td>
      </template>
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
                @click="$emit('payment', props.row)"
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
                @click="$emit('transfer', props.row)"
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
                @click="$emit('refund', props.row)"
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
              :label="'수강권 수'"
              style="width: 90px"
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
import { mapState } from 'vuex'
import TableMixin from 'src/mixins/tableMixin'
export default {
  name: 'LessonTicketDataList',
  mixins: [TableMixin],
  props: {
  },
  data () {
    return {
      filters: '',
      isCard: false,
      visibleColumns: [
        'reg_d', 'name', 'session',
        'staffName', 'totCnt', 'useCnt',
        'sdate', 'delayTickets', 'pay_state', 'priceType',
        'pay_d', 'delayCnt', 'price', 'regType',
        'input_staff', 'consult_staff', 'regPath',
        'gifts', 'desc'
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
            let nameEtcArr = []
            if (row.engName) nameEtcArr.push(row.engName)
            if (row.special_n) nameEtcArr.push(row.special_n)
            return _.size(nameEtcArr) > 0 ? `${name} (${nameEtcArr.join(', ')})` : name
          }
        },
        { name: 'session', align: 'left', label: '수강권', field: 'session' },
        {
          name: 'staffName',
          align: 'left',
          label: '강사명',
          field: 'staffName',
          format: (val, row) => {
            let name = val
            let nameEtcArr = []
            if (row.staffEng) nameEtcArr.push(row.staffEng)
            if (row.staffSpecial_n) nameEtcArr.push(row.staffSpecial_n)
            return _.size(nameEtcArr) > 0 ? `${name} (${nameEtcArr.join(', ')})` : name
          }
        },
        { name: 'totCnt', align: 'right', label: '총 횟수', field: 'totCnt' },
        { name: 'useCnt', align: 'right', label: '사용 횟수', field: 'useCnt' },
        {
          name: 'sdate',
          align: 'left',
          label: '유효 기간',
          field: 'sdate',
          format: (val, row) => {
            if (this.$moment(val).format('YYYY') === this.$moment(row.edate).format('YYYY')) {
              return `${this.$moment(val).format('YYYY-MM-DD')} ~ ${this.$moment(row.edate).format('MM-DD')}`
            }
            return `${this.$moment(val).format('YYYY-MM-DD')} ~ ${this.$moment(row.edate).format('YYYY-MM-DD')}`
          }
        },
        {
          name: 'delayTickets',
          align: 'left',
          label: '일시정지 기간',
          field: 'delayTickets',
          format: (val) => {
            if (!val) return ''
            let dateArr = []
            _.forEach(val, o => {
              if (o.type !== 'pause') return
              if (this.$moment(o.pause_sdate).format('YYYY-MM-DD') === this.$moment(o.pause_edate).format('YYYY-MM-DD')) {
                dateArr.push(`${this.$moment(o.pause_sdate).format('YYYY-MM-DD')} (1일)`)
              } else if (this.$moment(o.pause_sdate).format('YYYY') === this.$moment(o.pause_edate).format('YYYY')) {
                const dayCnt = this.$moment(o.pause_edate).diff(o.pause_sdate, 'days') + 1
                dateArr.push(`${this.$moment(o.pause_sdate).format('YYYY-MM-DD')} ~ ${this.$moment(o.pause_edate).format('MM-DD')} (${dayCnt}일)`)
              } else {
                const dayCnt = this.$moment(o.pause_edate).diff(o.pause_sdate, 'days') + 1
                dateArr.push(`${this.$moment(o.pause_sdate).format('YYYY-MM-DD')} ~ ${this.$moment(o.pause_edate).format('YYYY-MM-DD')} (${dayCnt}일)`)
              }
            })
            return dateArr
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
        { name: 'priceType', align: 'left', label: '결재유형', field: 'priceType' },
        {
          name: 'pay_d',
          align: 'left',
          label: '결재 일자',
          field: 'pay_d',
          format: (val) => {
            if (!val) return ''
            return this.$moment(val).format('YYYY-MM-DD HH:mm')
          }
        },
        {
          name: 'delayCnt',
          align: 'right',
          label: '기간변경(일시정지/연장)',
          field: 'delayCnt',
          format: (val, row) => {
            const delayCnt = val || 0
            const pauseCnt = _.get(row, 'pauseCnt', 0) === null ? 0 : _.get(row, 'pauseCnt', 0)
            return `${pauseCnt}회/${delayCnt}회`
          }
        },
        {
          name: 'price',
          align: 'right',
          label: '구매금',
          field: 'purchase',
          format: (val) => `${val.toLocaleString()}원`
        },
        { name: 'regType', align: 'left', label: '등록 구분', field: 'regType' },
        { name: 'input_staff', align: 'left', label: '입력자', field: 'input_staff' },
        { name: 'consult_staff', align: 'left', label: '상담자', field: 'consult_staff' },
        { name: 'regPath', align: 'left', label: '등록 경로', field: 'regPath' },
        { name: 'gifts', align: 'left', label: '증정품', field: 'gifts', format: (val) => val.join(', ') },
        // { name: 'phone', align: 'left', label: '연락처', field: 'phone' },
        { name: 'desc', align: 'left', label: '설명', field: 'desc' }
      ]
    }
  },
  computed: {
    ...mapState('ticket', [
      'lessonDataList'
    ])
  },
  methods: {
    init () {
      this.rowsSelected = []
    },
    // 결재 상태 색상
    parsePayStateColor (state) {
      if (state === 0) return 'text-grey'
      if (state === 1) return 'text-primary'
      if (state === 2) return 'text-deep-purple'
      if (state === 3) return 'text-negative'
      if (state === 4) return 'text-teal'
      return 'text-grey'
    }
  },
  watch: {
    rowsSelected (data) {
      this.$emit('selected', data)
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
