<template>
  <default-dialog
    ref="defaultDialog"
    :title="updateMode ? '회원 수정' : '회원 등록'"
    :width="500"
    :height="840"
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
            label="* 회원명(국문)"
            class="col-12"
            v-model="memberData.name"
            data-vv-scope="regmember"
            v-validate="'required'"
            :error="errors.has('regmember.name')"
            :error-message="getValidateMessage('name')"
            dense
          >
            <template #after>
              <!-- 회원 프로필 사진 등록 -->
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
                  text-color="blue-grey-9"
                  icon="mdi-face"
                />
              </q-btn>
            </template>
          </q-input>
          <q-input
            label="영문"
            class="col-12"
            v-model="memberData.engName"
            dense
          >
            <template #after>
              <!-- 성별 -->
              <q-option-group
                v-model="memberData.gender"
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
            v-model="memberData.phone"
            mask="###-####-####"
            data-vv-scope="regmember"
            v-validate="'required|phone'"
            :error="errors.has('regmember.phone')"
            :error-message="getValidateMessage('phone')"
            hide-bottom-space
            dense
            @blur="updpateSecialNumber()"
          />
          <q-input
            name="special_n"
            label="* 회원 고유 번호"
            class="col-5"
            v-model="memberData.special_n"
            data-vv-scope="regmember"
            v-validate="'required'"
            :error="errors.has('regmember.special_n')"
            :error-message="getValidateMessage('special_n')"
            hide-bottom-space
            readonly
            dense
          />
          <q-input
            name="email"
            dense
            v-model="memberData.email"
            data-vv-scope="regmember"
            v-validate="'email'"
            :error="errors.has('regmember.email')"
            :error-message="getValidateMessage('email')"
            class="col-7"
            label="이메일"
          />
          <q-input
            name="birth"
            dense
            v-model="memberData.birth"
            data-vv-scope="regmember"
            v-validate="'required|date'"
            :error="errors.has('regmember.birth')"
            :error-message="getValidateMessage('birth')"
            class="col-5"
            hint="2001-01-01 형식"
            mask="####-##-##"
            label="* 생년 월일"
          >
          </q-input>
          <q-input
            label="주소"
            class="col-12"
            v-model="memberData.address_f"
            readonly
            style="margin-top: 15px;"
            hide-bottom-space
            dense
          >
            <q-tooltip v-if="memberData.address_f">{{memberData.address_f}}</q-tooltip>
            <template #after>
              <q-btn
                class="full-width"
                color="blue-grey-6"
                icon="search"
                label="주소검색"
                dense
                @click="onClickAddress"
              />
            </template>
          </q-input>
          <q-input
            label="상세 주소"
            name="name"
            class="col-12"
            v-model="memberData.address_l"
            dense
          />
          <q-select
            label="회원 분류"
            v-model="memberData.memberGroup"
            :options="memberGroupOpts"
            class="col-12"
            dense
            multiple
            clearable
            hide-bottom-space
          />
          <q-select
            label="회원 구분"
            v-model="memberData.memberType"
            :options="memberTypeOpts"
            class="col-6 q-pr-sm"
            dense
            hide-bottom-space
          />
          <q-select
            label="등록 경로"
            v-model="memberData.regPath"
            :options="regPathOpts"
            class="col-6 q-pl-sm"
            dense
            hide-bottom-space
          />
          <q-input
            :value="familyNames"
            use-input
            input-debounce="0"
            label="소속(가족)"
            class="col-12"
            icon="clear"
            hide-bottom-space
            readonly
            dense
            clearable
          >
            <template #append>
              <q-btn
                v-if="familyNames"
                icon="cancel"
                flat
                dense
                round
                @click="memberData.familys = []; memberData.familyids = []"
              />
            </template>
            <template #after>
              <q-btn
                icon="search"
                label="검색"
                color="blue-grey-6"
                dense
                @click="$refs.memberSearchPopup.show('family')"
              />
            </template>
          </q-input>
          <q-input
            label="소속(단체)"
            class="col-12"
            v-model="memberData.organization"
            hide-bottom-space
            dense
          />
          <q-input
            label="차량 번호 [앞]"
            class="col-6"
            v-model="memberData.carNumber_f"
            hide-bottom-space
            dense
          >
            <template #before>
              <q-icon name="mdi-car" />
            </template>
          </q-input>
          <q-input
            label="차량 번호 [뒤]"
            class="col-6"
            v-model="memberData.carNumber_l"
            hide-bottom-space
            dense
          />
          <q-input
            label="소개자"
            class="col-12"
            :value="memberData.recommender ? `${memberData.recommender.name} (${memberData.recommender.special_n})` : ''"
            hide-bottom-space
            dense
            readonly
          >
            <template #append>
              <q-btn
                v-if="memberData.recommender"
                icon="cancel"
                flat
                dense
                round
                @click="memberData.recommender = void 0; memberData.recommenderid = ''"
              />
            </template>
            <template #after>
              <q-btn
                icon="search"
                label="검색"
                color="blue-grey-6"
                @click="$refs.memberSearchPopup.show('recommender')"
                dense
              />
            </template>
          </q-input>
        </div>
      </div>
      <q-separator
        class="col-12"
        style="margin-bottom: 10px"
      />

      <div class="col-12">
        <q-input
          label="메모"
          v-model="memberData.regMemo"
          autogrow
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
    <!-- 가족 회원 검색 -->
    <member-search-popup
      ref="memberSearchPopup"
      @family="(val) => {
        memberData.familys.push(val)
        memberData.familyids.push(val._id)
      }"
      @recommender="(val) => {
        memberData.recommender = val
        memberData.recommenderid = val._id
      }"
    />
  </default-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DefaultDialog from 'components/dialog/DefaultDialog'
// popup
import PhotoCropperPopup from 'components/popup/PhotoCropperPopup'
import RoadPopup from 'components/popup/RoadPopup'
import MemberSearchPopup from 'components/popup/MemberSearchPopup'
// mixin
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'MemberRegistPopup',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  components: {
    DefaultDialog,
    RoadPopup,
    PhotoCropperPopup,
    MemberSearchPopup
  },
  computed: {
    ...mapState('member', [
      'genSpecialNumber',
      'memberData'
    ]),
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapState('defineDatas', [
      'memberGroupDefineDataList', // 회원 분류
      'memberTypeDefineDataList',  // 회원 구분
      'regPathDefineDataList'      // 등록 경로
    ]),
    memberGroupOpts () {
      return _.map(this.memberGroupDefineDataList, o => o.name)
    },
    memberTypeOpts () {
      return _.map(this.memberTypeDefineDataList, o => o.name)
    },
    regPathOpts () {
      return _.map(this.regPathDefineDataList, o => o.name)
    },
    familyNames () {
      const names = _.map(this.memberData.familys, (o) => `${o.name}(${o.special_n})`)
      return names.join(', ')
    }
  },
  data () {
    return {
      imageSrc: void 0,
      updateMode: false
    }
  },
  methods: {
    ...mapActions('member', [
      'reqGetMemberData',
      'reqAddMember',
      'reqUpdateMember',
      'reqSpecialNumber'
    ]),
    ...mapMutations('member', [
      'initMemberData'
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
        this.reqGetDefineDataList({ type: 'membergroup' }),
        this.reqGetDefineDataList({ type: 'membertype' }),
        this.reqGetDefineDataList({ type: 'regpath' })
      ])
      if (!data) {
        // 화면 데이터 초기화
        this.updateMode = false
        this.initMemberData()
        this.imageSrc = void 0
      } else {
        this.updateMode = true
        await this.reqGetMemberData({ _id: data._id })
        this.imageSrc = this.memberData.photo || void 0
      }
      await this.$nextTick()
      this.errors.clear()//  유효성 검사 초기화
    },
    // 회원 추가
    async onAdd (isContinue = false) {
      const reqValidate = await this.$validator.validateAll('regmember')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const { code } = await this.reqAddMember()
        if (code === 'ok') {
          if (!isContinue) {
            this.$refs.defaultDialog.hide()
          }
        }
      } catch (e) {
        this.$notify.error(e.toString())
      }
    },
    // 회원 수정
    async onEdit () {
      const reqValidate = await this.$validator.validateAll('regmember')
      if (!reqValidate) return this.$notify.error('잘못 입력 하였습니다.')
      try {
        const { code } = await this.reqUpdateMember()
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
      this.memberData.address_f = address
    },
    // 회원 번호 요청
    async updpateSecialNumber () {
      const reqValidate = await this.$validator.validate('regmember.phone')
      if (!reqValidate) return

      const { code, msg } = await this.reqSpecialNumber({
        gymid: this.gymInfo.id,
        phone: this.memberData.phone
      })
      if (code === 'ok') {
        this.memberData.special_n = this.genSpecialNumber
      } else if (code === 'err') {
        this.$notify.error(msg)
      }

      return code
    },
    // 편집 팝업 띄우기
    photoRegist (evt) {
      const file = _.get(evt, ['target', 'files', 0])
      this.$refs.photoCropperPopup.show(file)
    },
    // 사진 편집으로 받아온 데이터를 저장
    async onCropedImage (dataUrl) {
      const compressDataUrl = await this.compress(dataUrl)
      this.imageSrc = compressDataUrl
      this.memberData.photo = this.imageSrc
      this.$refs.photoUploader.value = ''
    },
    // 사진 압축
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
