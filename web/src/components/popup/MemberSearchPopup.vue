<template>
  <default-dialog
    ref="defaultDialog"
    title="회원 검색"
    :width=450
    :height=450
    :useButtons="['close']"
  >
    <div class="row">
      <q-input
        name="name"
        ref="nameInput"
        v-model="name"
        label="회원명"
        class="col-12"
        data-vv-scope="regseaech"
        v-validate="'required'"
        :error="errors.has('regseaech.name')"
        :error-message="getValidateMessage('name')"
        dense
        @keypress.enter="onSerach"
      >
       <template #after>
         <q-btn
          label="검색"
          color="blue-grey-6"
          icon="search"
          @click="onSerach"
          hide-bottom
          dense
        />
       </template>
      </q-input>
      <q-separator />
      <q-table
        :data="dataList"
        :columns="columns"
        :pagination.sync="pagination"
        row-key="_id"
        separator="cell"
        no-data-label="데이터를 찾지 못하였습니다"
        class="col-12 q-mt-md"
        @row-click="onMemberClick"
        bordered
        flat
        dense
      >
        <template #bottom="{pagesNumber}">
          <div class="row col-12" style="display: grid;">
            <div class="justify-center" style="display: grid; grid-template-columns: auto auto auto;">
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
    </div>
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DefaultDialog from '../dialog/DefaultDialog'
import TableMixin from '../../mixins/tableMixin'
import ValidateMixin from '../../mixins/validateMixin'
export default {
  name: 'MemberSearchPopup',
  mixins: [TableMixin, ValidateMixin],
  inject: ['$validator'],
  components: {
    DefaultDialog
  },
  data () {
    return {
      name: '',
      callName: '', // 반환 이벤트명
      columns: [
        {
          name: 'name',
          align: 'left',
          label: '회원명',
          field: 'name',
          format: (val, row) => {
            let name = val
            if (row.engName) name += ` (${row.engName})`
            return name
          }
        },
        { name: 'special_n', align: 'right', label: '회원번호', field: 'special_n' },
        { name: 'phone', align: 'center', label: '연락처', field: 'phone' },
        {
          name: 'birth',
          align: 'center',
          label: '생년월일',
          field: 'birth',
          format: (val, row) => {
            const birthday = new Date(val)
            const today = new Date()
            let years = today.getFullYear() - birthday.getFullYear()
            let korOld = years + 1
            return `${val} (${korOld}살)`
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('member', [
      'memberSearchDataList'
    ]),
    dataList () {
      return _.cloneDeep(this.memberSearchDataList)
    }
  },
  methods: {
    ...mapActions('member', [
      'reqMemberSearchDataList'
    ]),
    ...mapMutations('member', [
      'initMemberSearchDataList'
    ]),
    async onSerach () {
      const reqValidate = await this.$validator.validateAll('regseaech')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      this.reqMemberSearchDataList({ name: this.name })
    },
    onMemberClick (evt, row) {
      this.$emit(this.callName, row)
      this.$refs.defaultDialog.hide()
    },
    async show (callName = 'complete') {
      this.initMemberSearchDataList()
      this.callName = callName
      this.name = ''
      this.$refs.defaultDialog.show()
      await this.$nextTick()
      this.$refs.nameInput.focus()
    }
  }
}
</script>
