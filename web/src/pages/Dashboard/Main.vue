<template>
  <div>
    <top />
    <div class="q-pa-md">
      <!-- 서브 타이틀 -->
      <div class="row justify-between">
        <div class="col-12 text-h5">회원 설정 데이터</div>
      </div>
      <!-- 검색 조건 그리드  -->
      <div style="padding: 15px 0px; margin: 0px 0px">
        <div class="row q-col-gutter-none" style="background: rgba(255,255,255,1); border: 1px solid rgba(122,122,124,.2)">
          <!-- 담당자 구분 -->
          <div class="col-2 condition-box" style="min-width: 200px;">
            <q-select
              dense
              filled
              v-model="memberType"
              use-input
              input-debounce="0"
              label="회원 구분"
              :options="memberTypeOpts"
            >
            </q-select>
          </div>
          <!-- 남여 구분 -->
          <div class="col-2 condition-box" style="min-width: 200px;">
            <q-select
              dense
              filled
              v-model="memberRank"
              use-input
              input-debounce="0"
              label="회원 등급"
              :options="memberRankOpts"
            >
            </q-select>
          </div>
          <div class="col-2" style="min-width: 200px;" >
            <q-select
              dense
              filled
              v-model="memberGroup"
              :options="memberGroupOpts"
              label="회원 분류"
            />
          </div>
          <div class="col-2" style="min-width: 200px;" >
            <q-select
              dense
              filled
              v-model="regType"
              :options="regTypeOpts"
              label="등록 구분"
            />
          </div>
          <div class="col-2" style="min-width: 200px;" >
            <q-select
              dense
              filled
              v-model="regPath"
              :options="regPathOpts"
              label="등록 경로"
            />
          </div>
          <div class="col-2" style="min-width: 200px;" >
            <q-select
              dense
              filled
              v-model="marketingPath"
              :options="marketingPathOpts"
              label="마케팅 경로"
            />
          </div>
        </div>
      </div>

      <!-- 서브 타이틀 -->
      <div class="row justify-between">
        <div class="col-12 text-h5">수강 설정 데이터</div>
      </div>
      <!-- 검색 조건 그리드  -->
      <div style="padding: 15px 0px; margin: 0px 0px">
        <div class="row q-col-gutter-none" style="background: rgba(255,255,255,1); border: 1px solid rgba(122,122,124,.2)">
          <div class="col-12 text-h6">종속 선택 방식</div>
          <!-- 담당자 구분 -->
          <div class="col-2 condition-box" style="min-width: 200px;">
            <q-select
              dense
              filled
              v-model="lessonType"
              input-debounce="0"
              label="수강 구분"
              :options="lessonTypeOpts"
              @input="onLessonTypeClick"
            >
            </q-select>
          </div>
          <div class="col-2 condition-box" style="min-width: 200px;">
            <q-select
              dense
              filled
              v-model="lesson"
              input-debounce="0"
              label="수강명"
              :options="lessonOpts"
              @input="onLessonClick"
            >
            </q-select>
          </div>
          <div class="col-2" style="min-width: 200px;" >
            <p v-if="lessonType === '정회원'">
              <q-select
                dense
                filled
                disable
                v-model="peopleCount"
                label="정원"
              />
            </p>
            <p v-else>
              <q-select
                dense
                filled
                v-model="peopleCount"
                :options="peopleCountOpts"
                label="정원"
                @input="onPeopleCountClick"
              />
            </p>
          </div>
          <div class="col-2" style="min-width: 200px;" >
            <q-select
              dense
              filled
              v-model="lessonNumber"
              :options="lessonNumberOpts"
              label="횟수/기간"
              @input="onLessonNumberClick"
            />
          </div>
          <div class="col-4" style="min-width: 200px;" >
            가격 : {{ priceDesc }}
          </div>
          <div class="col-12 text-h6">일괄 선택 방식</div>
          <div class="col-12" style="min-width: 200px;" >
            <q-select
              dense
              filled
              v-model="selectLesson"
              :options="allLessonOpts"
              label="강습 선택"
            />
          </div>
          <div class="col-12" style="min-width: 200px;" >
            <q-select
              dense
              filled
              v-model="selectLesson"
              :options="filterOptions"
              @filter="(val, update) => { filterFn(val, update, '강습', '수영') }"
              label="수영 강습 선택 (특정 강습만 나오게)"
            />
          </div>
        </div>
      </div>

      <div class="row justify-between">
        <div class="col-12 text-h5">직원 설정 데이터</div>
      </div>
      <!-- 검색 조건 그리드  -->
      <div style="padding: 15px 0px; margin: 0px 0px">
        <div class="row q-col-gutter-none" style="background: rgba(255,255,255,1); border: 1px solid rgba(122,122,124,.2)">
          <!-- 담당자 구분 -->
          <div class="col-2 condition-box" style="min-width: 200px;">
            <q-select
              dense
              filled
              v-model="department"
              use-input
              input-debounce="0"
              label="부서 구분"
              :options="departmentOpts"
            >
            </q-select>
          </div>
          <!-- 남여 구분 -->
          <div class="col-2 condition-box" style="min-width: 200px;">
            <q-select
              dense
              filled
              v-model="rank"
              use-input
              input-debounce="0"
              label="직급 구분"
              :options="rankOpts"
            >
            </q-select>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Top from '../../layouts/component/Top'
export default {
  name: 'main',
  components: {
    Top
  },
  computed: {
    ...mapState('defineDatas', [
      'memberDefineDataList',
      'lessonDefineDataList'
    ]),
    ...mapState('auth', [
      'gymInfo'
    ]),
    ...mapGetters('defineDatas', [
      'memberTypeOpts',
      'memberRankOpts',
      'memberGroupOpts',
      'regTypeOpts',
      'regPathOpts',
      'marketingPathOpts',
      'lessonTypeOpts',
      'allLessonOpts',
      'departmentOpts',
      'rankOpts'
    ])
  },
  async mounted () {
    // 회원 구분 정보 가져오기
    await this.reqGetDefineDataList({
      gymid: this.gymInfo.id,
      type: 'member'
    })

    // 수강 정보 데이터 가져오기
    await this.reqGetDefineDataList({
      gymid: this.gymInfo.id,
      type: 'lesson'
    })

    // 강사 관리 데이터 가져오기
    await this.reqGetDefineDataList({
      gymid: this.gymInfo.id,
      type: 'staff'
    })
  },
  methods: {
    ...mapActions('defineDatas', [
      'reqGetDefineDataList'
    ]),
    onLessonTypeClick (lessonType) {
      this.lesson = ''
      this.peopleCount = ''
      this.lessonNumber = ''

      this.lessonOpts = []
      this.peopleCountOpts = []
      this.lessonNumberOpts = []

      var dataList = _.cloneDeep(this.lessonDefineDataList)
      dataList.splice(0, 1)
      _.forEach(dataList, (data) => {
        if (data.lessonType === lessonType) {
          this.lessonOpts.push(data.lesson)
        }
      })
    },
    onLessonClick (lesson) {
      this.peopleCount = ''
      this.lessonNumber = ''

      this.peopleCountOpts = []
      this.lessonNumberOpts = []

      var dataList = _.cloneDeep(this.lessonDefineDataList)
      dataList.splice(0, 1)
      let target = _.find(dataList, (o) => {
        return o.lessonType === this.lessonType && o.lesson === this.lesson
      })

      // 정원 데이터 셋팅
      _.forEach(target.peopleCountList, (data) => {
        this.peopleCountOpts.push(data.peopleCount)
      })

      // 정회원일때만
      // 횟수/기간 데이터 셋팅
      if (this.lessonType === '정회원') {
        _.forEach(target.priceData.priceList, (data) => {
          this.lessonNumberOpts.push(data.month + ' 개월')
        })
      }
    },
    onPeopleCountClick (peopleCount) {
      this.lessonNumber = ''
      this.lessonNumberOpts = []

      var dataList = _.cloneDeep(this.lessonDefineDataList)
      dataList.splice(0, 1)
      let target = _.find(dataList, (o) => {
        return o.lessonType === this.lessonType && o.lesson === this.lesson
      })

      _.forEach(target.priceData.priceList, (data) => {
        if (data.peopleCount === peopleCount) {
          this.lessonNumberOpts.push(data.lessonNumber + ' 회 (' + data.month + ' 개월)')
        }
      })
    },
    onLessonNumberClick (lessonNumber) {
      var dataList = _.cloneDeep(this.lessonDefineDataList)
      dataList.splice(0, 1)
      let target = _.find(dataList, (o) => {
        return o.lessonType === this.lessonType && o.lesson === this.lesson
      })
      if (this.lessonType === '정회원') {
        let targetPrice = _.find(target.priceData.priceList, (o) => {
          return o.month === Number(this.lessonNumber.split(' ')[0])
        })
        this.priceDesc = targetPrice.price
      } else {
        let targetPrice = _.find(target.priceData.priceList, (o) => {
          return o.peopleCount === this.peopleCount && o.lessonNumber === this.lessonNumber.split(' ')[0]
        })
        this.priceDesc = targetPrice.price
      }
    },
    filterFn (val, update, lessonType, lesson) {
      update(() => {
        this.filterOptions = this.allLessonOpts.filter(
          v => v.lessonType.indexOf(lessonType) > -1 && v.lesson.indexOf(lesson) > -1
        )
      })
    }
  },
  data () {
    return {
      // 회원 설정 데이터
      memberType: '',
      memberRank: '',
      memberGroup: '',
      regType: '',
      regPath: '',
      marketingPath: '',

      // 수강 설정 데이터
      lessonType: '',
      lesson: '',
      peopleCount: '',
      lessonNumber: '',

      priceDesc: '',

      // 일괄 방식
      selectLesson: '',

      lessonOpts: [],
      peopleCountOpts: [],
      lessonNumberOpts: [],

      // 직원
      department: '',
      rank: '',

      filterOptions: this.allLessonOpts
    }
  }
}
</script>

<style lang="sass" scoped>
.row > div
  padding: 10px 10px
  //border: 1px solid rgba(122,122,124,.2)
  max-height: 60px
  // border-collapse: collapse
.row + .row
  margin-top: 1rem
</style>

<style scoped lang="scss">
.sub-title {
  display:grid;
  gap: 10px;
  width:100%;
}

.condition-right-box
{
  display:grid;
  // background-color: aliceblue;
  //grid-template-columns: 80px;
}

.condition-box
{
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

</style>
