<template>
  <default-dialog
    ref="defaultDialog"
    :title="updateMode ? '강사 수정' : '강사 등록'"
    :width=500
    :height=950
    :useButtons="updateMode ? ['cancel', 'edit'] : ['continue', 'cancel', 'confirm']"
    @confirm="onAdd()"
    @edit="onEdit()"
    @continue="onAdd(true)"
  >

    <div
      class="row"
      style="margin: 0px;"
    >
      <div class="column col-12">
        <div class="row">
          <q-input
            name="name"
            label="* 강사명(국문)"
            class="col-12"
            v-model="staffData.name"
            data-vv-scope="regstaff"
            v-validate="'required'"
            :error="errors.has('regstaff.name')"
            :error-message="getValidateMessage('name')"
            dense
          >
            <template #after>
              <!-- 강사 프로필 사진 등록 -->
              <q-btn
                flat
                round
                @click="$refs.photoUploader.click()"
              >
                <q-avatar
                  v-if="imageSrc"
                  size="50px"
                >
                  <img :src="imageSrc" />
                </q-avatar>
                <q-avatar
                  v-else
                  size="50px"
                  text-color="blue-gray-9"
                  icon="mdi-face"
                />
              </q-btn>
            </template>
          </q-input>
          <q-input
            label="영문"
            class="col-12"
            v-model="staffData.engName"
            dense
          >
            <template #after>
              <!-- 성별 -->
              <q-option-group
                v-model="staffData.gender"
                :options="[{label: '남', value: 'man'}, {label: '여', value: 'woman'}]"
                color="primary"
                inline
                style="font-size: 14px"
                dense
              />
            </template>
          </q-input>
          <q-input
            name="phone"
            label="* 연락처"
            class="col-7"
            v-model="staffData.phone"
            mask="###-####-####"
            data-vv-scope="regstaff"
            v-validate="'required|phone'"
            :error="errors.has('regstaff.phone')"
            :error-message="getValidateMessage('phone')"
            dense
            @blur="updpateSecialNumber()"
          />
          <q-input
            name="special_n"
            label="* 강사 고유 번호"
            class="col-5"
            v-model="staffData.special_n"
            data-vv-scope="regstaff"
            v-validate="'required'"
            :error="errors.has('regstaff.special_n')"
            :error-message="getValidateMessage('special_n')"
            readonly
            dense
          />
          <q-input
            name="email"
            label="이메일"
            v-model="staffData.email"
            data-vv-scope="regstaff"
            v-validate="'email'"
            :error="errors.has('regstaff.email')"
            :error-message="getValidateMessage('email')"
            class="col-7"
            dense
          />

          <q-input
            name="birth"
            dense
            v-model="staffData.birth"
            data-vv-scope="regstaff"
            v-validate="'required|date'"
            :error="errors.has('regstaff.birth')"
            :error-message="getValidateMessage('birth')"
            class="col-5"
            hint="2001-01-01 형식"
            mask="####-##-##"
            label="* 생년 월일"
          />
          <q-input
            label="주소"
            class="col-12"
            v-model="staffData.address_f"
            readonly
            style="margin-top: 15px;"
            dense
          >
            <q-tooltip v-if="staffData.address_f">{{staffData.address_f}}</q-tooltip>
            <template #after>
              <q-btn
                class="full-width"
                color="blue-grey-6"
                label="주소검색"
                icon="search"
                dense
                @click="onClickAddress"
              />
            </template>
          </q-input>
          <q-input
            label="상세 주소"
            name="name"
            class="col-12"
            v-model="staffData.address_l"
            dense
          />
          <q-select
            name="team"
            v-model="staffData.team"
            :options="teamOpts"
            label="* 소속 부서"
            class="col-6"
            data-vv-scope="regstaff"
            v-validate="'required'"
            :error="errors.has('regstaff.team')"
            :error-message="getValidateMessage('team')"
            dense
          />
          <q-select
            name="level"
            v-model="staffData.level"
            :options="rankOpts"
            label="* 직급"
            class="col-6"
            data-vv-scope="regstaff"
            v-validate="'required'"
            :error="errors.has('regstaff.level')"
            :error-message="getValidateMessage('level')"
            dense
          />
          <q-select
            label="선임 강사"
            name="seniorid"
            v-model="staffData.seniorid"
            :options="staffOpts"
            class="col-12"
            option-value="_id"
            option-label="label"
            emit-value
            map-options
            input-debounce="0"
            @filter="(val, update) => { filterStaff = val; update() }"
            hide-selected
            use-input
            fill-input
            clearable
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
          <div class="col-12">
            <q-checkbox
              v-model="staffData.isOperation"
              left-label
              style="float: right; margin-bottom: 0px;"
              dense
              label="운영 권한"
            />
            <q-checkbox
              v-model="staffData.isLeave"
              left-label
              style="float: right"
              dense
              label="퇴사 여부"
            />
          </div>
          <!-- 경력 정보 부분 -->
          <div class="col-12 q-mt-md">
            <b>경력 정보</b>
          </div>

          <q-input
            label="학력/경력"
            v-model="staffData.career"
            autogrow
            outlined
            type="textarea"
            class="col-12"
            @focus="onFocusCareer"
          />

          <q-input
            label="자격 사항"
            v-model="staffData.certificate"
            autogrow
            outlined
            type="textarea"
            class="col-12"
            @focus="onFocusCertificate"
          />
          <!-- SNS 정보 -->
          <div class="col-12 q-mt-md">
            <b>SNS 정보</b>
          </div>
          <q-input
            label="Youtube ID"
            class="col-12"
            v-model="staffData.youtubeid"
            dense
          >
            <template #before>
              <q-icon
                name="mdi-youtube"
                color="red"
              />
            </template>
          </q-input>
          <q-input
            label="Instargram ID"
            class="col-12"
            v-model="staffData.instarid"
            dense
          >
            <template #before>
              <q-icon name="mdi-instagram" />
            </template>
          </q-input>
          <q-input
            label="Facebook ID"
            class="col-12"
            v-model="staffData.facebookid"
            dense
          >
            <template #before>
              <q-icon
                name="mdi-facebook"
                color="blue"
              />
            </template>
          </q-input>
          <q-input
            label="홈페이지"
            class="col-12"
            v-model="staffData.homepage"
            dense
          >
            <template #before>
              <q-icon name="mdi-home" />
            </template>
          </q-input>
          <q-input
            label="블로그"
            class="col-12"
            v-model="staffData.blog"
            dense
          >
            <template #before>
              <q-icon
                name="mdi-blogger"
                color="teal"
              />
            </template>
          </q-input>
          <!-- 급여 정보 -->
          <div class="col-12 q-mt-md">
            <b>급여 정보</b>
          </div>
          <q-input
            name="bankName"
            label="* 은행명"
            class="col-6"
            v-model="staffData.bank_n"
            data-vv-scope="regstaff"
            v-validate="'required'"
            :error="errors.has('regstaff.bankName')"
            :error-message="getValidateMessage('bankName')"
            dense
          />
          <q-input
            name="accountName"
            label="* 예금주"
            class="col-6"
            v-model="staffData.account_h"
            data-vv-scope="regstaff"
            v-validate="'required'"
            :error="errors.has('regstaff.accountName')"
            :error-message="getValidateMessage('accountName')"
            dense
          />
          <q-input
            name="accountNumber"
            label="* 계좌 번호"
            class="col-12"
            v-model="staffData.account_n"
            data-vv-scope="regstaff"
            v-validate="'required'"
            :error="errors.has('regstaff.accountNumber')"
            :error-message="getValidateMessage('accountNumber')"
            dense
          />
        </div>
      </div>
      <q-separator
        class="col-12"
        style="margin-bottom: 10px"
      />

      <div class="col-12">
        <q-input
          label="메모"
          v-model="staffData.memo"
          style="height: 100px;"
          outlined
          type="textarea"
        />
      </div>
    </div>
    <!-- 사진 업로드 전용 -->
    <input
      ref="photoUploader"
      type="file"
      @input="photoRegist"
      style="display: none"
    />
    <!-- 사진 편집 팝업 -->
    <photo-cropper-popup
      ref="photoCropperPopup"
      @cropImage="onCropedImage"
      @reset="$refs.photoUploader.value = ''"
    />
    <!-- 주소 정보 가져오는 팝업 -->
    <road-popup
      ref="roadPopup"
      @complete="onInjectAddress"
    />
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DefaultDialog from '../../components/dialog/DefaultDialog'
// popup
import PhotoCropperPopup from '../../components/popup/PhotoCropperPopup'
import RoadPopup from '../../components/popup/RoadPopup'
// mixin
import ValidateMixin from '../../mixins/validateMixin'
export default {
  name: 'StaffRegistPopup',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  components: {
    DefaultDialog,
    RoadPopup,
    PhotoCropperPopup
  },
  computed: {
    ...mapState('staff', [
      'genSpecialNumber',
      'staffData',
      'staffDataList'
    ]),
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('defineDatas', [
      'departmentDefineDataList',
      'rankDefineDataList'
    ]),
    teamOpts () {
      return _.map(this.departmentDefineDataList, o => {
        return o.name
      })
    },
    rankOpts () {
      return _.map(this.rankDefineDataList, o => {
        return o.name
      })
    },
    staffOpts () {
      const needle = this.filterStaff.toLowerCase()
      return _.map(this.staffDataList, (staff) => {
        const team = staff.team ? `${staff.team} ` : ''
        return _.assignIn(staff, { label: `${team}${staff.name}(${staff.special_n})` })
      }).filter(o => {
        return o.label.toLowerCase().indexOf(needle) > -1
      })
    }
  },
  /*
    // 제거 예정 --> 변경하기

    searchDepartmentOpts () {
      var opts = ['부서 선택']
      _.forEach(this.departmentDefineDataList, (option) => {
        opts.push(option.name)
      })
      return opts
    },
    searchRankOpts () {
      var opts = ['직급 선택']
      _.forEach(this.rankDefineDataList, (option) => {
        opts.push(option.name)
      })
      return opts
    }
  },
  */
  data () {
    return {
      imageSrc: void 0,
      updateMode: false,
      filterStaff: ''
    }
  },
  methods: {
    ...mapActions('staff', [
      'reqGetStaffData',
      'reqAddStaff',
      'reqUpdateStaff',
      'reqSpecialNumber'
    ]),
    ...mapMutations('staff', [
      'initStaffData'
    ]),
    ...mapActions('defineDatas', [
      'reqGetDefineDataList'
    ]),
    show (data) {
      this.initData(data)
      this.$refs.defaultDialog.show()
    },
    // 초기화
    async initData (data) {
      await Promise.all([
        this.reqGetDefineDataList({ type: 'department' }),
        this.reqGetDefineDataList({ type: 'rank' })
      ])
      if (!data) {
        // 화면 데이터 초기화
        this.updateMode = false
        this.initStaffData()
        this.imageSrc = void 0
      } else {
        this.updateMode = true
        await this.reqGetStaffData({ _id: data._id })
        this.imageSrc = this.staffData.photo || void 0
      }
      await this.$nextTick()
      this.errors.clear()//  유효성 검사 초기화
    },
    // 강사 추가
    async onAdd (isContinue = false) {
      const reqValidate = await this.$validator.validateAll('regstaff')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const { code } = await this.reqAddStaff(this.staffData)
        if (code === 'ok') {
          if (!isContinue) {
            this.$refs.defaultDialog.hide()
          }
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    },
    // 강사 수정
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('regstaff')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const { code } = await this.reqUpdateStaff()
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
      this.staffData.address_f = address
    },
    // 강사 번호 요청
    async updpateSecialNumber () {
      const reqValidate = await this.$validator.validate('regstaff.phone')
      if (!reqValidate) return

      const { code, msg, result } = await this.reqSpecialNumber({
        gymid: this.gymInfo.id,
        phone: this.staffData.phone
      })
      if (code === 'ok') {
        this.staffData.special_n = result
        // this.$notify.info('수정 되었습니다.')
      } else if (code === 'err') {
        this.$notify.error(msg)
      }

      return code
    },
    // 사진 편집 팝업 띄우기
    photoRegist (evt) {
      const file = _.get(evt, ['target', 'files', 0])
      this.$refs.photoCropperPopup.show(file)
    },
    // 사진 편집으로 받아온 데이터를 저장
    async onCropedImage (dataUrl) {
      // 압축 하기
      const compressDataUrl = await this.compress(dataUrl)
      this.imageSrc = compressDataUrl
      this.staffData.photo = this.imageSrc
      this.$refs.photoUploader.value = ''
    },
    compress (dataUrl) {
      return new Promise((resolve, reject) => {
        const width = 200
        const height = 200
        const img = new Image()
        img.src = dataUrl
        img.onload = () => {
          const elem = document.createElement('canvas')
          elem.width = width
          elem.height = height
          const ctx = elem.getContext('2d')
          // img.width and img.height will contain the original dimensions
          ctx.drawImage(img, 0, 0, width, height)
          resolve(ctx.canvas.toDataURL())
        }
      })
    },
    onFocusCareer () {
      if (!this.staffData.career) {
        const strArr = [
          '[학력]',
          ' - 대학교: OOO대학교, 기간: 2012-03 ~ 2015-02 (4년)',
          '[경력]',
          ' - 직장: OOO, 기간: 2015-03 ~ 2020-01 (5년 10개월)'
        ]
        this.staffData.career = strArr.join('\n')
      }
    },
    onFocusCertificate () {
      if (!this.staffData.certificate) {
        const strArr = [
          '[면허]',
          ' - 자격증: OOOOOO, 자격 번호: 1234-1234, 취득일: 2020-01-01'
        ]
        this.staffData.certificate = strArr.join('\n')
      }
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
