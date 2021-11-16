<template>
  <div>
    <q-card class="widget">
      <q-card-section>
        <div class="widget-title">{{title}}</div>
      </q-card-section>
      <q-card-section>
        <apexchart
          type="bar"
          :options="options"
          :series="series"
        ></apexchart>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'OptionWidget',
  props: {
    title: {
      type: String,
      default: '옵션 유형별 계약 건수'
    }
  },
  data () {
    return {
      options: {
        chart: {
          id: 'option-widget',
          stacked: true
        },
        xaxis: {
          categories: ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06', '01/07', '01/09']
        },
        tooltip: {
          shared: true,
          followCursor: true,
          inverseOrder: true
        }
      },
      series: [
        {
          name: '락커',
          data: [10, 80, 90, 70, 80, 90, 80, 10]
        },
        {
          name: '운동복',
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    }
  }
}
</script>
