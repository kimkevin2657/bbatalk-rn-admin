<template>
  <default-dialog
    ref="defaultDialog"
    :title="updateMode ? '회원권 수정' : '회원권 추가'"
    :width="500"
    :height="950"
    :useButtons="updateMode ? ['cancel', 'edit'] : ['continue', 'cancel', 'confirm']"
    @confirm="onAdd()"
    @edit="onEdit()"
    @continue="onAdd(true)"
  >
    <div
      class="row"
      style="margin: 0px;"
    >
      <q-input
        name="name"
        v-model="membershipData.name"
        :hint="membershipData.memberid ? `${membershipData.name} (${membershipData.special_n})` : ''"
        label="* 회원명"
        data-vv-scope="membership"
        v-validate="'required'"
        :error="errors.has('membership.name')"
        :error-message="getValidateMessage('name')"
        dense
        readonly
        class="col-12"
        @click="$refs.memberSearchPopup.show('member')"
        :disable="updateMode"
        hide-bottom-space
      >
        <template #after>
          <q-btn
            icon="search"
            label="검색"
            color="blue-grey-6"
            dense
            :disable="updateMode"
            @click="$refs.memberSearchPopup.show('member')"
          />
        </template>
      </q-input>
      <q-select
        label="* 상담직원"
        name="consultStaff"
        v-model="membershipData.consult_staff"
        :options="consultStaffOpts"
        class="col-6 q-pr-sm"
        data-vv-scope="membership"
        v-validate="'required'"
        :error="errors.has('membership.consultStaff')"
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
      <q-select
        label="* 입력직원"
        name="inputStaff"
        v-model="membershipData.input_staff"
        :options="inputStaffOpts"
        class="col-6 q-pl-sm"
        data-vv-scope="membership"
        v-validate="'required'"
        :error="errors.has('membership.inputStaff')"
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
      <!-- 회원권 입력 -->
      <div class="col-12 q-mt-md">
        <b>회원권 설정</b>
      </div>
      <q-select
        label="* 회원권"
        name="ticket"
        v-model="membershipData.sessionid"
        :options="sessionOpts"
        option-value="_id"
        option-label="label"
        emit-value
        map-options
        class="col-12"
        data-vv-scope="membership"
        v-validate="'required'"
        :error="errors.has('membership.ticket')"
        :error-message="getValidateMessage('ticket')"
        input-debounce="0"
        @filter="(val, update) => { filterTicket = val; update() }"
        hide-selected
        use-input
        fill-input
        dense
        :disable="updateMode"
        @input="membershipData.productid = ''"
        hide-bottom-space
      >
        <template #before>
          <q-icon name="mdi-ticket-outline" />
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              검색 결과가 없습니다.
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select
        label="* 회원권 상세설정"
        name="product"
        :disable="productOpts.length === 0 || updateMode"
        v-model="membershipData.productid"
        :options="productOpts"
        option-value="id"
        option-label="label"
        emit-value
        map-options
        class="col-12"
        data-vv-scope="membership"
        v-validate="'required'"
        :error="errors.has('membership.product')"
        :error-message="getValidateMessage('product')"
        input-debounce="0"
        @filter="(val, update) => { filterProduct = val; update() }"
        hide-selected
        use-input
        fill-input
        dense
        @input="onProduct"
        hide-bottom-space
      >
        <template #before>
          <q-icon name="mdi-ticket" />
        </template>
      </q-select>
      <q-input
        name="sdate"
        label="* 유효일(시작)"
        v-model="membershipData.sdate"
        mask="####-##-##"
        class="col-5"
        data-vv-scope="membership"
        v-validate="'required'"
        :error="errors.has('membership.sdate')"
        :error-message="getValidateMessage('sdate')"
        dense
        hide-bottom-space
        :disable="updateMode"
        @focus="onStartDate"
      >
        <template #append>
          <q-icon
            name="event"
            class="cursor-pointer"
          >
            <q-popup-proxy
              ref="qDateProxy1"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="membershipData.sdate"
                mask="YYYY-MM-DD"
                :locale="locale"
                minimal
                @input="() => {
                  $refs.qDateProxy1.hide()
                  onStartDate()
                }"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div
        class="col-2"
        style="text-align: center; align-self: center;"
      >
        ~
      </div>
      <q-input
        name="edate"
        label="* 유효일(종료)"
        v-model="membershipData.edate"
        mask="####-##-##"
        class="col-5"
        data-vv-scope="membership"
        v-validate="'required'"
        :error="errors.has('membership.edate')"
        :error-message="getValidateMessage('edate')"
        dense
        :disable="updateMode"
        hide-bottom-space
      >
        <template #append>
          <q-icon
            name="event"
            class="cursor-pointer"
          >
            <q-popup-proxy
              ref="qDateProxy2"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="membershipData.edate"
                mask="YYYY-MM-DD"
                @input="() => $refs.qDateProxy2.hide()"
                :locale="locale"
                minimal
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        name="price"
        label="추가 할인"
        v-model.number="membershipData.addDiscount"
        type="number"
        class="col-12"
        suffix="원"
        :disable="updateMode"
        @blur="() => { if(!membershipData.addDiscount) membershipData.addDiscount = 0 }"
        dense
      >
        <template #before>
          <q-icon name="mdi-sale" />
        </template>
      </q-input>
      <!-- 결재 입력 -->
      <div class="col-12 q-mt-md">
        <b>결재 설정</b>
      </div>
      <q-select
        name="pay_state"
        v-if="!updateMode"
        label="* 결재 상태"
        v-model.number="membershipData.pay_state"
        :options="payStateOpts"
        emit-value
        map-options
        hide-bottom-space
        data-vv-scope="membership"
        v-validate="'required'"
        :error="errors.has('membership.pay_state')"
        :error-message="getValidateMessage('pay_state')"
        class="col-12"
        dense
        @input="(val) => {
          if (val === 1) membershipData.pay_d = $moment().format('YYYY-MM-DD HH:mm')
          else membershipData.pay_d = void 0
        }"
      >
        <template #before>
          <q-icon name="mdi-state-machine" />
        </template>
      </q-select>
      <q-select
        name="priceType"
        label="* 결재 유형"
        v-model="membershipData.priceType"
        :options="['현금', '카드', '현금+카드', '계좌이체']"
        class="col-6 q-pr-sm"
        :disable="!membershipData.productid || updateMode"
        data-vv-scope="membership"
        v-validate="'required'"
        :error="errors.has('membership.priceType')"
        :error-message="getValidateMessage('priceType')"
        hide-bottom-space
        @input="onPriceType"
        dense
      />
      <q-input
        name="pay_d"
        :label="membershipData.pay_state === 1 ? '* 결재일' : '결재일'"
        v-model="membershipData.pay_d"
        mask="####-##-## ##:##"
        class="col-6 q-pl-sm"
        data-vv-scope="membership"
        v-validate="membershipData.pay_state === 1 ? 'required' : ''"
        :error="errors.has('membership.pay_d')"
        :error-message="getValidateMessage('pay_d')"
        :disable="!membershipData.productid || membershipData.pay_state === 0 || updateMode"
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
                v-model="membershipData.pay_d"
                mask="YYYY-MM-DD HH:mm"
                @input="() => $refs.qDateProxy3.hide()"
                :locale="locale"
                minimal
              />
            </q-popup-proxy>
          </q-icon>
          <q-icon
            name="mdi-clock-outline"
            class="cursor-pointer"
          >
            <q-popup-proxy
              ref="qTimeProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time
                v-model="membershipData.pay_d"
                mask="YYYY-MM-DD HH:mm"
                :locale="locale"
                minimal
                format24h
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        v-if="membershipData.priceType !== '카드'"
        label="현금 영수증"
        v-model="membershipData.cash_r"
        :disable="!membershipData.productid"
        class="col-6 q-pr-sm"
        dense
      >
        <template #before>
          <q-icon name="mdi-receipt" />
        </template>
      </q-input>
      <q-input
        v-if="membershipData.priceType !== '카드'"
        label="현금 금액"
        v-model.number="membershipData.cash"
        type="number"
        :disable="!membershipData.productid || updateMode"
        class="col-6 q-pl-sm"
        dense
        suffix="원"
        @input="(val) => {
          if (membershipData.priceType === '현금+카드') {
            const price = membershipData.price - (membershipData.discount + membershipData.addDiscount + membershipData.point)
            membershipData.vat = $vat(price)
            membershipData.card = price - membershipData.cash
          }
        }"
        @blur="() => { if(!membershipData.cash) membershipData.cash = 0 }"
      >
        <template #before>
          <q-icon name="mdi-cash" />
        </template>
      </q-input>
      <q-select
        label="* 카드 종류"
        name="cardType"
        v-if="membershipData.priceType === '카드' || membershipData.priceType === '현금+카드'"
        v-model="membershipData.cardType"
        class="col-6 q-pr-sm"
        :options="cardOpts"
        @filter="(val, update) => { filterCard = val; update() }"
        hide-selected
        use-input
        fill-input
        input-debounce="0"
        :disable="!membershipData.productid || updateMode"
        data-vv-scope="membership"
        v-validate="'required'"
        :error="errors.has('membership.cardType')"
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
        v-if="membershipData.priceType === '카드' || membershipData.priceType === '현금+카드'"
        v-model.number="membershipData.card"
        type="number"
        class="col-6 q-pl-sm"
        dense
        :disable="!membershipData.productid || updateMode"
        suffix="원"
        @blur="() => { if(!membershipData.card) membershipData.card = 0 }"
      >
        <template #before>
          <q-icon name="mdi-credit-card-outline" />
        </template>
      </q-input>
      <q-input
        name="point"
        label="사용 포인트"
        v-model.number="membershipData.point"
        :max="availablePoint"
        type="number"
        class="col-6 q-pr-sm"
        data-vv-scope="membership"
        v-validate="'min_value:0' + updateMode ? '' : `|max_value:${availablePoint}`"
        :error="errors.has('membership.point')"
        :error-message="getValidateMessage('point')"
        :disable="!membershipData.productid || updateMode"
        dense
        :hint="updateMode ? '' : `사용가능한 포인트: ${availablePoint}`"
        @blur="() => { if(!membershipData.point) membershipData.point = 0 }"
        @input="onInputPointCalc"
      >
        <template #before>
          <q-icon name="mdi-file-powerpoint-box-outline" />
        </template>
      </q-input>
      <q-input
        label="부가세"
        v-model.number="membershipData.vat"
        type="number"
        class="col-6 q-pl-sm"
        suffix="원"
        :disable="!membershipData.productid || updateMode"
        dense
        :hint="`총 결재 합산: ${calcPrice.toLocaleString()}원`"
        @blur="() => { if(!membershipData.vat) membershipData.vat = 0 }"
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
      <!-- 기타 입력 -->
      <div class="col-12 q-mt-md">
        <b>기타</b>
      </div>
      <!-- 등록 경로 -->
      <q-select
        label="등록 경로"
        v-model="membershipData.regPath"
        :options="regPathOpts"
        class="col-12"
        dense
        hide-bottom-space
      >
        <template #before>
          <q-icon name="mdi-registered-trademark" />
        </template>
      </q-select>
      <!-- 사은품 -->
      <q-select
        label="사은품"
        v-model="membershipData.gifts"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        @new-value="(val, done) => done(val, 'add-unique')"
        class="col-12"
        :disable="membershipData.pay_state === 3"
        dense
      >
        <template #before>
          <q-icon name="mdi-gift-outline" />
        </template>
      </q-select>
      <!-- 설명 -->
      <q-input
        name="desc"
        v-model="membershipData.desc"
        label="설명"
        class="col-12"
        dense
      />
      <!-- 환불 설정 -->
      <div
        v-if="membershipData.pay_state === 3"
        class="col-12 row"
      >
        <div class="col-12 q-mt-md">
          <b>환불 설정</b>
        </div>
        <q-input
          name="refundReg"
          label="* 환불 등록일"
          v-model="membershipData.refund_reg"
          mask="####-##-##"
          class="col-6 q-pr-sm"
          data-vv-scope="ticket"
          v-validate="'required'"
          :disable="true"
          :error="errors.has('ticket.refundReg')"
          :error-message="getValidateMessage('refundReg')"
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
                  v-model="membershipData.refund_reg"
                  mask="YYYY-MM-DD"
                  @input="() => $refs.qDateProxy3.hide()"
                  :locale="locale"
                  minimal
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          label="* 은행"
          name="refundBank"
          v-model="membershipData.refund_bank"
          class="col-6 q-pl-sm"
          :options="bankOpts"
          @filter="(val, update) => { filterBank = val; update() }"
          hide-selected
          use-input
          fill-input
          input-debounce="0"
          data-vv-scope="ticket"
          v-validate="'required'"
          :error="errors.has('ticket.refundBank')"
          :error-message="getValidateMessage('refundBank')"
          hide-bottom-space
          autocomplete="off"
          disable
          dense
        >
          <template #before>
            <q-icon name="mdi-bank-outline" />
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
          label="* 계좌"
          name="refundAccount"
          v-model="membershipData.refund_account"
          data-vv-scope="ticket"
          v-validate="'required'"
          :error="errors.has('ticket.refundAccount')"
          :error-message="getValidateMessage('refundAccount')"
          class="col-6 q-pr-sm"
          disable
          hide-bottom-space
          dense
        >
          <template #before>
            <q-icon name="mdi-book-open-outline" />
          </template>
        </q-input>
        <q-input
          label="* 예금주"
          name="refundtName"
          v-model="membershipData.refund_name"
          data-vv-scope="ticket"
          v-validate="'required'"
          :error="errors.has('ticket.refundtName')"
          :error-message="getValidateMessage('refundtName')"
          disable
          class="col-6 q-pl-sm"
          dense
        >
          <template #before>
            <q-icon name="mdi-account-outline" />
          </template>
        </q-input>
        <q-input
          label="* 환불 사유"
          name="refundCause"
          v-model="membershipData.refund_cause"
          data-vv-scope="ticket"
          v-validate="'required'"
          :error="errors.has('ticket.refundCause')"
          :error-message="getValidateMessage('refundCause')"
          class="col-12"
          dense
        >
          <template #before>
            <q-icon name="mdi-comment-question-outline" />
          </template>
        </q-input>
      </div>
      <!-- 회원권 정보 -->
      <q-list
        class="col-12 q-mt-sm q-pa-sm"
        bordered
        dense
      >
        <div style="font-size: 14px">
          <b>{{accountInfo.title}}</b>
        </div>
        <!-- 회원권 금액 -->
        <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label
              class="q-py-sm q-px-none"
              header
              lines="1"
            >회원권 금액</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="q-py-sm q-px-none">{{accountInfo.beforePrice}}</q-item-label>
          </q-item-section>
        </q-item>
        <!-- 회원권 할인 금액 -->
        <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label
              class="q-py-sm q-px-none"
              header
              lines="1"
            >회원권 할인 금액</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label
              class="q-py-sm q-px-none"
              style="color: red;"
            >{{accountInfo.discount}}</q-item-label>
          </q-item-section>
        </q-item>
        <!-- 추가 할인 금액 -->
        <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label
              class="q-py-sm q-px-none"
              header
              lines="1"
            >추가 할인 금액</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label
              class="q-py-sm q-px-none"
              style="color: red;"
            >{{accountInfo.addDiscount}}</q-item-label>
          </q-item-section>
        </q-item>
        <!-- 추가 할인 금액 -->
        <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label
              class="q-py-sm q-px-none"
              header
              lines="1"
            >포인트 할인</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label
              class="q-py-sm q-px-none"
              style="color: red;"
            >{{accountInfo.point}}</q-item-label>
          </q-item-section>
        </q-item>
        <!-- 부가세 -->
        <!-- <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label class="q-py-sm q-px-none" header lines="1">부가세</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="q-py-sm q-px-none">{{accountInfo.vat}}</q-item-label>
          </q-item-section>
        </q-item> -->
        <q-separator spaced />
        <!-- 결재 금액 -->
        <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label
              class="q-py-sm q-px-none"
              header
              lines="1"
            >결재 금액</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label
              class="q-py-sm q-px-none"
              style="color: black;font-size: 14px"
            ><b>{{accountInfo.price}}</b></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- 환불 정보 -->
      <q-list
        v-if="membershipData.pay_state === 3"
        class="col-12 q-mt-sm q-pa-sm"
        bordered
        dense
      >
        <div style="font-size: 14px">
          <b>환불 정보</b>
        </div>
        <!-- 환불 부분 -->
        <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label
              class="q-py-sm q-px-none"
              header
              lines="1"
            >이용 금액</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="q-py-sm q-px-none">{{`${_.get(membershipData, ['refund_usePrice'], 0).toLocaleString()}원`}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label
              class="q-py-sm q-px-none"
              header
              lines="1"
            >추가 공제 금액</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="q-py-sm q-px-none">{{`${_.get(membershipData, ['refund_steal'], 0).toLocaleString()}원`}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label
              class="q-py-sm q-px-none"
              header
              lines="1"
            >반환 포인트</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="q-py-sm q-px-none">{{`${_.get(membershipData, ['refund_point'], 0).toLocaleString()}원`}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label
              class="q-py-sm q-px-none"
              header
              lines="1"
            >위약금(10%)</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="q-py-sm q-px-none">{{`${_.get(membershipData, ['refund_penalty'], 0).toLocaleString()}원`}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item style="padding: 0px">
          <q-item-section>
            <q-item-label
              class="q-py-sm q-px-none"
              header
              lines="1"
            >환불 금액</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label
              class="q-py-sm q-px-none"
              style="color: black;font-size: 14px"
            ><b>{{`${_.get(membershipData, ['refund_price'], 0).toLocaleString()}원`}}</b></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <member-search-popup
      ref="memberSearchPopup"
      @member="injectMemberInfo"
    />
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// mixin
import CalendarMixin from 'src/mixins/calendarMixin'
import ValidateMixin from 'src/mixins/validateMixin'
// popup
import DefaultDialog from 'components/dialog/DefaultDialog'
import MemberSearchPopup from 'components/popup/MemberSearchPopup'
export default {
  name: 'MembershipRegistPopup',
  components: {
    DefaultDialog,
    MemberSearchPopup
  },
  inject: ['$validator'],
  mixins: [CalendarMixin, ValidateMixin],
  data () {
    return {
      updateMode: false,
      // memberInfo: void 0,
      sessionInfo: void 0,
      filterConsultStaff: '',
      filterInputStaff: '',
      filterTicket: '',
      filterCard: '',
      filterProduct: '',
      availablePoint: 0, // 사용가능한 포인트
      payStateOpts: [
        { label: '미결재', value: 0 },
        { label: '결재 완료', value: 1 }
      ]
    }
  },
  computed: {
    ...mapState('ticket', [
      'membershipData'
    ]),
    ...mapState('staff', [
      'staffDataList'
    ]),
    ...mapState('defineDatas', [
      'membershipDefineDataList',  // 회원권 관리 데이터 목록
      'regPathDefineDataList'      // 등록 경로
    ]),
    ...mapState('setting', [
      'cardList'
    ]),
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
    // 회원권 목록
    sessionOpts () {
      const needle = this.filterTicket.toLowerCase()
      return _.map(this.membershipDefineDataList, o => {
        return _.assignIn(o, {
          label: o.name
        })
      }).filter((o) => {
        return o.label.toLowerCase().indexOf(needle) > -1
      })
    },
    // 상품 목록
    productOpts () {
      const needle = this.filterProduct.toLowerCase()
      const selectedSession = _.find(this.membershipDefineDataList, o => {
        return o._id === this.membershipData.sessionid
      })
      if (!selectedSession) return []
      return _.map(selectedSession.product, o => {
        const total = o.price + o.discount
        let percent = 100 - (o.price / total) * 100
        percent = percent.toPrecision(2)
        let label = `${o.month > 9 ? o.month : `0${o.month}`}개월 `
        if (o.discount > 0) {
          label += `[${o.price.toLocaleString()}원(${percent}%) = ${(selectedSession.defPrice * o.month).toLocaleString()}원 - ${o.discount.toLocaleString()}원`
        } else {
          label += `[${(selectedSession.defPrice * o.month).toLocaleString()}원`
        }
        label += ']'
        return _.assignIn(o, {
          label
        })
      }).sort((a, b) => {
        return a.label < b.label ? -1 : a.label > b.label ? 1 : 0
      }).filter((o) => {
        return o.label.toLowerCase().indexOf(needle) > -1
      })
    },
    // 등록 경로 목록
    regPathOpts () {
      return _.map(this.regPathDefineDataList, o => o.name)
    },
    // 결재 정보
    accountInfo () {
      let info = {
        title: '회원권',
        beforePrice: '0원', // 회원권 금액
        discount: '0원', // 회원권 할인 금액
        addDiscount: '0원', // 추가 할인 금액
        point: '0원', // 포인트 할인
        price: '0원'  // 회원권 가격
      }
      if (!this.membershipData.sessionid) return info
      info.title = `${this.membershipData.session}`
      info.beforePrice = `${this.membershipData.price.toLocaleString()}원`
      info.discount = `${this.membershipData.discount > 0 ? '-' : ''}${this.membershipData.discount.toLocaleString()}원`
      info.addDiscount = `${this.membershipData.addDiscount > 0 ? '-' : ''}${this.membershipData.addDiscount.toLocaleString()}원`
      info.point = `${this.membershipData.point > 0 ? '-' : ''}${this.membershipData.point.toLocaleString()}원`
      // 회원권 결재 필요 금액
      let price = Number(this.membershipData.price)
      price -= Number(this.membershipData.discount)
      price -= Number(this.membershipData.addDiscount)
      price -= Number(this.membershipData.point)
      info.price = `${price.toLocaleString()}원`
      return info
    },
    // 결재 설정 결재 금액
    calcPrice () {
      let price = 0
      price += Number(this.membershipData.cash)
      price += Number(this.membershipData.card)
      return price
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
      'reqAddTicket',
      'reqUpdateTicket',
      'reqGetTicketData'
    ]),
    ...mapMutations('ticket', [
      'initTicketData'
    ]),
    // 세션정보가 변경 될때
    onProduct (productid) {
      const session = _.find(this.sessionOpts, o => o._id === this.membershipData.sessionid)
      const product = _.find(this.productOpts, o => o.id === productid)
      if (!session || !product) return
      const { name, defPrice } = session
      const { month, discount } = product
      this.membershipData.session = `${name} ${month > 9 ? month : `0${month}`}개월`
      this.membershipData.month = month
      let currentDate = this.$moment()
      this.membershipData.sdate = currentDate.format('YYYY-MM-DD')
      this.membershipData.edate = currentDate.add(month, 'month').add(-1, 'day').format('YYYY-MM-DD')
      this.membershipData.discount = discount
      this.membershipData.defPrice = defPrice
      this.membershipData.price = defPrice * month
    },
    onStartDate () {
      let startDate = this.$moment(this.membershipData.sdate)
      this.membershipData.edate = startDate.add(this.membershipData.month, 'month').add(-1, 'day').format('YYYY-MM-DD')
    },
    // 포인트 입력 시 자동 입력 부분
    onInputPointCalc (val) {
      let price = Number(this.membershipData.price)
      price -= Number(this.membershipData.discount)
      price -= Number(this.membershipData.addDiscount)
      price -= Number(this.membershipData.point)
      if (this.membershipData.priceType === '현금+카드') {
        this.membershipData.vat = this.$vat(price)
        this.membershipData.card = price - this.membershipData.cash
      } else if (this.membershipData.priceType === '현금' || this.membershipData.priceType === '계좌이체') {
        this.membershipData.vat = this.$vat(price)
        this.membershipData.cash = price
      } else if (this.membershipData.priceType === '카드') {
        this.membershipData.vat = this.$vat(price)
        this.membershipData.card = price
      }
    },
    // 결재 유형 변경 시
    onPriceType (val) {
      this.membershipData.cardType = ''
      this.membershipData.card = 0
      this.membershipData.cash = 0
      this.membershipData.vat = 0
      const price = this.membershipData.price - (this.membershipData.discount + this.membershipData.addDiscount + this.membershipData.point)
      if (val === '카드') {
        this.membershipData.vat = this.$vat(price)
        this.membershipData.card = price
      } else if (val === '현금+카드') {
        this.membershipData.vat = this.$vat(price)
        this.membershipData.card = price
        if (!this.membershipData.cash_r && this.membershipData.phone) {
          this.membershipData.cash_r = this.membershipData.phone.split('-').join('')
        }
      } else {
        this.membershipData.vat = this.$vat(price)
        this.membershipData.cash = price
        if (!this.membershipData.cash_r && this.membershipData.phone) {
          this.membershipData.cash_r = this.membershipData.phone.split('-').join('')
        }
      }
    },
    // 회원 정보 주입
    injectMemberInfo (memberInfo) {
      this.membershipData.memberid = memberInfo._id
      this.membershipData.name = memberInfo.name
      this.membershipData.engName = memberInfo.engName
      this.membershipData.special_n = memberInfo.special_n
      this.membershipData.phone = memberInfo.phone
      this.membershipData.photo = memberInfo.photo
      this.membershipData.gender = memberInfo.gender
      this.membershipData.memberType = memberInfo.memberType
      this.availablePoint = memberInfo.point || 0
    },
    // 결재 정보 유효성 검사
    calcValidate () {
      // 결재 필요 금액
      let price = Number(this.membershipData.price)
      price -= Number(this.membershipData.discount)
      price -= Number(this.membershipData.addDiscount)
      // 결재 금액
      let cPrice = 0
      cPrice += Number(this.membershipData.cash)
      cPrice += Number(this.membershipData.card)
      cPrice += Number(this.membershipData.point)
      return price === cPrice
    },
    // 회원권 추가
    async onAdd (isContinue) {
      const reqValidate = await this.$validator.validateAll('membership')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const isCalcValid = this.calcValidate()
      if (!isCalcValid) return this.$notify.error('결제 금액이 일치하지 않습니다.')

      // 구매금
      let price = 0
      price += Number(this.membershipData.cash)
      price += Number(this.membershipData.card)
      price += Number(this.membershipData.point)
      this.membershipData.purchase = price
      // 유효 기간
      this.membershipData.sdate = this.$moment(this.membershipData.sdate).format('YYYY-MM-DD 00:00:00')
      this.membershipData.edate = this.$moment(this.membershipData.edate).format('YYYY-MM-DD 23:59:59')
      // 등록 기간
      this.membershipData.reg_d = new Date()
      try {
        const { code } = await this.reqAddTicket({ type: 'membership' })
        if (code === 'ok') {
          if (!isContinue) this.$refs.defaultDialog.hide()
          this.$emit('complete')
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    },
    // 회원권 수정
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('membership')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      const isCalcValid = this.calcValidate()
      if (!isCalcValid) return this.$notify.error('결제 금액이 일치하지 않습니다.')
      // 구매금
      let price = 0
      price += Number(this.membershipData.cash)
      price += Number(this.membershipData.card)
      price += Number(this.membershipData.point)
      this.membershipData.purchase = price
      // 유효 기간
      this.membershipData.sdate = this.$moment(this.membershipData.sdate).format('YYYY-MM-DD 00:00:00')
      this.membershipData.edate = this.$moment(this.membershipData.edate).format('YYYY-MM-DD 23:59:59')
      try {
        const { code } = await this.reqUpdateTicket({ type: 'membership' })
        if (code === 'ok') {
          this.$refs.defaultDialog.hide()
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    },
    async initData (data) {
      this.availablePoint = 0

      await Promise.all([
        this.reqGetStaffDataList(), // 스태프 목록
        this.reqGetDefineDataList({ type: 'membership' }), // 회원/수강권 조회
        this.reqGetDefineDataList({ type: 'regpath' }), // 등록 경로
        this.reqGetCard() // 카드 목록 조회
      ])
      if (!data) { // 추가
        this.updateMode = false
        this.initTicketData()
      } else { // 수정
        this.updateMode = true
        await this.reqGetTicketData({ _id: data._id, type: 'membership' })
        if (this.membershipData.pay_d) {
          this.membershipData.pay_d = this.$moment(this.membershipData.pay_d).format('YYYY-MM-DD HH:mm')
        }
      }
    },
    async show ({ ticketInfo, memberInfo } = {}) {
      await this.initData(ticketInfo)
      if (memberInfo) {
        this.injectMemberInfo(memberInfo)
      }
      this.$refs.defaultDialog.show()
    }
  }
}
</script>
