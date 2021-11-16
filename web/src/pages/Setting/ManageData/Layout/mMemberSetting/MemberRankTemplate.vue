<template>
  <div>
    <q-table
      :data="memberRankDefineDataList"
      :columns="columns"
      :pagination.sync="pagination"
      :selected.sync="rowsSelected"
      :filter="filter"
      row-key="_id"
      selection="multiple"
      separator="vertical"
      no-data-label="데이터를 찾지 못하였습니다. (VIP, Gold, Silver 등을 추가하세요.)"
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
          회원 등급
          <q-icon name="mdi-information" color="primary">
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
              설정된 누적 형식을 기준으로 설정 금액을 초과 할 경우 등급이 설정됩니다. (VIP, Gold, Silver 등을 추가하세요.)
            </q-tooltip>
          </q-icon>
        </div>
        <div class="col-12 row">
          <edit-template
            @add="onAdd"
            @edit="onEdit"
            @remove="onRemove"
            :disables="buttonDisables"
          />
          <q-space />
          <q-select
            label="누적 형식"
            v-model="gymData.memberRank"
            :options="rankOpts"
            style="width: 100px"
            emit-value
            map-options
            class="q-pl-sm"
            dense
            @input="onChangeMemberRank"
          />
          <!-- 검색 -->
          <div style="min-width: 120px;" class="q-ml-md">
            <q-input
              style="max-width:120px;"
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
    <member-rank-popup ref="regPopup" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// Popup
import MemberRankPopup from './popup/MemberRankPopup'
import EditTemplate from 'components/template/EditTemplate'
// Mixin
import TableMixin from 'src/mixins/tableMixin'
export default {
  name: 'MemberRankTemplate',
  components: {
    MemberRankPopup,
    EditTemplate
  },
  mixins: [TableMixin],
  async mounted () {
    await Promise.all([
      this.reqGetDefineDataList({
        gymid: this.gymInfo.id,
        type: 'memberrank'
      }),
      this.reqGetGymData()
    ])
    this.pagination.rowsPerPage = 10 // 한 페이지에서 보여줄 row수
  },
  data () {
    return {
      rowsSelected: [],
      filter: '',
      // 회원 등급 누적 형식
      rankOpts: [
        { label: '설정 안함', value: 0 },
        { label: '금년 누적', value: 1 },
        { label: '전년 누적', value: 2 },
        { label: '전체 누적', value: 3 }
      ],
      columns: [
        { name: 'name', align: 'left', label: '회원 등급 명', field: 'name', sortable: true },
        {
          name: 'rankPrice',
          align: 'left',
          label: '설정 금액',
          field: 'rankPrice',
          sortable: true,
          format: (val, row) => {
            if (!_.isNumber(val)) return ''
            return `${val.toLocaleString()}원 이상`
          }
        },
        { name: 'desc', align: 'left', label: '설명', field: 'desc', sortable: true }
      ]
    }
  },
  computed: {
    ...mapState('defineDatas', [
      'memberRankDefineDataList'
    ]),
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('gym', [
      'gymData'
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
    ...mapActions('gym', [
      'reqGetGymData',
      'reqUpdateGym'
    ]),
    onChangeMemberRank () {
      this.reqUpdateGym()
    },
    onAdd () {
      this.$refs.regPopup.show()
    },
    onEdit () {
      this.$refs.regPopup.show(this.rowsSelected[0])
    },
    async onRemove () {
      let reqQuery = { type: 'memberrank' }
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
