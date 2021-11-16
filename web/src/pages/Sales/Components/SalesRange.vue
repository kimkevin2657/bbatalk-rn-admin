<template>
  <div>
    <q-card>
      <q-card-section class="q-pb-none row">
        <search-button
          mode="time"
          position="left"
          :from="stateData.from"
          :to="stateData.to"
          @search="search"
        />
        <q-space />
        <span
          style="align-self: center"
          class="q-mr-md"
        >총 {{listCnt}}개가 검색되었습니다. </span>
      </q-card-section>
      <div style="height:10px;">
        <q-linear-progress
          indeterminate
          color="blue-grey"
          v-if="isLoading"
        />
      </div>
      <q-card-section class="q-py-none">
        <apexchart
          ref="chart"
          type="area"
          :options="options"
          :series="salesData.series"
          height="150"
        ></apexchart>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import apexOpts from 'src/config/apex.json'
import SearchButton from 'src/components/button/SearchButton'
export default {
  name: 'SalesRange',
  components: {
    SearchButton
  },
  props: {
    type: {
      type: String,
      default: 'membership'
    }
  },
  async mounted () {
    await this.refresh(true)
  },
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState('salesDetail', [
      'stateData',
      'membershipSalesData',
      'lessonSalesData',
      'listCnt'
    ]),
    options () {
      return {
        chart: {
          toolbar: {
            show: false,
            autoSelected: 'zoom'
          },
          selection: {
            enabled: true,
            type: 'x'
          },
          events: {
            zoomed: this.zoomed
          },
          defaultLocale: 'ko',
          locales: apexOpts.locales
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: 'datetime',
          categories: this.salesData.category,
          labels: {
            datetimeUTC: false,
            datetimeFormatter: {
              year: 'yyyy년',
              month: "'yy년 MM월",
              day: 'MM월 dd일',
              hour: 'HH:mm'
            }
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => { return value }
          }
        },
        tooltip: {
          x: {
            show: true,
            format: 'yy년 MM월 dd일',
            formatter: this.tooltipFormat
          },
          y: {
            // title: {
            //   formatter: (seriesName) => `회원권`
            // }
          },
          fixed: {
            enabled: true,
            position: 'topRight', // topRight, topLeft, bottomRight, bottomLeft
            offsetY: -27,
            offsetX: 5
          }
        }
      }
    },
    salesData () {
      return this.type === 'membership' ? this.membershipSalesData : this.lessonSalesData
    }
  },
  methods: {
    ...mapActions('salesDetail', [
      'reqGetSalesMember',
      'reqGetSalesLesson'
    ]),
    ...mapMutations('salesDetail', [
      'setStateData'
    ]),
    async zoomed (chartContext, { xaxis, yaxis }) {
      const from = this.$moment(xaxis.min).format('YYYY-MM-DD HH:mm:ss')
      const to = this.$moment(xaxis.max).format('YYYY-MM-DD HH:mm:ss')
      this.setStateData({ from, to })
      await this.refresh()
    },
    async search ({ from, to }) {
      this.setStateData({ from, to })
      await this.refresh()
    },
    // 그래프 선택 부분에 대한 설정
    setSelection (from = void 0, to = void 0) {
      this.$refs.chart.updateOptions({
        chart: {
          selection: {
            xaxis: {
              min: from,
              max: to
            }
          }
        }
      })
    },
    tooltipFormat (value, timestamp) {
      const type = this.salesData.type
      const from = this.stateData.from
      const to = this.stateData.to
      const t = this.$moment(value)
      // 일자가 같을 경우 확인용
      const fromDay = this.$moment(from).format('YYYY-MM-DD')
      const toDay = this.$moment(to).format('YYYY-MM-DD')
      // 달이 같을 경우 확인용
      const fromMonth = this.$moment(from).format('YYYY-MM')
      const toMonth = this.$moment(to).format('YYYY-MM')
      // 년이 같을 경우 확인용
      const fromYear = this.$moment(from).format('YYYY')
      const toYear = this.$moment(to).format('YYYY')
      if (type === 'seconds') return t.format('HH:mm:ss')
      if (type === 'minutes') return t.format('HH:mm')
      if (fromDay === toDay && type === 'hours') return t.format('HH:mm')
      if (type === 'hours') return t.format('DD일 HH시')
      if (fromMonth === toMonth && type === 'days') return t.format('DD일')
      if (type === 'days') return t.format('MM월 DD일')
      if (fromYear === toYear && type === 'months') return t.format('MM월')
      if (type === 'months') return t.format('YY년 MM월')
      if (type === 'years') return t.format('YYYY년')
    },
    async refresh (isInit = false) {
      this.isLoading = true
      if (!isInit) this.$emit('refresh')
      if (this.type === 'membership') {
        await this.reqGetSalesMember()
      } else {
        await this.reqGetSalesLesson()
      }
      await this.$sleep(1000)
      this.isLoading = false
    }
  }
}
</script>
