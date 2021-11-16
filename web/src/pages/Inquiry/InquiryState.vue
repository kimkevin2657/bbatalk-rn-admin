<template>
  <div>
    <top>
      <template #body>
        <q-btn
          label="문의 등록"
          @click="onClickInquirySurveyBtn"
          style="margin-right: 10px;"
          dense
          flat
        />
        <div style="border-right: 1px solid #ccc2c2;; width: 5px; height: 15px; margin-right: 10px;" />
      </template>
    </top>
    <div class="q-pa-md">
      <!-- 서브 타이틀 -->
      <div class="row justify-between">
        <div class="col-4 text-h6"> </div>
        <q-page-sticky
          position="top-right"
          :offset="[13, 13]"
        >
          <div class="col-3 q-gutter-sm">
          </div>
        </q-page-sticky>
      </div>
      <!-- 검색 조건 그리드  -->
      <div>
        <div
          class="row form-row condition-box"
          style="padding: 10px 5px 0px 5px"
        >
          <!-- 검색 -->
          <div
            class="col"
            style="min-width: 200px;"
          >
            <q-input
              style="max-width:300px; float: right;"
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
        </div>
      </div>
      <!---그리드 끝 --->
      <q-table
        :data="inquiryDataList"
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
          $refs.inquiryRegistPopup.show(row)
          rowsSelected = [row]
        }"
        dense
        bordered
      >
        <!-- 문의 회원 명 Custom -->
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div style="display:grid; grid-template-columns: min-content auto;">
              <q-avatar
                size="44px"
                style="margin-right: 2px;"
                :icon="props.row.photo === null ? getFace(props.row.gender) : void 0"
                :text-color="props.row.photo === null ? getFaceColor(props.row.gender) : void 0"
              >
                <img
                  v-if="props.row.photo"
                  :src="props.row.photo"
                />
              </q-avatar>
              <div>
                <div> {{props.value}} </div>
                <span>
                  <q-icon
                    v-if="props.row.photo !== null"
                    :name="getFace(props.row.gender)"
                    :color="getFaceColor(props.row.gender)"
                  />
                </span>
              </div>
            </div>
          </q-td>
        </template>
        <!-- 페이지네이션 -->
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
                :label="'회원 수'"
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

      <!-- 문의 등록 -->
      <inquiry-survey-popup
        ref="inquirySurveyPopup"
        @complete="reqGetInquiryDataList()"
      />
    </div>
  </div>
</template>

<script>
// 상태 관리용 스토어 등록
import { mapState, mapActions, mapGetters } from 'vuex'

// 팝업
import InquirySurveyPopup from './popup/InquirySurveyPopup'

// 컴포넌트
import Top from '../../layouts/component/Top'
import TableMixin from '../../mixins/tableMixin'
export default {
  name: 'InquiryState',
  mixins: [TableMixin],
  components: {
    Top,
    InquirySurveyPopup
  },
  data () {
    return {
      // 검색 구분
      address: '',
      centerList: '',
      cannotSelectInquiry: false,
      lessonType: '',
      searchLessonTypeOpts: [''],
      lesson: '',
      lessonOpts: [],
      managerOpts: [''],
      pagination: {
        rowsPerPage: 30 // current rows per page being displayed
      },
      startDate: '2019/02/01',
      endDate: '2019/10/10',
      filter: '',
      current: 1,
      registMultiple: [],
      registOpts: ['정회원(플레티넘)', '정회원(노플레스)', 'WSC(유소년)', '비회원'],
      pathOpts: ['모두', '법인', '가족', '단체', '입주민'],
      path: '',
      columns: [
        { name: 'address', align: 'center', label: '지역명(동/리)', field: 'address' },
        {
          name: 'name',
          align: 'center',
          label: '문의 고객명',
          field: 'name',
          format: (val, row) => {
            let name = val
            if (row.engName) name += ` (${row.engName})`
            return name
          }
        },
        { name: 'phone', align: 'center', label: '연락처', field: 'phone' },
        { name: 'membershipOpt', align: 'center', label: '관심 회원권', field: 'membershipOpt' },
        { name: 'lessonTypeOpt', align: 'center', label: '관심 강습권', field: 'lessonTypeOpt' },
        { name: 'marketingPathOpt', align: 'center', label: '마케팅 경로', field: 'marketingPathOpt' },
        {
          name: 'regDate',
          align: 'center',
          label: '등록일자',
          field: 'regDate',
          format: (val) => this.$moment(val).format('YYYY-MM-DD')
        }
      ]
    }
  },
  computed: {
    ...mapState('inquiry', [
      'inquiryDataList'
    ]),
    ...mapState('defineDatas', [
      'inquiryDefineDataList'
    ]),
    ...mapGetters('defineDatas', [
      'marketingPathOpts',
      'membershipOpts',
      'lessonTypeOpts'
    ]),
    searchInquiryTypeOpts () {
      var opts = ['모두']
      _.forEach(this.inquiryTypeDefineDataList, (option) => {
        opts.push(option.name)
      })
      return opts
    }
  },
  methods: {
    ...mapActions('inquiry', [
      'reqGetInquiryDataList', // 모든 회원 리스트 가져오기 요청
      'reqRemoveInquiry'
    ]),
    ...mapActions('defineDatas', [
      'reqGetDefineDataList'
    ]),
    onClickInquirySurveyBtn () {
      this.$refs.inquirySurveyPopup.show()
    },
    showRegPopup (rowData) {
      this.$refs.inquirySurveyPopup.show(rowData)
    },
    getFace (gender) {
      if (gender === 'woman') return 'mdi-face-woman'
      return 'mdi-face'
    },
    getFaceColor (gender) {
      if (gender === 'man') return 'primary'
      if (gender === 'woman') return 'negative'
      return 'black'
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
