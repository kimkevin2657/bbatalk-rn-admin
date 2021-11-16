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
          v-model="filter"
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
      :data="lockerGroupDataList"
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
              :label="'락커그룹 수'"
              style="width: 100px"
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
  name: 'LockerGroupDataList',
  mixins: [TableMixin],
  props: {
  },
  data () {
    return {
      filters: '',
      isCard: false,
      visibleColumns: [],
      columns: [
        {
          name: 'name',
          align: 'left',
          label: '그룹명',
          field: 'name'
        },
        { name: 'desc', align: 'left', label: '설명', field: 'desc' }
      ]
    }
  },
  computed: {
    ...mapState('lockerSettings', [
      'lockerGroupDataList'
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
