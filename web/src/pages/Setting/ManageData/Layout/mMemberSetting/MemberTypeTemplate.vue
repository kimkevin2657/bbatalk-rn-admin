<template>
  <div>
    <q-table
      :data="memberTypeDefineDataList"
      :columns="columns"
      :pagination.sync="pagination"
      :selected.sync="rowsSelected"
      row-key="_id"
      selection="multiple"
      separator="vertical"
      no-data-label="데이터를 찾지 못하였습니다. (정회원, 비회원, 유소년 등을 추가하세요.)"
      no-results-label="검색된 결과가 없습니다."
      @row-click="(evt, row) => onMultiRowClick(evt, row)"
      dense
      square
    >
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          @mouseover="mouseoverRow = props.rows"
          @dblclick="$refs.regPopup.show(props.row); rowsSelected = [props.row]"
        >
          {{props.value}}
          <q-tooltip v-if="props.value">
            {{props.value}}
          </q-tooltip>
        </q-td>
      </template>
      <template #top>
        <div class="text-h6 col-12">
          회원 구분
          <q-icon name="mdi-information" color="primary">
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
              정회원, 비회원, 유소년 등을 추가하세요.
            </q-tooltip>
          </q-icon>
        </div>
        <div class="col-12 row justify-between">
          <edit-template
            @add="onAdd"
            @edit="onEdit"
            @remove="onRemove"
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
      <template #pagination />
      <template #bottom="{pagesNumber}">
        <div class="row col-12" style="display: grid;">
          <q-pagination
            v-model="pagination.page"
            class="justify-center"
            :max="pagesNumber"
            :input="true"
            :boundary-links="false"
          />
        </div>
      </template>
    </q-table>
    <member-type-popup ref="regPopup" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// Popup
import MemberTypePopup from './popup/MemberTypePopup'
import EditTemplate from '../../../../../components/template/EditTemplate'
// Mixin
import TableMixin from '../../../../../mixins/tableMixin'
export default {
  name: 'MemberTypeTemplate',
  components: {
    MemberTypePopup,
    EditTemplate
  },
  mixins: [TableMixin],
  mounted () {
    this.reqGetDefineDataList({
      gymid: this.gymInfo.id,
      type: 'membertype'
    })
    this.pagination.rowsPerPage = 10 // 한 페이지에서 보여줄 row수
  },
  data () {
    return {
      rowsSelected: [],
      filter: '',
      columns: [
        { name: 'name', align: 'left', label: '회원 구분 명', field: 'name', sortable: true },
        { name: 'desc', align: 'left', label: '설명', field: 'desc', sortable: true }
      ]
    }
  },
  computed: {
    ...mapState('defineDatas', [
      'memberTypeDefineDataList'
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
  methods: {
    ...mapActions('defineDatas', [
      'reqGetDefineDataList',
      'reqRemoveDefineData'
    ]),
    onAdd () {
      this.$refs.regPopup.show()
    },
    onEdit () {
      this.$refs.regPopup.show(this.rowsSelected[0])
    },
    async onRemove () {
      let reqQuery = { type: 'membertype' }
      if (_.size(this.rowsSelected) === 1) {
        reqQuery._id = _.get(this.rowsSelected, [0, '_id'], void 0)
      } else {
        reqQuery.ids = _.map(this.rowsSelected, o => {
          return o._id
        })
      }
      await this.reqRemoveDefineData(reqQuery)
      this.rowsSelected = []
      this.$loader.hide()
    }
  },
  watch: {
    rowsSelected (newVal) {
      this.$emit('selected', _.cloneDeep(newVal))
    }
  }
}
</script>
