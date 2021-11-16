<template>
  <div>
    <top />
    <div class="q-pa-md">
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
          v-model="filter"
          placeholder="검색"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-table
        :grid="isCard"
        :data="reserveScheduleDataList"
        :columns="columns"
        :pagination.sync="pagination"
        :selected.sync="rowsSelected"
        :filter="filter"
        :visible-columns="visibleColumns"
        row-key="_id"
        separator="cell"
        selection="multiple"
        no-data-label="데이터를 찾지 못하였습니다."
        no-results-label="검색된 결과가 없습니다."
        @row-click="(evt, row) => onMultiRowClick(evt, row)"
        @row-dblclick="(evt, row) => {
          $refs.memberRegistPopup.show(row)
          rowsSelected = [row]
        }"
        dense
        bordered
      >
        <template #body-cell-mName="props">
          <q-td :props="props">
            <div
              class="text-blue-9 textlink"
              @click.stop="onClickDetailMember(props.row.memberid)"
            > {{props.value}} ({{props.row.mSpecial_n}}) </div>
          </q-td>
        </template>
        <template #body-cell-sName="props">
          <q-td :props="props">
            <div
              class="text-blue-9 textlink"
              @click.stop="onClickDetailStaff(props.row.staffid)"
            > {{props.value}} ({{props.row.sSpecial_n}}) </div>
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
                style="width: 75px"
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// component
import Top from 'src/layouts/component/Top'
// mixin
import TableMixin from 'src/mixins/tableMixin'
export default {
  name: 'ReserveSchedule',
  mixins: [TableMixin],
  components: {
    Top
  },
  async mounted () {
    await this.reqGetReserveScheduleDataList({ gymid: this.gymInfo.id })
  },
  data () {
    return {
      isCard: false,
      filter: '',
      visibleColumns: [
        'tName', 'stime', 'state', 'mName',
        'sName', 'totCnt', 'useCnt', 'register',
        'sdate', 'regDate', 'desc'
      ],
      columns: [
        { name: 'tName', align: 'left', label: '수강명', field: 'tName' },
        {
          name: 'stime',
          align: 'right',
          label: '수강 시간',
          field: 'stime',
          format: (val, row) => {
            const st = this.$moment(val)
            const et = this.$moment(row.etime)
            return `${st.format('YYYY-MM-DD [HH:mm')} ~ ${et.format('HH:mm]')}`
          }
        },
        {
          name: 'state',
          align: 'left',
          label: '수강 상태',
          field: 'state',
          format: (val) => {
            // 0: 결석, 1: 예약, 2: 출석, 3: 취소
            if (val === 0) return '결석'
            if (val === 1) return '예약'
            if (val === 2) return '출석'
            if (val === 3) return '취소'
            return ''
          }
        },
        {
          name: 'mName',
          align: 'left',
          label: '회원명',
          field: 'mName',
          sortable: true
        },
        {
          name: 'sName',
          align: 'left',
          label: '강사명',
          field: 'sName',
          sortable: true
        },
        { name: 'totCnt', align: 'right', label: '총 횟수', field: 'totCnt' },
        { name: 'useCnt', align: 'right', label: '사용 횟수', field: 'useCnt' },
        { name: 'register', align: 'left', label: '예약자', field: 'register', sortable: true },
        {
          name: 'sdate',
          align: 'right',
          label: '유효 기간',
          field: 'sdate',
          format: (val, row) => {
            const sd = this.$moment(val)
            const ed = this.$moment(row.edate)
            return `${sd.format('YYYY-MM-DD')} ~ ${ed.format('YYYY-MM-DD')}`
          }
        },
        {
          name: 'regDate',
          align: 'right',
          label: '등록 시간',
          field: 'regDate',
          sortable: true,
          format: (val, row) => {
            return this.$moment(val).format('YYYY-MM-DD HH:mm')
          }
        },
        {
          name: 'desc',
          align: 'left',
          label: '설명',
          field: 'desc',
          sortable: false
        }
      ]
    }
  },
  computed: {
    ...mapState('reserveSchedule', [
      'reserveScheduleDataList'
    ]),
    ...mapState('auth', [
      'gymInfo'
    ])
  },
  methods: {
    ...mapActions('reserveSchedule', [
      'reqGetReserveScheduleDataList'
    ]),
    ...mapActions('member', [
      'reqGetMemberData' // 회원 상세 정보 가져오기
    ]),
    ...mapActions('staff', [
      'reqGetStaffData'
    ]),
    // 회원 프로필 상세 페이지로 이동
    async onClickDetailMember (memberid) {
      // 회원 상세 정보 가져오기
      await this.reqGetMemberData({ _id: memberid })
      // 회원 상세 페이지로 이동
      this.$router.push('/manager/member/MemberDetail')
    },
    // 강사 프로필 상세 페이지로 이동
    async onClickDetailStaff (staffid) {
      // 강사 상세 정보 가져오기
      await this.reqGetStaffData({ _id: staffid })
      // 강사 상세 페이지로 이동
      this.$router.push('/manager/staff/StaffDetail')
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

.table-birthday {
  // font-size: 0.85em;
  // font-style: italic;
  max-width: 60px;
  white-space: normal;
  // color: #555;
  // margin-top: 4px;
}
.table-membership {
  // font-size: 0.85em;
  // font-style: italic;
  max-width: 160px;
  min-width: 150px;
  white-space: normal;
  // color: #555;
  // margin-top: 4px;
}
.table-lesson {
  // font-size: 0.85em;
  // font-style: italic;
  min-width: 150px;
  white-space: normal;
  // color: #555;
  // margin-top: 4px;
}

.form-date {
  min-width: 180px;
  max-width: 180px;
}

.form-row {
  background: rgba(255, 255, 255, 1);
  border: 1px;
  border-style: solid;
  border-color: rgba(122, 122, 124, 0.2);
  border-radius: 4px;
}
</style>
