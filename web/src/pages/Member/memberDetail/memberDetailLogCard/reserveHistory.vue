/*
  예약 현황 페이지
 */
<template>
  <div>
    <q-table
      :data="reserveScheduleDataList"
      :columns="columns"
      :pagination.sync="pagination"
      :filter="filter"
      row-key="_id"
      separator="cell"
      no-data-label="데이터를 찾지 못하였습니다."
      no-results-label="검색된 결과가 없습니다."
      dense
      flat
    >
      <template #body-cell-sName="props">
        <q-td :props="props">
          <div class="text-blue-9 textlink" @click.stop="onClickDetailStaff(props.row.staffid)"> {{props.value}} ({{props.row.sSpecial_n}}) </div>
        </q-td>
      </template>
      <template #top>
          <div class="col-12 row justify-between">
            <div />
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
// 상태 관리용 스토어 등록
import { mapState, mapActions } from 'vuex'

// 컴포넌트
import TableMixin from 'src/mixins/tableMixin'

export default {
  name: 'reserveHistory',
  mixins: [TableMixin],
  components: {
  },
  data () {
    return {
      // 검색 구분
      filter: '',
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
          sortable: true,
          format: (val, row) => {
            return `${val} (${row.mSpecial_n})`
          }
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
    ...mapState('member', [
      'memberData'
    ])
  },
  async mounted () {
    // 회원권 항목
    await this.reqGetReserveScheduleDataList({ memberid: this.memberData._id })
  },
  methods: {
    ...mapActions('reserveSchedule', [
      'reqGetReserveScheduleDataList' // 모든 예약 현황 리스트 가져오기 요청
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
