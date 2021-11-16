<template>
  <div>
    <top>
      <template #body>
        <q-btn
          label="회원권 추가"
          @click="onClickMembershipRegistBtn"
          style="margin-right: 10px;"
          dense
          flat
        />
        <q-btn
          label="수강권 추가"
          @click="onClickLessonRegistBtn"
          style="margin-right: 10px;"
          dense
          flat
        />
        <!-- <q-btn label="옵션 등록" @click="onClickOptionRegistBtn" style="margin-right: 10px;" dense flat/> -->
        <div style="border-right: 1px solid #ccc2c2;; width: 5px; height: 15px; margin-right: 10px;" />
        <header-edit-template
          @add="onAdd"
          @edit="onEdit"
          @remove="onRemove(removeMember)"
          :disables="buttonDisables"
        />
      </template>
      <template #subbody>
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
          <!-- 검색 -->
          <q-input
            style="max-width:160px;"
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
        :data="xMemberDataList"
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
          $refs.memberRegistPopup.show(row)
          rowsSelected = [row]
        }"
        dense
        bordered
      >
        <!-- 회원 명 Custom -->
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
                <!-- 회원명 -->
                <div
                  class="text-blue-9 textlink"
                  @click.stop="onClickDetailMember(props.row._id)"
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
        <!-- 생년 월일 Custom -->
        <template v-slot:body-cell-birth="props">
          <q-td :props="props">
            <div
              v-for="(txt, index) in props.value"
              :key="`birth${index}`"
            >
              {{txt}}
            </div>
          </q-td>
        </template>
        <!-- 회원권 Custom -->
        <template v-slot:body-cell-membershipTickets="props">
          <q-td :props="props">
            <div
              v-for="(obj, index) in props.value"
              :key="`membership${index}`"
            >
              <q-icon
                v-if="isPause(obj)"
                name="mdi-pause-octagon-outline"
                color="negative"
              />
              {{obj.session}}
            </div>
          </q-td>
        </template>
        <!-- 수강권 Custom -->
        <template v-slot:body-cell-lessonTickets="props">
          <q-td :props="props">
            <div
              v-for="(obj, index) in props.value"
              :key="`lesson${index}`"
            >
              <q-icon
                v-if="isPause(obj)"
                name="mdi-pause-octagon-outline"
                color="negative"
              />
              {{obj.session}}
            </div>
          </q-td>
        </template>
        <!-- 회원 등급 Custom -->
        <template #header-cell-rankName="props">
          <q-th :props="props">
            {{`회원 등급${rankType}`}}
          </q-th>
        </template>
        <template #body-cell-rankName="props">
          <q-td :props="props">
            <div
              v-for="(txt, index) in props.value"
              :key="`rank${index}`"
            >
              {{txt}}
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

      <!-- 수강권 등록 -->
      <lesson-regist-popup
        ref="lessonRegistPopup"
        @complete="reqGetMemberDataList()"
      />
      <!-- 회원권 등록 -->
      <membership-regist-popup
        ref="membershipRegistPopup"
        @complete="reqGetMemberDataList()"
      />
      <!-- 락커 등록 -->
      <option-regist-popup ref="optionRegistPopup" />
      <!-- 회원 추가/수정 -->
      <member-regist-popup ref="memberRegistPopup" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

// 팝업
import LessonRegistPopup from './popup/LessonRegistPopup'
import MembershipRegistPopup from './popup/MembershipRegistPopup'
import OptionRegistPopup from './popup/OptionRegistPopup'
import MemberRegistPopup from './popup/MemberRegistPopup'

// 컴포넌트
import Top from 'src/layouts/component/Top'
import HeaderEditTemplate from 'src/layouts/template/HeaderEditTemplate'

// Mixin
import TableMixin from 'src/mixins/tableMixin'
import MsgMixin from 'src/mixins/msgMixin'
export default {
  name: 'MemberState',
  mixins: [TableMixin, MsgMixin],
  components: {
    Top,
    LessonRegistPopup,
    MembershipRegistPopup,
    OptionRegistPopup,
    MemberRegistPopup,
    HeaderEditTemplate
  },
  data () {
    return {
      isCard: false,  // 테이블 유형, card, table
      // 검색 구분
      manager: '',
      memberType: '',
      membership: '',
      cannotSelectMembership: false,
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
      visibleColumns: [
        'name', 'phone', 'birth', 'membershipTickets',
        'lessonTickets', 'rank', 'rankName',
        'memberType', 'uPrice', 'regDate'
      ],
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
          },
          sortable: true
        },
        { name: 'phone', align: 'center', label: '연락처', field: 'phone', sortable: true },
        {
          name: 'address',
          align: 'center',
          label: '주소',
          field: 'address_f',
          format: (val, row) => {
            let address = ''
            if (row.address_f) address = row.address_f
            if (row.address_l) address = address + ` ${row.address_l}`
            return address
          }
        },
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
            birthday.setFullYear(today.getFullYear())
            if (today < birthday) years--
            return [val, `${korOld}살 (만 ${years}살)`]
          },
          sortable: true
        },
        {
          name: 'carNumber_f',
          align: 'left',
          label: '차량 번호',
          field: 'carNumber_f',
          format: (val, row) => {
            if (val && row.carNumber_l) return `${val}${row.carNumber_l}`
            return ''
          }
        },
        {
          name: 'membershipTickets',
          align: 'left',
          label: '유효 회원권',
          field: 'membershipTickets',
          sortable: true
        },
        {
          name: 'lessonTickets',
          align: 'left',
          label: '유효 수강권',
          field: 'lessonTickets',
          sortable: true
        },
        // { name: 'option', align: 'center', label: '옵션', field: 'option' },
        // { name: 'adjournment', align: 'center', label: '휴회 내역', field: 'adjournment' },
        {
          name: 'rank',
          align: 'right',
          label: '랭킹',
          field: 'rank',
          sortable: true,
          format: (val) => {
            return `${val}위`
          }
        },
        {
          name: 'rankName',
          align: 'center',
          label: '회원 등급',
          field: 'rankName',
          sortable: true,
          format: (val, row) => {
            let arr = []
            if (val) arr.push(val)
            if (row.tRankPrice !== void 0) arr.push(`[누적: ${row.tRankPrice.toLocaleString()}원]`)
            if (row.bRankPrice !== void 0) arr.push(`[전년 누적: ${row.bRankPrice.toLocaleString()}원]`)
            if (row.cRankPrice !== void 0) arr.push(`[금년 누적: ${row.cRankPrice.toLocaleString()}원]`)
            return arr
          }
        },
        { name: 'memberType', align: 'left', label: '회원 구분', field: 'memberType' },
        {
          name: 'memberGroup',
          align: 'left',
          label: '회원 분류',
          field: 'memberGroup',
          sortable: true,
          format: (val) => val.join(', ')
        },
        { name: 'regPath', align: 'left', label: '등록 경로', field: 'regPath' },
        { name: 'point', align: 'right', label: '포인트', field: 'point', sortable: true },
        {
          name: 'tPrice',
          align: 'right',
          label: '총 구매금',
          field: 'tPrice',
          format: (val) => {
            if (val) return `${val.toLocaleString()}원`
            return '0원'
          }
        },
        {
          name: 'uPrice',
          align: 'right',
          label: '총 미수금',
          field: 'uPrice',
          format: (val) => {
            if (val) return `${val.toLocaleString()}원`
            return '0원'
          }
        },
        { name: 'regMemo', align: 'left', label: '메모', field: 'regMemo' },
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
    ...mapState('member', [
      'memberDataList'
    ]),
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('gym', [
      'gymData' // memberRank, 회원 등급 누적 형식(0: 없음, 1: 금년 누적, 2: 전년 누적, 3: 전체 누적)
    ]),
    ...mapState('defineDatas', [
      'memberTypeDefineDataList',  // 회원 구분
      'memberRankDefineDataList',  // 회원 등급
      'memberGroupDefineDataList', // 회원 분류
      'lessonDefineDataList'
    ]),
    rankType () {
      const type = _.get(this.gymData, ['memberRank'], 0)
      if (type === 0) return ''
      if (type === 1) return '(금년 누적)'
      if (type === 2) return '(전년 누적)'
      if (type === 3) return '(전체 누적)'
      return ''
    },
    xMemberDataList () {
      let rankType = _.get(this.gymData, ['memberRank'], 0)
      let rankList = _.cloneDeep(this.memberRankDefineDataList)
      rankList.sort((a, b) => b.rankPrice - a.rankPrice)

      const t = new Date()
      const currentYear = t.getFullYear()
      const beforeYear = t.getFullYear() - 1
      return _.map(this.memberDataList, member => {
        let purchase = void 0         // 전체 누적
        let currentPurchase = void 0  // 금년 누적
        let beforePurchase = void 0   // 전년 누적
        let rankInfo = void 0
        const yPrices = _.get(member, ['purchase', 'yPrices'], [])
        if (this.gymData.memberRank === 0) {
        } else if (rankType === 1) { // 금년 누적
          const currentPrice = _.find(yPrices, o => +o.year === currentYear)
          currentPurchase = _.get(currentPrice, 'price', 0)
          rankInfo = _.find(rankList, o => o.rankPrice <= currentPurchase)
        } else if (rankType === 2) { // 전년 누적
          const currentPrice = _.find(yPrices, o => +o.year === currentYear)
          currentPurchase = _.get(currentPrice, 'price', 0)
          const beforePrice = _.find(yPrices, o => +o.year === beforeYear)
          beforePurchase = _.get(beforePrice, 'price', 0)
          rankInfo = _.find(rankList, o => o.rankPrice <= beforePurchase)
        } else if (rankType === 3) { // 전체 누적
          purchase = _.get(member, ['purchase', 'tPrice'], 0)
          rankInfo = _.find(rankList, o => o.rankPrice <= purchase)
        }
        return _.assignIn(member, {
          rankName: _.get(rankInfo, 'name', void 0),          // 회원 등급
          tPrice: _.get(member, ['purcahse', 'tPrice'], 0),   // 총 구매금
          uPrice: _.get(member, ['purchase', 'uPrice'], 0),   // 총 미수금
          rPrice: _.get(member, ['purchase', 'rPrice'], 0),   // 총 환불금
          tRankPrice: purchase,                               // 전체 누적
          bRankPrice: beforePurchase,   // 전년 누적
          cRankPrice: currentPurchase,   // 금년 누적
          rank: this.rankIndex[member._id]
        })
      })
    },
    rankIndex () {
      let rankType = _.get(this.gymData, ['memberRank'], 0)
      const t = new Date()
      const currentYear = t.getFullYear()
      const beforeYear = t.getFullYear() - 1
      const tempList = _.map(this.memberDataList, member => {
        const yPrices = _.get(member, ['purchase', 'yPrices'], [])
        if (rankType === 0) return { key: member._id, price: _.get(member, 'purchase', 'tPrice', 0) }
        if (rankType === 1) { // 금년 누적
          const currentPrice = _.find(yPrices, o => +o.year === currentYear)
          const price = _.get(currentPrice, 'price', 0)
          return { key: member._id, price: price }
        }
        if (rankType === 2) { // 전년 누적
          const beforePrice = _.find(yPrices, o => +o.year === beforeYear)
          const price = _.get(beforePrice, 'price', 0)
          return { key: member._id, price: price }
        }
        if (rankType === 3) { // 전체 누적
          const price = _.get(member, ['purchase', 'tPrice'], 0)
          return { key: member._id, price: price }
        }
        return void 0
      })
      tempList.sort((a, b) => b.price - a.price)
      let rIndex = {}
      _.forEach(tempList, ({ key }, index) => {
        rIndex[key] = index + 1
      })
      return rIndex
    },
    buttonDisables () {
      const selectedSize = _.size(this.rowsSelected)
      if (selectedSize === 0) return ['remove', 'edit']
      if (selectedSize === 1) return []
      if (selectedSize > 1) return ['edit']
      return []
    },
    searchMemberTypeOpts () {
      var opts = ['모두']
      _.forEach(this.memberTypeDefineDataList, (option) => {
        opts.push(option.name)
      })
      return opts
    },
    searchMembershipOpts () {
      var opts = ['모두']
      _.forEach(this.lessonDefineDataList, (o) => {
        if (o.lessonType === '회원권') opts.push(o.name)
      })
      return opts
    },
    searchOperationStaffOpts () {
      var opts = ['모두']
      // _.forEach(this.operationStaffOpts, (option) => {
      //   opts.push(option)
      // })
      return opts
    }
  },
  async mounted () {
    await Promise.all([
      this.reqGetDefineDataList({ // 회원 구분 정의
        type: 'membertype'
      }),
      this.reqGetDefineDataList({ // 회원 등급 정의
        type: 'memberrank'
      }),
      this.reqGetDefineDataList({ // 회원 분류 정의
        type: 'membergroup'
      }),
      this.reqGetDefineDataList({ // 수강 정의
        type: 'lesson'
      }),
      this.reqGetMemberDataList(), // 회원 항목
      this.reqGetGymData()
    ])
  },
  methods: {
    ...mapActions('member', [
      'reqGetMemberData', // 회원 상세 정보 가져오기
      'reqGetMemberDataList', // 모든 회원 리스트 가져오기 요청
      'reqRemoveMember'
    ]),
    ...mapActions('defineDatas', [
      'reqGetDefineDataList'
    ]),
    ...mapActions('staff', [
      'reqGetStaffDataList'
    ]),
    ...mapActions('gym', [
      'reqGetGymData'
    ]),
    // 일시정지 이용권 여부 확인
    isPause ({ delayTickets = [] } = {}) {
      if (_.size(delayTickets) === 0) return false
      for (let i = 0; i < _.size(delayTickets); i++) {
        const delayTicket = delayTickets[i]
        if (delayTicket.type === 'pause') {
          const pauseStart = this.$moment(delayTicket.pause_sdate).format('YYYY-MM-DD')
          const pauseEnd = this.$moment(delayTicket.pause_edate).format('YYYY-MM-DD')
          const current = this.$moment().format('YYYY-MM-DD')
          if (this.$moment(current).isBetween(pauseStart, pauseEnd, null, '[]')) {
            return true
          }
        }
      }
      return false
    },
    // 수강권 등록 팝업 호출
    onClickLessonRegistBtn () {
      const selectedMember = _.cloneDeep(_.get(this.rowsSelected, [this.rowsSelected.length - 1], void 0))
      this.$refs.lessonRegistPopup.show({ memberInfo: selectedMember })
    },
    // 회원권 등록 팝업 호출
    onClickMembershipRegistBtn () {
      const selectedMember = _.cloneDeep(_.get(this.rowsSelected, [this.rowsSelected.length - 1], void 0))
      this.$refs.membershipRegistPopup.show({ memberInfo: selectedMember })
    },
    onClickOptionRegistBtn () {
      this.$refs.optionRegistPopup.show()
    },
    onAdd () {
      this.$refs.memberRegistPopup.show()
    },
    onEdit () {
      this.$refs.memberRegistPopup.show(this.rowsSelected[0])
    },
    async removeMember () {
      try {
        let reqQuery = {}
        if (_.size(this.rowsSelected) === 1) {
          reqQuery._id = _.get(this.rowsSelected, [0, '_id'], void 0)
        } else {
          reqQuery.ids = _.map(this.rowsSelected, o => {
            return o._id
          })
        }
        const { code } = await this.reqRemoveMember(reqQuery)
        if (code === 'ok') {
          this.rowsSelected = []
        }
      } catch (e) {
        this.$notify.error(e)
      }
    },
    // 회원 프로필 상세 페이지로 이동
    async onClickDetailMember (memberid) {
      // 회원 상세 정보 가져오기
      await this.reqGetMemberData({ _id: memberid })
      // 회원 상세 페이지로 이동
      this.$router.push('/manager/member/MemberDetail')
    },
    showRegPopup (rowData) {
      this.$refs.memberRegistPopup.show(rowData)
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
