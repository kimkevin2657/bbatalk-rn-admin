<template>
  <div>
    <top v-if="mode === 'main'">
      <template v-slot:body>
        <q-btn
          label="글쓰기"
          color="blue-grey-8"
          @click="onClickRegisterNotice"
        />
      </template>
    </top>
    <div :class="$q.screen.gt.md ? 'q-pa-md' : ''">
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
        :data="operationNoticeDataList"
        :columns="columns"
        :pagination.sync="pagination"
        :filter="filter"
        :visible-columns="visibleColumns"
        row-key="_id"
        separator="cell"
        no-data-label="데이터를 찾지 못하였습니다."
        no-results-label="검색된 결과가 없습니다."
        dense
        bordered
      >
        <template #body-cell-title="props">
          <q-td :props="props">
            <div
              class="textlink"
              @click.stop="onClickDetailNotice(props.row.num)"
            > {{props.value}}</div>
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
                :label="'게시글 수'"
                style="width: 85px"
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
  name: 'OperationNotice',
  mixins: [TableMixin],
  components: {
    Top
  },
  async mounted () {
    await this.reqGetOperationNoticeDataList({ gymid: this.gymInfo.id })
  },
  props: {
    mode: {
      type: String,
      default: 'main'
    }
  },
  data () {
    return {
      isCard: false,
      filter: '',
      visibleColumns: [
        'num', 'title', 'create_d', 'see', 'name'
      ],
      columns: [
        { name: 'num', align: 'right', label: '번호', field: 'num' },
        { name: 'title', align: 'left', label: '제목', field: 'title' },
        { name: 'name', align: 'left', label: '글쓴이', field: 'name' },
        {
          name: 'create_d',
          align: 'right',
          label: '작성 시간',
          field: 'create_d',
          sortable: false,
          format: (val, row) => {
            return this.$moment(val).format('YYYY-MM-DD HH:mm')
          }
        },
        {
          name: 'see',
          align: 'right',
          label: '조회',
          field: 'see',
          sortable: false
        }
      ]
    }
  },
  computed: {
    ...mapState('operationNotice', [
      'operationNoticeDataList'
    ]),
    ...mapState('auth', [
      'gymInfo'
    ])
  },
  methods: {
    ...mapActions('operationNotice', [
      'reqGetOperationNoticeDataList',
      'reqGetOperationNoticeData'
    ]),
    // 공지 현황 등록 페이지 이동
    async onClickRegisterNotice () {
      this.$router.push('/manager/operation/OperationNotice/Editor')
    },
    // 공지 현황 상세 페이지로 이동
    async onClickDetailNotice (num) {
      // 공지 현황 상세 페이지로 이동
      if (this.mode === 'main') {
        this.$router.push(`/manager/operation/OperationNotice/Detail?num=${num}`)
      } else {
        this.$emit('move', num)
        this.$router.push(`/manager/operation/OperationNotice/Detail?num=${num}`)
        // await this.reqGetOperationNoticeData({ num: Number(num) })
        await this.reqGetOperationNoticeDataList({ gymid: this.gymInfo.id })
      }
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
</style>
