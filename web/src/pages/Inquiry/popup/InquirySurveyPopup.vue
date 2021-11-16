<template>
  <default-dialog
    ref="defaultDialog"
    :title="updateMode ? '문의 수정' : '문의 등록'"
    :width="500"
    :height="690"
    :useButtons="updateMode ? ['cancel', 'edit'] : ['continue', 'cancel', 'confirm']"
    @confirm="onAdd()"
    @edit="onEdit()"
    @continue="onAdd(true)"
  >
    <div class="q-pa-md row items-start q-gutter-md">
      <div
        class="row form-row condition-box"
        style="padding: 10px 5px 0px 5px"
      >
        <q-input
          label="지역명(동/리)"
          class="col-12"
          v-model="inquiryData.address"
          readonly
          style="margin-top: 15px;"
          dense
        >
          <q-tooltip v-if="inquiryData.address">{{inquiryData.address}}</q-tooltip>
          <template #after>
            <q-btn
              class="full-width"
              color="blue-grey-6"
              icon="search"
              label="지역명(동/리) 검색"
              dense
              @click="onClickAddress"
            />
          </template>
        </q-input>
        <q-select
          label="* 주변 센터 찾기"
          class="col-md-6 col-sm-12"
          v-model="inquiryData.centerList"
          dense
          hide-bottom-space
        />
        <q-input
          name="name"
          label="* 성함"
          class="col-md-9 col-sm-10"
          v-model="inquiryData.name"
          data-vv-scope="reginquiry"
          v-validate="'required'"
          :error="errors.has('reginquiry.name')"
          :error-message="getValidateMessage('name')"
          dense
        >
        </q-input>
        <!--성별-->
        <q-option-group
          v-model="inquiryData.gender"
          :options="[{label: '남', value: 'man'}, {label: '여', value: 'woman'}]"
          class="col-md-3 col-sm-2"
          color="primary"
          inline
          dense
        />
        <q-input
          name="phone"
          label="* 연락처"
          class="col-md-12 col-sm-12"
          v-model="inquiryData.phone"
          mask="###-####-####"
          data-vv-scope="reginquiry"
          v-validate="'required'"
          :error="errors.has('reginquiry.phone')"
          :error-message="getValidateMessage('phone')"
          dense
        />
        <q-select
          class="col-md-12 col-sm-12"
          dense
          v-model="inquiryData.membershipType"
          label="* 관심 회원권 구분"
        />
        <q-select
          class="col-md-12 col-sm-12"
          dense
          v-model="inquiryData.lessonType"
          label="* 관심 강습 구분"
        />
        <q-select
          class="col-md-12 col-sm-12"
          dense
          v-model="inquiryData.marketingPath"
          label="* 마케팅 경로 구분"
        />
        <q-card-section>
          <div class="contact-grid-rows">시설 체험 쿠폰 요청 *</div>
          <div
            class="contact-grid-inputrows"
            style="max-width: 390px"
          >
            <!-- 시설 체험 쿠폰 선택 -->
            <div class="q-gutter-sm">
              <q-radio
                v-model="inquiryData.facilityCoupon"
                val="request"
                label="요청"
              />
              <q-radio
                v-model="inquiryData.facilityCoupon"
                val="notrequest"
                label="요청 안함"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="contact-grid-rows">강습 체험 쿠폰 요청 *</div>
          <div
            class="contact-grid-inputrows"
            style="max-width: 390px"
          >
            <!-- 강습 체험 쿠폰 선택 -->
            <div class="q-gutter-sm">
              <q-radio
                v-model="inquiryData.lessonCoupon"
                val="request"
                label="요청"
              />
              <q-radio
                v-model="inquiryData.lessonCoupon"
                val="notrequest"
                label="요청 안함"
              />
            </div>
          </div>
          <div class="contact-section" />
        </q-card-section>
      </div>
    </div>
    <!-- 주소 정보 가져오는 팝업 -->
    <road-popup
      ref="roadPopup"
      @complete="onInjectAddress"
    />
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DefaultDialog from '../../../components/dialog/DefaultDialog'
import RoadPopup from '../../../components/popup/RoadPopup'
import ValidateMixin from '../../../mixins/validateMixin'
export default {
  name: 'InquirySurveyPopup',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  components: {
    RoadPopup,
    DefaultDialog
  },
  computed: {
    ...mapState('inquiry', [
      'inquiryData'
    ]),
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('defineDatas', [
      'membershipDefineDataList',
      'lessonDefineDataList'
    ])
  },
  data () {
    return {
      imageSrc: 'https://europamediatrainings.com/assets/content/users/no-avatar.png',
      updateMode: false,
      testInput: ''
    }
  },
  methods: {
    ...mapActions('inquiry', [
      'reqGetInquiryData',
      'regAddInquiry',
      'reqUpdateInquiry'
    ]),
    ...mapMutations('inquiry', [
      'initInquiryData'
    ]),
    show (data) {
      this.initData(data)
      this.$refs.defaultDialog.show()
    },
    // 초기화
    async initData (data) {
      if (!data) {
        // 화면 데이터 초기화
        this.updateMode = false
        this.initInquiryData()
      } else {
        this.updateMode = true
        await this.reqGetInquiryData({ _id: data._id })
      }
    },
    // 문의 추가
    async onAdd (isContinue = false) {
      const reqValidate = await this.$validator.validateAll('reginquiry')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const { code } = await this.reqAddInquiry()
        if (code === 'ok') {
          if (!isContinue) {
            this.$refs.defaultDialog.hide()
          }
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    },
    // 문의 수정
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('reginquiry')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const { code } = await this.reqUpdateInquiry()
        if (code === 'ok') {
          this.$refs.defaultDialog.hide()
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    },
    // 주소 검색 팝업 출력
    onClickAddress () {
      this.$refs.roadPopup.show()
    },
    // 주소 검색 결과 삽입
    onInjectAddress (data) {
      let address = data.address
      if (_.has(data, 'buildingName')) {
        address += `(${data.buildingName})`
      }
      this.inquiryData.address = address
    }
  }
}
</script>

<style scoped>
.form-date {
  max-height: 60px;
  padding-top: 0px;
  margin-top: 0px;
}
</style>

<style lang="sass" scoped>
.row
  margin: 0px 0px 10px 0px
  padding: 0px 5px 0px 5px
</style>
