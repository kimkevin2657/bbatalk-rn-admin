<template>
  <div>
    <q-card>
      <!-- 컬럼 -->
      <q-card-section
        class="q-px-md q-pt-sm"
        horizontal
      >
        <!-- 테이블 표현 형식 -->
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
          style="margin-right: 10px;"
          @input="setColumns"
        />
        <!-- 검색 -->
        <!-- <q-input
          style="max-width:160px; float: right;"
          dense
          debounce="300"
          v-model="filter"
          placeholder="검색"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input> -->
      </q-card-section>
      <q-card-section>
        <q-table
          :grid="isCard"
          :data="dataList"
          :columns="columns"
          :pagination="pagination"
          :selected.sync="rowsSelected"
          :filter="filter"
          :visible-columns="visibleColumns"
          :loading="isLoading"
          row-key="_id"
          separator="cell"
          no-data-label="데이터를 찾지 못하였습니다."
          no-results-label="검색된 결과가 없습니다."
          dense
          flat
        >
          <!-- 이름 템플릿 -->
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <!-- 회원명 -->
              <div
                class="text-blue-9 textlink"
                @click.stop="onClickDetailMember(props.row.memberid)"
              > {{props.value}}</div>
            </q-td>
          </template>
          <!-- 티켓 템플릿 -->
          <template v-slot:body-cell-session="props">
            <q-td :props="props">
              <!-- 티켓명 -->
              <div
                class="text-blue-9 textlink"
                @click.stop="onClickEditTicket(props.row)"
              > {{props.value}}</div>
            </q-td>
          </template>
          <!-- 페이징 처리 -->
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
                  :options="[5, 10, 20, 30, 40, 50]"
                  :label="'검색 수'"
                  @input="onChangeOffset"
                  style="width: 90px"
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
      </q-card-section>
    </q-card>
    <!-- 수강권 등록 -->
    <lesson-regist-popup
      ref="lessonRegistPopup"
      @complete="refresh()"
    />
    <!-- 회원권 등록 -->
    <membership-regist-popup
      ref="membershipRegistPopup"
      @complete="refresh()"
    />
  </div>
</template>

<script>
import LessonRegistPopup from 'src/pages/Member/popup/LessonRegistPopup'
import MembershipRegistPopup from 'src/pages/Member/popup/MembershipRegistPopup'
import { mapState, mapActions } from 'vuex'
import TableMixin from 'src/mixins/tableMixin'
export default {
  name: 'SalesTable',
  components: {
    LessonRegistPopup,
    MembershipRegistPopup
  },
  mixins: [TableMixin],
  props: {
    type: {
      type: String,
      default: 'membership'
    },
    columns: {
      type: Array,
      default () { return [] }
    }
  },
  async mounted () {
    await this.refresh()
  },
  data () {
    return {
      isCard: false,
      visibleColumns: [],
      isLoading: false
    }
  },
  computed: {
    ...mapState('salesDetail', [
      'membershipDataList',
      'lessonDataList',
      'listCnt'
    ]),
    dataList () {
      return this.type === 'membership' ? this.membershipDataList : this.lessonDataList
    },
    pagesNumber () {
      return Math.ceil(this.listCnt / this.pagination.rowsPerPage)
    }
  },
  methods: {
    ...mapActions('salesDetail', [
      'reqGetMembershipData',
      'reqGetLessonData'
    ]),
    ...mapActions('member', [
      'reqGetMemberData' // 회원 상세 정보 가져오기
    ]),
    async onChangePage (page) {
      await this.refresh({ page })
    },
    async onChangeOffset (offset) {
      await this.refresh({ offset })
    },
    async refresh ({
      page = this.pagination.page,
      offset = this.pagination.rowsPerPage
    } = {}) {
      this.isLoading = true
      if (this.type === 'membership') {
        await this.reqGetMembershipData({ page, offset })
      } else {
        await this.reqGetLessonData({ page, offset })
      }
      await this.$sleep(1000)
      this.isLoading = false
    },
    // 회원 프로필 상세 페이지로 이동
    async onClickDetailMember (memberid) {
      // 회원 상세 정보 가져오기
      await this.reqGetMemberData({ _id: memberid })
      // 회원 상세 페이지로 이동
      this.$router.push('/manager/member/MemberDetail')
    },
    async onClickEditTicket (ticketInfo) {
      if (this.type === 'membership') {
        this.$refs.membershipRegistPopup.show({ ticketInfo })
      } else if (this.type === 'lesson') {
        this.$refs.lessonRegistPopup.show({ ticketInfo })
      }
    }
  }
}
</script>
