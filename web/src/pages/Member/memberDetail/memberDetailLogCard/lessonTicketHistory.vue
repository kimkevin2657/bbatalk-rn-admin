/*
  회원권 현황 페이지
 */
<template>
  <div>
    <q-table
      :data="lessonDataList"
      :columns="columns"
      :pagination.sync="pagination"
      :selected.sync="rowsSelected"
      :filter="filter"
      row-key="_id"
      separator="cell"
      selection="multiple"
      no-data-label="데이터를 찾지 못하였습니다."
      no-results-label="검색된 결과가 없습니다."
      @row-click="(evt, row) => onMultiRowClick(evt, row)"
      @row-dblclick="(evt, row) => {
        $refs.lessonRegistPopup.show({ticketInfo: row})
        rowsSelected = [row]
      }"
      dense
      flat
    >
      <template #top>
          <div class="col-12 row justify-between">
            <edit-template
              @edit="onEdit"
              @remove="onRemove"
              :visibles="['edit', 'remove']"
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
      <template #bottom="{pagesNumber}">
        <div class="row col-12" style="display: grid;">
          <div class="justify-center" style="display: grid; grid-template-columns: auto auto auto;">
            <q-select
              v-model="pagination.rowsPerPage"
              :options="[10, 20, 30, 40, 50]"
              :label="'수강권 수'"
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
    <!-- 수강권 등록 -->
    <lesson-regist-popup
      ref="lessonRegistPopup"
      @complete="reqGetMemberDataList()"
    />
  </div>
</template>

<script>
// 상태 관리용 스토어 등록
import { mapState, mapActions } from 'vuex'

// 컴포넌트
import TableMixin from '../../../../mixins/tableMixin'
import LessonRegistPopup from '../../popup/LessonRegistPopup'
import EditTemplate from '../../../../components/template/EditTemplate'
export default {
  name: 'LessonTicketHistory',
  mixins: [TableMixin],
  components: {
    LessonRegistPopup,
    EditTemplate
  },
  data () {
    return {
      // 검색 구분
      filter: '',
      columns: [
        {
          name: 'regDate',
          align: 'left',
          label: '등록일자',
          field: 'regDate',
          format: (val) => this.$moment(val).format('YYYY-MM-DD')
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
        { name: 'session', align: 'left', label: '수강권', field: 'session' },
        {
          name: 'sdate',
          align: 'left',
          label: '유효기간',
          field: 'sdate',
          format: (val, row) => {
            return `${this.$moment(val).format('YYYY-MM-DD')} ~ ${this.$moment(row.edate).format('YYYY-MM-DD')}`
          }
        },
        { name: 'phone', align: 'left', label: '연락처', field: 'phone' },
        { name: 'priceType', align: 'left', label: '결재유형', field: 'priceType' },
        {
          name: 'price',
          align: 'right',
          label: '구매금',
          field: 'purchase',
          format: (val) => `${val.toLocaleString()}원`
        },
        { name: 'input_staff', align: 'left', label: '입력자', field: 'input_staff' },
        { name: 'consult_staff', align: 'left', label: '상담자', field: 'consult_staff' },
        { name: 'gifts', align: 'left', label: '증정품', field: 'gifts', format: (val) => val.join(', ') },
        { name: 'desc', align: 'left', label: '설명', field: 'desc' }
      ]
    }
  },
  computed: {
    ...mapState('member', [
      'memberData'
    ]),
    ...mapState('ticket', [
      'lessonDataList'
    ]),
    buttonDisables () {
      const selectedSize = _.size(this.rowsSelected)
      if (selectedSize === 0) return ['remove', 'edit']
      if (selectedSize === 1) return []
      if (selectedSize > 1) return ['edit']
      return []
    }
  },
  async mounted () {
    // 회원권 항목
    await this.reqGetTicketDataList({ type: 'lesson', memberid: this.memberData._id })
  },
  methods: {
    ...mapActions('ticket', [
      'reqGetTicketDataList', // 모든 회원권 리스트 가져오기 요청
      'reqRemoveTicket'
    ]),
    onEdit () {
      this.$refs.lessonRegistPopup.show({ ticketInfo: this.rowsSelected[0] })
    },
    async onRemove () {
      try {
        let reqQuery = { type: 'lesson' }
        if (_.size(this.rowsSelected) === 1) {
          reqQuery._id = _.get(this.rowsSelected, [0, '_id'], void 0)
        } else {
          reqQuery.ids = _.map(this.rowsSelected, o => {
            return o._id
          })
        }
        const { code } = await this.reqRemoveTicket(reqQuery)
        if (code === 'ok') {
          this.rowsSelected = []
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    showRegPopup (rowData) {
      this.$refs.lessonRegistPopup.show({ ticketInfo: rowData })
    }
  }
}
</script>
