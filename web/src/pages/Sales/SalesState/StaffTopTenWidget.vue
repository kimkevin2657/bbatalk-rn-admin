<template>
  <div>
    <q-card
      class="widget"
      style="height:100%; overflow: hidden"
    >
      <q-card-section>
        <div class="widget-title">{{title}}</div>
      </q-card-section>
      <div style="height:10px;">
        <q-linear-progress
          indeterminate
          color="blue-grey"
          v-if="isLoading"
        />
      </div>
      <q-card-section style="height:100%;">
        <q-scroll-area style="height:100%;">
          <!-- 테이블 -->
          <q-table
            :data="staffTopTenDataList"
            :columns="columns"
            :pagination="{rowsPerPage: 10}"
            no-data-label="데이터를 찾지 못하였습니다."
            dense
            flat
          >
            <!-- 이름 템플릿 -->
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <q-item dense>
                  <q-item-section avatar>
                    <q-avatar
                      size="27px"
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
                      @click.stop="onClickDetailStaff(props.row._id)"
                    > {{props.value}}</div>
                  </q-item-section>
                </q-item>
              </q-td>
            </template>
            <!-- table bottom -->
            <template #bottom />
          </q-table>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'StaffTopTenWidget',
  props: {
    title: {
      type: String,
      default: '실적 상위 강사 Top10'
    }
  },
  mounted () {
    this.refresh()
  },
  data () {
    return {
      columns: [
        {
          name: 'name',
          align: 'left',
          label: '강사명',
          field: 'name',
          format: (val, row) => {
            let name = val
            if (row.engName) name += ` (${row.special_n}, ${row.engName})`
            else name += ` (${row.special_n})`
            return name
          }
        },
        {
          name: 'price',
          align: 'right',
          label: '실적금',
          field: 'price',
          format: (val) => {
            if (val) return `${val.toLocaleString()}원`
            return '0원'
          }
        }
      ],
      isLoading: false
    }
  },
  computed: {
    ...mapState('salesState', [
      'staffTopTenDataList'
    ])
  },
  methods: {
    ...mapActions('staff', [
      'reqGetStaffData' // 회원 상세 정보 가져오기
    ]),
    ...mapActions('salesState', [
      'getStaffTopTenWidget'
    ]),
    getFace (gender) {
      if (gender === 'woman') return 'mdi-face-woman'
      return 'mdi-face'
    },
    getFaceColor (gender) {
      if (gender === 'man') return 'primary'
      if (gender === 'woman') return 'negative'
      return 'black'
    },
    // 강사 프로필 상세 페이지로 이동
    async onClickDetailStaff (staffid) {
      // 강사 상세 정보 가져오기
      await this.reqGetStaffData({ _id: staffid })
      // 강사 상세 페이지로 이동
      this.$router.push('/manager/staff/StaffDetail')
    },
    async refresh () {
      this.isLoading = true
      await this.getStaffTopTenWidget()
      await this.$sleep(1000)
      this.isLoading = false
    }
  }
}
</script>
