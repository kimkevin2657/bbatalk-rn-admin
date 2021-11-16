<template>
  <div>
    <top>
      <template v-slot:body>
        <!-- 헤더 사이드 추가/수정/삭제 Template -->
        <header-edit-template
          @add="onAdd"
          @edit="onEdit"
          @remove="onRemove(onRemove)"
          :disables="buttonDisables"
        />
      </template>
    </top>
    <div class="q-pa-md">
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
          <!-- 활동 구분 -->
          <!-- <q-select
            class="col-md-2 col-sm-6"
            dense
            v-model="active"
            label="활동 구분"
            :options="activeOpts"
          />
          <q-select
            class="col-md-2 col-sm-6"
            dense
            v-model="team"
            label="부서 선택"
            :options="teamOpts"
          /> -->
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
      </div>
      <!---그리드 끝 --->
      <q-table
        :grid="isCard"
        :data="staffDataList"
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
          $refs.staffRegistPopup.show(row)
          rowsSelected = [row]
        }"
        dense
        bordered
      >
        <!-- 강사 명 Custom -->
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <q-item dense>
              <q-item-section avatar>
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
              </q-item-section>
              <q-item-section>
                <!-- 강사명 -->
                <div
                  class="text-blue-9 textlink"
                  @click.stop="onClickDetailStaff(props.row._id)"
                > {{props.value}} </div>
                <span>
                  <q-icon
                    v-if="props.row.photo !== null"
                    :name="getFace(props.row.gender)"
                    :color="getFaceColor(props.row.gender)"
                  />
                  {{props.row.special_n}}
                </span>
              </q-item-section>
            </q-item>
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
                :label="'강사 수'"
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
      <!-- 팝업 -->
      <staff-regist-popup ref="staffRegistPopup" />
    </div>
  </div>
</template>

<script>
// 상태 관리용 스토어 등록
import { mapState, mapActions } from 'vuex'

// 컴포넌트
import Top from '../../layouts/component/Top'
import HeaderEditTemplate from '../../layouts/template/HeaderEditTemplate'

// Popup
import StaffRegistPopup from './StaffRegistPopup'

// Mixin
import TableMixin from 'src/mixins/tableMixin'
import MsgMixin from 'src/mixins/msgMixin'

export default {
  name: 'StaffState',
  components: {
    Top,
    HeaderEditTemplate,
    StaffRegistPopup
  },
  mixins: [TableMixin, MsgMixin],
  data () {
    return {
      isCard: false,
      visibleColumns: [
        'name', 'team', 'level', 'phone', 'regDate'
      ],
      rowsSelected: [],
      pagination: {
        rowsPerPage: 30 // current rows per page being displayed
      },
      filter: '',
      current: 1,
      registMultiple: [],
      activeOpts: ['모두', '활동중 강사', '미활동 강사', '퇴사한 강사'],
      teamOpts: ['PT&PL', '스쿼시', '수영', '골프', '리인벤트', '기타'],
      active: '모두',
      team: '모두',
      columns: [
        {
          name: 'name',
          align: 'left',
          label: '이름',
          field: 'name',
          format: (val, row) => {
            let name = val
            if (row.engName) name += ` (${row.engName})`
            return name
          },
          sortable: true
        },
        { name: 'team', align: 'left', label: '소속 부서', field: 'team', sortable: true },
        { name: 'level', align: 'left', label: '직급', field: 'level', sortable: true },
        { name: 'phone', align: 'center', label: '휴대전화', field: 'phone', sortable: true },
        {
          name: 'regDate',
          align: 'center',
          label: '등록일자',
          field: 'regDate',
          format: (val) => this.$moment(val).format('YYYY-MM-DD'),
          sortable: true
        }
      ]
    }
  },
  computed: {
    ...mapState('staff', [
      'staffDataList'
    ]),
    ...mapState('auth', [
      'gymInfo'
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
    await this.reqGetStaffDataList({
      gymid: this.gymInfo.id
    })
  },
  methods: {
    ...mapActions('staff', [
      'reqGetStaffDataList', // 모든 강사 리스트 가져오기 요청
      'reqGetStaffData',  // 상세 강사 정보 가져오기
      'reqRemoveStaff'
    ]),
    onAdd () {
      this.$refs.staffRegistPopup.show()
    },
    onEdit () {
      this.$refs.staffRegistPopup.show(this.rowsSelected[0])
    },
    showRegPopup (rowData) {
      this.$refs.staffRegistPopup.show(rowData)
    },
    async removeStaff () {
      try {
        let reqQuery = {}
        if (_.size(this.rowsSelected) === 1) {
          reqQuery._id = _.get(this.rowsSelected, [0, '_id'], void 0)
        } else {
          reqQuery.ids = _.map(this.rowsSelected, o => {
            return o._id
          })
        }
        const { code } = await this.reqRemoveStaff(reqQuery)
        if (code === 'ok') {
          this.rowsSelected = []
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    // 강사 프로필 상세 페이지로 이동
    async onClickDetailStaff (staffid) {
      // 강사 상세 정보 가져오기
      await this.reqGetStaffData({ _id: staffid })
      // 강사 상세 페이지로 이동
      this.$router.push('/manager/staff/StaffDetail')
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

.form-row {
  background: rgba(255, 255, 255, 1);
  border: 1px;
  border-style: solid;
  border-color: rgba(122, 122, 124, 0.2);
  border-radius: 4px;
}
</style>
