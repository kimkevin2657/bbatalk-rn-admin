<template>
  <agree-dialog
    ref="agreeDialog"
    :title="title"
    :width="660"
    :height="newTicket.priceType === '현금+카드' ? 720 : 690"
    :useButtons="['cancel', 'confirm']"
    :textArr="['양도 관련 약관']"
    @confirm="onTransfer()"
  >
    <div
      class="row q-col-gutter-x-md"
      style="margin: 0px;"
    >
      <q-input
        name="name"
        v-model="newTicket.name"
        :hint="newTicket.memberid ? `${newTicket.name} (${newTicket.special_n})` : '양도 받으실 회원을 정해주세요.'"
        label="* 양수 회원명"
        data-vv-scope="lesson"
        v-validate="'required'"
        :error="errors.has('lesson.name')"
        :error-message="getValidateMessage('name')"
        dense
        readonly
        class="col-12"
        @click="$refs.memberSearchPopup.show('member')"
        hide-bottom-space
      >
        <template #after>
          <q-btn
            icon="search"
            label="검색"
            color="blue-grey-6"
            dense
            @click="$refs.memberSearchPopup.show('member')"
          />
        </template>
      </q-input>
      <!-- 상담직원 -->
      <q-select
        label="* 상담직원"
        name="consultStaff"
        v-model="newTicket.consult_staff"
        :options="consultStaffOpts"
        class="col-md-6 col-sm-12"
        data-vv-scope="lesson"
        v-validate="'required'"
        :error="errors.has('lesson.consultStaff')"
        :error-message="getValidateMessage('consultStaff')"
        input-debounce="0"
        @filter="(val, update) => { filterConsultStaff = val; update() }"
        hide-selected
        use-input
        fill-input
        dense
        hide-bottom-space
        autocomplete="off"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              검색 결과가 없습니다.
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <!-- 입력 직원 -->
      <q-select
        label="* 입력직원"
        name="inputStaff"
        v-model="newTicket.input_staff"
        :options="inputStaffOpts"
        class="col-md-6 col-sm-12"
        data-vv-scope="lesson"
        v-validate="'required'"
        :error="errors.has('lesson.inputStaff')"
        :error-message="getValidateMessage('inputStaff')"
        input-debounce="0"
        @filter="(val, update) => { filterInputStaff = val; update() }"
        hide-selected
        use-input
        fill-input
        dense
        hide-bottom-space
        autocomplete="off"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              검색 결과가 없습니다.
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <!-- 양도 수강권 -->
      <q-input
        label="양도 수강권"
        :value="ticketData.session"
        dense
        :disable="true"
        class="col-12"
      />
      <!-- 양도 정보 -->
      <div class="col-md-6 col-sm-12">
        <div class="q-mt-md">
          <b>양도 정보</b>
        </div>
        <q-list
          class="q-mt-sm q-pa-sm"
          bordered
          dense
        >
          <!-- 양도 회원명 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label
                class="q-py-sm q-px-none"
                header
                lines="1"
              >양도 회원명</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${ticketData.name} (${ticketData.special_n})`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 사용 횟수 -->
          <q-item
            v-if="type === 'lesson'"
            style="padding: 0px"
          >
            <q-item-section>
              <q-item-label
                class="q-py-sm q-px-none"
                header
                lines="1"
              >사용 횟수</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${transferInfo.useCnt}회`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 사용 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label
                class="q-py-sm q-px-none"
                header
                lines="1"
              >사용 기간</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{transferInfo.useDate}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 사용 일 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label
                class="q-py-sm q-px-none"
                header
                lines="1"
              >사용 일</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${transferInfo.useDayCnt}일`}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- 양수 정보 -->
      <div class="col-md-6 col-sm-12">
        <div class="q-mt-md">
          <b>양수 정보</b>
        </div>
        <q-list
          class="q-mt-sm q-pa-sm"
          bordered
          dense
        >
          <!-- 양수 회원명 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label
                class="q-py-sm q-px-none"
                header
                lines="1"
              >양수 회원명</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label
                v-if="newTicket.name"
                class="q-py-sm q-px-none"
              >{{`${newTicket.name} (${newTicket.special_n})`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 양수 횟수 -->
          <q-item
            v-if="type === 'lesson'"
            style="padding: 0px"
          >
            <q-item-section>
              <q-item-label
                class="q-py-sm q-px-none"
                header
                lines="1"
              >양수 횟수</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${assignorInfo.useCnt}회`}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 양수 기간 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label
                class="q-py-sm q-px-none"
                header
                lines="1"
              >양수 기간</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{assignorInfo.useDate}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 양수 일 -->
          <q-item style="padding: 0px">
            <q-item-section>
              <q-item-label
                class="q-py-sm q-px-none"
                header
                lines="1"
              >양수 일</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-py-sm q-px-none">{{`${assignorInfo.useDayCnt}일`}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- 양도비 -->
      <q-input
        label="양도비"
        v-model="newTicket.price"
        dense
        suffix="원"
        class="col-12"
      />
      <!-- 결재 설정 -->
      <div class="col-12 q-mt-md">
        <b>결재 설정</b>
      </div>

      <q-select
        name="priceType"
        label="* 결재 유형"
        v-model="newTicket.priceType"
        :options="['현금', '카드', '현금+카드', '계좌이체']"
        class="col-6"
        data-vv-scope="lesson"
        v-validate="'required'"
        :error="errors.has('lesson.priceType')"
        :error-message="getValidateMessage('priceType')"
        hide-bottom-space
        @input="onPriceType"
        dense
      />
      <q-input
        name="reg_d"
        label="* 결재일"
        v-model="newTicket.reg_d"
        mask="####-##-##"
        class="col-6"
        data-vv-scope="lesson"
        v-validate="'required'"
        :error="errors.has('lesson.reg_d')"
        :error-message="getValidateMessage('reg_d')"
        dense
        hide-bottom-space
      >
        <template #append>
          <q-icon
            name="event"
            class="cursor-pointer"
          >
            <q-popup-proxy
              ref="qDateProxy3"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="newTicket.reg_d"
                mask="YYYY-MM-DD"
                @input="() => $refs.qDateProxy3.hide()"
                :locale="locale"
                minimal
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        v-if="newTicket.priceType !== '카드'"
        label="현금 영수증"
        v-model="newTicket.cash_r"
        class="col-6 q-pr-sm"
        dense
      >
        <template #before>
          <q-icon name="mdi-receipt" />
        </template>
      </q-input>
      <q-input
        v-if="newTicket.priceType !== '카드'"
        label="현금 금액"
        v-model.number="newTicket.cash"
        type="number"
        class="col-6"
        dense
        suffix="원"
        @input="(val) => {
          if (newTicket.priceType === '현금+카드') {
            const price = newTicket.price - newTicket.point
            newTicket.vat = $vat(newTicket.price)
            newTicket.card = price - newTicket.vat - newTicket.cash
          }
        }"
        @blur="() => { if(!newTicket.cash) newTicket.cash = 0 }"
      >
        <template #before>
          <q-icon name="mdi-cash" />
        </template>
      </q-input>
      <q-select
        label="* 카드 종류"
        name="cardType"
        v-if="newTicket.priceType === '카드' || newTicket.priceType === '현금+카드'"
        v-model="newTicket.cardType"
        class="col-6"
        :options="cardOpts"
        @filter="(val, update) => { filterCard = val; update() }"
        hide-selected
        use-input
        fill-input
        input-debounce="0"
        data-vv-scope="lesson"
        v-validate="'required'"
        :error="errors.has('lesson.cardType')"
        :error-message="getValidateMessage('cardType')"
        hide-bottom-space
        autocomplete="off"
        dense
      >
        <template #before>
          <q-icon name="mdi-credit-card-multiple-outline" />
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              검색 결과가 없습니다.
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        label="카드 금액"
        v-if="newTicket.priceType === '카드' || newTicket.priceType === '현금+카드'"
        v-model.number="newTicket.card"
        type="number"
        class="col-6"
        dense
        suffix="원"
        @blur="() => { if(!newTicket.card) newTicket.card = 0 }"
      >
        <template #before>
          <q-icon name="mdi-credit-card-outline" />
        </template>
      </q-input>
      <q-input
        name="point"
        label="사용 포인트"
        v-model.number="newTicket.point"
        :max="availablePoint"
        type="number"
        class="col-6"
        data-vv-scope="lesson"
        v-validate="`min_value:0|max_value:${availablePoint}`"
        :error="errors.has('lesson.point')"
        :error-message="getValidateMessage('point')"
        dense
        :hint="`사용가능한 포인트: ${availablePoint}`"
        @blur="() => { if(!newTicket.point) newTicket.point = 0 }"
        @input="onInputPointCalc"
      >
        <template #before>
          <q-icon name="mdi-file-powerpoint-box-outline" />
        </template>
      </q-input>
      <q-input
        label="부가세"
        v-model.number="newTicket.vat"
        type="number"
        class="col-6"
        suffix="원"
        dense
        :hint="`총 결재 합산: ${newTicket.price.toLocaleString()}원`"
        @blur="() => { if(!newTicket.vat) newTicket.vat = 0 }"
      >
        <template #before>
          <q-chip
            class="q-mx-none"
            label="vat"
            outline
            dense
            size="10px"
          />
        </template>
      </q-input>
    </div>

    <member-search-popup
      ref="memberSearchPopup"
      @member="injectMemberInfo"
    />
  </agree-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// mixin
import CalendarMixin from 'src/mixins/calendarMixin'
import ValidateMixin from 'src/mixins/validateMixin'
// popup
import AgreeDialog from 'components/dialog/AgreeDialog'
import MemberSearchPopup from 'components/popup/MemberSearchPopup'
export default {
  name: 'TicketTransferPopup',
  components: {
    AgreeDialog,
    MemberSearchPopup
  },
  inject: ['$validator'],
  mixins: [CalendarMixin, ValidateMixin],
  data () {
    return {
      title: '양도 처리',
      availablePoint: 0, // 사용가능한 포인트
      filterCard: '',
      filterInputStaff: '',
      filterConsultStaff: ''
    }
  },
  props: {
    type: {
      type: String,
      default: 'lesson'
    }
  },
  computed: {
    ...mapState('ticket', [
      'lessonData',
      'membershipData',
      'newTicket'
    ]),
    ...mapState('staff', [
      'staffDataList'
    ]),
    ...mapState('gym', [
      'gymData'
    ]),
    ...mapState('setting', [
      'cardList'
    ]),
    ticketData () {
      if (this.type === 'lesson') return this.lessonData
      if (this.type === 'membership') return this.membershipData
      return this.lessonData
    },
    // 상담 직원 목록
    consultStaffOpts () {
      const needle = this.filterConsultStaff.toLowerCase()
      return _.map(this.staffDataList, (staff) => {
        const team = staff.team ? `${staff.team} ` : ''
        return `${team}${staff.name}(${staff.special_n})`
      }).filter(o => {
        return o.toLowerCase().indexOf(needle) > -1
      })
    },
    // 입력 직원 목록
    inputStaffOpts () {
      const needle = this.filterInputStaff.toLowerCase()
      return _.map(this.staffDataList, (staff) => {
        const team = staff.team ? `${staff.team} ` : ''
        return `${team}${staff.name}(${staff.special_n})`
      }).filter(o => {
        return o.toLowerCase().indexOf(needle) > -1
      })
    },
    // 결재 카드 목록
    cardOpts () {
      const needle = this.filterCard.toLocaleString()
      let list = _.cloneDeep(this.cardList)
      list.push('기타카드')
      return list.filter(o => {
        return o.toLowerCase().indexOf(needle) > -1
      })
    },
    // 양도자 정보
    transferInfo () {
      let sdate = void 0
      let edate = void 0
      let dateStr = ''
      let useDayCnt = 0
      if (this.$moment(this.$moment().format('YYYY-MM-DD')).isAfter(this.$moment(this.ticketData.sdate).format('YYYY-MM-DD'))) { // 당일 이후 양도
        sdate = this.$moment(this.ticketData.sdate)
        const currentTime = this.$moment().add(-1, 'day')
        edate = this.$moment(currentTime.format('YYYY-MM-DD 23:59:59'))
        if (sdate.year() === edate.year()) {
          dateStr = `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('MM-DD')}`
        } else {
          dateStr = `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('YYYY-MM-DD')}`
        }
        useDayCnt = edate.diff(sdate, 'days') + 1
      } else {  // 사용하지 않은 티켓 양도
        sdate = this.$moment(this.ticketData.sdate)
        edate = this.$moment(this.ticketData.sdate)
        dateStr = '사용 안함'
        useDayCnt = 0
      }

      let opts = {
        sdate: sdate,
        edate: edate,
        useDate: dateStr,
        useDayCnt: useDayCnt
      }
      if (this.type === 'lesson') opts.useCnt = this.ticketData.useCnt
      return opts
    },
    // 양수자 정보
    assignorInfo () {
      const currentTime = this.$moment()
      let sdate = void 0
      let edate = void 0
      let dateStr = void 0

      if (this.$moment().isAfter(this.ticketData.sdate)) {
        sdate = this.$moment(currentTime.format('YYYY-MM-DD 00:00:00'))
        edate = this.$moment(this.ticketData.edate)
      } else {
        sdate = this.$moment(this.ticketData.sdate)
        edate = this.$moment(this.ticketData.edate)
      }
      if (sdate.year() === edate.year()) {
        dateStr = `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('MM-DD')}`
      } else {
        dateStr = `${sdate.format('YYYY-MM-DD')} ~ ${edate.format('YYYY-MM-DD')}`
      }
      const opts = {
        sdate: sdate,
        edate: edate,
        useDate: dateStr,
        useDayCnt: edate.diff(sdate, 'days') + 1
      }
      if (this.type === 'lesson') opts.useCnt = this.ticketData.totCnt - this.ticketData.useCnt
      return opts
    }
  },
  methods: {
    ...mapActions('staff', [
      'reqGetStaffDataList'
    ]),
    ...mapActions('defineDatas', [
      'reqGetDefineDataList'
    ]),
    ...mapActions('setting', [
      'reqGetCard'
    ]),
    ...mapActions('ticket', [
      'reqTransferTicket',
      'reqGetTicketData'
    ]),
    ...mapMutations('ticket', [
      'initTicketData',
      'initNewTicketData',
      'setNewTicket'
    ]),
    ...mapActions('gym', [
      'reqGetGymData'
    ]),
    // 회원 정보 주입
    injectMemberInfo (memberInfo) {
      if (this.ticketData.memberid === memberInfo._id) {
        this.$notify.error('동일인이 양도 받을 수 없습니다.')
        return
      }
      this.newTicket.memberid = memberInfo._id
      this.newTicket.name = memberInfo.name
      this.newTicket.engName = memberInfo.engName
      this.newTicket.special_n = memberInfo.special_n
      this.newTicket.phone = memberInfo.phone
      this.newTicket.photo = memberInfo.photo
      this.newTicket.gender = memberInfo.gender
      this.newTicket.memberType = memberInfo.memberType
      this.availablePoint = memberInfo.point || 0
    },
    // 결재 유형 변경 시
    onPriceType (val) {
      this.newTicket.cardType = ''
      this.newTicket.card = 0
      this.newTicket.cash = 0
      this.newTicket.vat = 0
      const price = this.newTicket.price  // 센터에서 설정 된 양도비
      if (val === '카드') {
        this.newTicket.vat = this.$vat(price)
        this.newTicket.card = price - this.newTicket.vat
      } else if (val === '현금+카드') {
        this.newTicket.vat = this.$vat(price)
        this.newTicket.card = price - this.newTicket.vat
        if (!this.newTicket.cash_r && this.newTicket.phone) {
          this.newTicket.cash_r = this.newTicket.phone.split('-').join('')
        }
      } else {
        this.newTicket.vat = this.$vat(price)
        this.newTicket.cash = price - this.newTicket.vat
        if (!this.newTicket.cash_r && this.newTicket.phone) {
          this.newTicket.cash_r = this.newTicket.phone.split('-').join('')
        }
      }
    },
    // 포인트 입력 시 자동 입력 부분
    onInputPointCalc (val) {
      let price = Number(this.newTicket.price)
      price -= Number(this.newTicket.point)
      if (this.newTicket.priceType === '현금+카드') {
        this.newTicket.vat = this.$vat(price)
        this.newTicket.card = price - this.newTicket.cash - this.newTicket.vat
      } else if (this.newTicket.priceType === '현금' || this.newTicket.priceType === '계좌이체') {
        this.newTicket.vat = this.$vat(price)
        this.newTicket.cash = price - this.newTicket.vat
      } else if (this.newTicket.priceType === '카드') {
        this.newTicket.vat = this.$vat(price)
        this.newTicket.card = price - this.newTicket.vat
      }
    },
    // 결재 정보 유효성 검사
    calcValidate () {
      // 결재 필요 금액
      let price = +this.newTicket.price
      // 결재 금액
      let cPrice = 0
      cPrice += +this.newTicket.cash
      cPrice += +this.newTicket.card
      cPrice += +this.newTicket.point
      return price === cPrice
    },
    // 수강권 양도
    async onTransfer () {
      // this.lessonData.session = this.accountInfo.title
      const reqValidate = await this.$validator.validateAll('lesson')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const isCalcValid = this.calcValidate()
      if (!isCalcValid) return this.$notify.error('결제 금액이 일치하지 않습니다.')
      // 구매금
      let price = 0
      price += Number(this.newTicket.cash)
      price += Number(this.newTicket.card)
      price += Number(this.newTicket.point)

      // 양수자 설정
      this.newTicket.purchase = price
      const lessonPickList = [
        'gymid',  // 기본 정보
        'staffid', 'staffName', 'staffTeam', 'staffEng', 'staffPhoto', 'staffSpecial_n',  // 강사 정보
        'sessionid', 'productid', 'session', 'team', 'month', // 세션 정보
        'peopleCnt', 'duration'
      ]
      const membershipPickList = [
        'gymid',  // 기본 정보
        'sessionid', 'productid', 'session', 'month' // 세션 정보
      ]
      if (this.type === 'lesson') {
        this.setNewTicket(_.assignIn(this.newTicket, _.pick(this.ticketData, lessonPickList)))
        this.newTicket.totCnt = this.assignorInfo.useCnt
      } else {
        this.setNewTicket(_.assignIn(this.newTicket, _.pick(this.ticketData, membershipPickList)))
      }

      this.newTicket.pay_state = 4  // 양수 설정 변경
      this.newTicket.pay_d = new Date() // 등록 및 결재 시간
      this.newTicket.sdate = this.assignorInfo.sdate
      this.newTicket.edate = this.assignorInfo.edate

      // 양도자 설정
      if (this.type === 'lesson') {
        this.lessonData.pay_state = 2  // 양도 상태 변경
        this.lessonData.edate = this.transferInfo.edate
        this.lessonData.totCnt = this.transferInfo.useCnt
        this.lessonData.useCnt = this.transferInfo.useCnt
      } else if (this.type === 'membership') {
        this.membershipData.pay_state = 2  // 양도 상태 변경
        this.membershipData.edate = this.transferInfo.edate
      }

      try {
        const { code } = await this.reqTransferTicket({ type: this.type })
        if (code === 'ok') {
          this.$refs.agreeDialog.hide()
        } else {
          if (this.type === 'lesson') {
            await this.initData(this.lessonData)
          } else {
            await this.initData(this.membershipData)
          }
          this.errors.clear()
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    },
    async initData (data) {
      this.initTicketData()
      this.initNewTicketData(this.type)
      await Promise.all([
        this.reqGetStaffDataList(), // 스태프 목록
        this.reqGetTicketData({ _id: data._id, type: this.type }),
        this.reqGetCard(), // 카드 목록 조회
        this.reqGetGymData()  // 센터 정보 조회
      ])
      this.newTicket.price = this.gymData.transferPee  // 센터에서 설정 된 양도비
    },
    async show (ticketInfo) {
      await this.initData(ticketInfo)
      this.$refs.agreeDialog.show()
    }
  }
}
</script>
