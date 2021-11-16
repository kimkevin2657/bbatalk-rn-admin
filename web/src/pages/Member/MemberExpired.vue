<template>
  <div>
    <top />
    <div class="q-pa-md">
      <!-- 서브 타이틀 -->
      <div class="row justify-between">
        <div class="col-4 text-h5">회원 만료 관리</div>
        <q-page-sticky
          position="top-right"
          :offset="[16, 16]"
        >
          <div class="col-3 q-gutter-sm">
            <q-btn
              color="brown-5"
              label="수강 등록"
            />
            <q-btn
              color="brown-5"
              label="옵션 등록"
            />
            <q-btn
              color="brown-5"
              label="회원 등록"
            />
          </div>
        </q-page-sticky>
      </div>
      <!-- 검색 조건 그리드  -->
      <div style="padding: 15px 0px; margin: 0px 0px">
        <div
          class="row q-col-gutter-none"
          style="background: rgba(255,255,255,1); border: 1px solid rgba(122,122,124,.2)"
        >
          <!-- 담당자 구분 -->
          <div
            class="col-3 condition-box"
            style="min-width: 200px;"
          >
            <q-select
              dense
              filled
              v-model="manager"
              use-input
              input-debounce="0"
              label="담당자 구분"
              :options="managerOpts"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    결과
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- 남여 구분 -->
          <div
            class="col-3 condition-box"
            style="min-width: 200px;"
          >
            <q-select
              dense
              filled
              v-model="path"
              use-input
              input-debounce="0"
              label="경로 구분"
              :options="pathOpts"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    결과
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- 등록 구분 멀티 셀렉트 -->
          <div
            class="col-6"
            style="min-width: 250px;"
          >
            <!-- <q-badge color="secondary" class="q-mb-md">
              Model: {{ modelMultiple || '[]' }}
            </q-badge> -->
            <q-select
              dense
              filled
              v-model="registMultiple"
              multiple
              :options="registOpts"
              stack-label
              label="등록 구분"
            />
          </div>
          <div class="col-2 q-pa-md form-date">
            <q-input
              dense
              filled
              v-model="startDate"
              mask="date"
              :rules="['date']"
              label="시작 일자"
            >
              <template v-slot:append>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="startDate"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-2 q-pa-md form-date">
            <q-input
              dense
              filled
              v-model="endDate"
              mask="date"
              :rules="['date']"
              label="종료 일자"
            >
              <template v-slot:append>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="endDate"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <!-- 검색 -->
          <div
            class="col"
            style="min-width: 200px;"
          >
            <q-input
              style="max-width:300px; float: right;"
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
      </div>
      <!---그리드 끝 --->
      <q-table
        :data="data"
        :columns="columns"
        no-data-label="데이터를 찾지 못하였습니다"
        row-key="name"
        :filter="filter"
        :separator='horizontal'
        class="my-sticky-column-table"
        flat
        bordered
        page
        :pagination.sync="pagination"
      >
        <template v-slot:body="props">
          <!-- <q-td key="name" :props="props">{{ props.row.name }}</q-td> -->
          <q-td
            key="name"
            :props="props"
          >
            <q-btn
              flat
              style="color: #027BE3"
            >{{ props.row.name }}</q-btn>
          </q-td>
          <q-td
            key="gender"
            :props="props"
          >{{ props.row.gender }}</q-td>
          <q-td
            key="birthday"
            :props="props"
          >
            <div class="table-birthday">
              {{ props.row.birthday }}
            </div>
          </q-td>
          <q-td
            key="member_type"
            :props="props"
          >{{ props.row.member_type }}</q-td>
          <q-td
            key="membership_type"
            :props="props"
          >
            <q-badge
              style="margin: 0px 5px"
              square
              color="amber"
            >{{ props.row.membership_type }}</q-badge>
            <q-badge
              style="margin: 0px 5px"
              square
              color="indigo"
            >남은기간 {{ props.row.membership_remain_day }}</q-badge>
            <div class="table-membership">
              <q-btn
                flat
                style="min-width: 200px; color: #027BE3; padding-left: 0px 0px"
              >{{ props.row.membership_date }}</q-btn>
            </div>
          </q-td>
          <q-td
            key="lesson_type"
            :props="props"
          >
            <q-badge
              style="margin: 0px 5px"
              square
              color="purple"
            >{{ props.row.lesson_type }}</q-badge>
            <q-badge
              style="margin: 0px 5px"
              square
              color="red"
            >남은기간 {{ props.row.lesson_remain_day }}</q-badge>
            <div class="table-membership">
              <q-btn
                flat
                style="min-width: 200px; color: #027BE3;"
              >{{ props.row.lesson_date }}</q-btn>
            </div>
          </q-td>
          <q-td
            key="option_info"
            :props="props"
          >{{ props.row.option_info }}</q-td>
          <q-td
            key="gym_experience_info"
            :props="props"
          >{{ props.row.gym_experience_info }}</q-td>
          <q-td
            key="lesson_experience_type"
            :props="props"
          >
            <q-badge
              square
              color="purple"
            >{{ props.row.lesson_experience_type }}</q-badge>
            <div class="table-membership">
              {{ props.row.lesson_experience_date }}
            </div>
          </q-td>
        </template>
        <template v-slot:bottom>
          <!-- 하단 페이지 -->
          <q-pagination
            v-model="current"
            :max="10"
            :direction-links="true"
            :boundary-links="true"
            class="q-pa-lg flex flex-center fit"
          >
          </q-pagination>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import Top from '../../layouts/component/Top'
export default {
  name: 'UserStatistics',
  components: {
    Top
  },
  data () {
    return {
      pagination: {
        rowsPerPage: 30 // current rows per page being displayed
      },
      startDate: '2019/02/01',
      endDate: '2019/10/10',
      filter: '',
      current: 1,
      registMultiple: [],
      managerOpts: ['모두', '김남욱', '김진현', '신성욱', '김정민'],
      registOpts: ['정회원(플레티넘)', '정회원(노플레스)', 'WSC(유소년)', '비회원'],
      pathOpts: ['모두', '이게 멍미', '머가들어가야하오'],
      manager: '모두',
      path: '모두',
      columns: [
        // {
        //   name: 'uuid',
        //   required: true,
        //   label: '회원명',
        //   align: 'left',
        //   field: row => row.uuid,
        //   format: val => `${val}`,
        // },
        { name: 'name', align: 'center', label: '회원명', field: 'name' },
        { name: 'gender', align: 'center', label: '성별', field: 'gender' },
        { name: 'birthday', align: 'center', label: '생년월일', field: 'birthday' },
        { name: 'member_type', align: 'center', label: '회원구분', field: 'member_type' },
        { name: 'membership_type', align: 'center', label: '회원권 내역', field: 'membership_type' },
        { name: 'lesson_type', align: 'center', label: '강습 종목', field: 'lesson_type' },
        { name: 'option_info', align: 'center', label: '옵션 종목', field: 'option_info' },
        { name: 'gym_experience_info', align: 'center', label: '시설 체험 예약', field: 'gym_experience_info' },
        { name: 'lesson_experience_type', align: 'center', label: '강습 체험 예약', field: 'lesson_experience_type' }
      ],
      data: [
        {
          name: '김남욱',
          gender: '남',
          birthday: '1987.01.01 (33세)',
          member_type: '멤버쉽 회원',
          membership_type: '플레티넘',
          membership_remain_day: '30일',
          membership_date: '2019.10.1 ~ 2019.10.30',
          lesson_type: '[P.T]',
          lesson_remain_day: '7일',
          lesson_date: '2019.10.1 ~ 2019.10.30 [외 3건]',
          option_info: '개인락커 [외 3건]',
          gym_experience_info: '2019.10.1 ~ 2019.10.30',
          lesson_experience_type: '[P.T]',
          lesson_experience_date: '2019.10.1 ~ 2019.10.30'
        }
      ]
    }
  }
}
</script>

<style lang="sass" scoped>
// .row > div
//   padding: 10px 10px
//   //border: 1px solid rgba(122,122,124,.2)
//   max-height: 60px
//   // border-collapse: collapse
// .row + .row
//   margin-top: 1rem

// .my-sticky-column-table
//   /* bg color is important for th; just specify one */
//   thead tr:first-child th:first-child
//     background-color: #ff808080
//     opacity: 1

//   td:nth-child(1),
//   td:nth-child(2),
//   td:nth-child(3),
//   td:nth-child(4),
//   td:nth-child(5),
//   td:nth-child(6),
//   td:nth-child(7),
//   td:nth-child(8),
//   td:nth-child(9),
//     background-color: #ff808080
//   // background-color: #8080ff80
//   // td:first-child,
//   // td:last-child
//   //     background-color: #ff808080
//   // td:first-child + td + td + td + td
//   //   background-color: #8080ff80

//   // td:first-child + td + td + td + td + td
//   //   background-color: #ff808080

//   thead tr:first-child th:first-child,
//   td:first-child
//     position: sticky
//     left: 0
//     z-index: 1
</style>

<style scoped lang="scss">
.sub-title {
  display: grid;
  gap: 10px;
  width: 100%;
}

.condition-right-box {
  display: grid;
  // background-color: aliceblue;
  //grid-template-columns: 80px;
}

.condition-box {
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
