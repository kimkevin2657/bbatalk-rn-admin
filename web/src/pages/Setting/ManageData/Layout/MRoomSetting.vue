<template>
  <div class="q-pa-md">
    <div>
      <q-table
        :data="roomDefineDataList"
        :columns="roomColumns"
        :pagination.sync="pagination"
        :selected.sync="rowsSelected"
        :filter="filter"
        row-key="_id"
        selection="multiple"
        separator="vertical"
        no-data-label="데이터를 찾지 못하였습니다."
        no-results-label="검색된 결과가 없습니다."
        @row-click="(evt, row) => onMultiRowClick(evt, row)"
        dense
        square
      >
        <template v-slot:body-cell="props">
          <q-td
            :props="props"
            @mouseover="mouseoverRow = props.rows"
            @dblclick="$refs.regRoom.show(props.row); rowsSelected = [props.row]"
          >
            {{props.value}}
            <q-tooltip v-if="props.value">
              {{props.value}}
            </q-tooltip>
          </q-td>
        </template>
        <template #top>
          <div class="text-h6 col-12">룸 설정</div>
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
            <div class="justify-center" style="display: grid; grid-template-columns: auto auto auto;">
              <q-select
                v-model="pagination.rowsPerPage"
                :options="[10, 20, 30, 40, 50]"
                :label="'룸 수'"
                style="width: 60px"
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
    <reg-room ref="regRoom" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// Popup
import RegRoom from './mRoomSetting/RegRoom'
// Template
import EditTemplate from 'src/components/template/EditTemplate'
// Mixin
import TableMixin from 'src/mixins/tableMixin'
export default {
  name: 'MRoomSetting',
  components: {
    RegRoom,
    EditTemplate
  },
  mixins: [TableMixin],
  mounted () {
    this.reqGetDefineDataList({
      gymid: this.gymInfo.id,
      type: 'room'
    })
  },
  data () {
    return {
      roomColumns: [
        { name: 'name', align: 'left', label: '룸 명', field: 'name', sortable: true },
        { name: 'team', align: 'left', label: '부서 구분', field: 'team', sortable: true },
        { name: 'desc', align: 'left', label: '설명', field: 'desc', sortable: true }
      ]
    }
  },
  computed: {
    ...mapState('defineDatas', [
      'roomDefineDataList'
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
      this.$refs.regRoom.show()
    },
    onEdit () {
      this.$refs.regRoom.show(this.rowsSelected[0])
    },
    async onRemove () {
      try {
        let reqQuery = { type: 'room' }
        if (_.size(this.rowsSelected) === 1) {
          reqQuery._id = _.get(this.rowsSelected, [0, '_id'], void 0)
        } else {
          reqQuery.ids = _.map(this.rowsSelected, o => {
            return o._id
          })
        }
        const { code } = await this.reqRemoveDefineData(reqQuery)
        if (code === 'ok') {
          this.rowsSelected = []
        }
      } catch (e) {
        this.$notify.error(e)
      }
    }
  }
}
</script>
