<template>
  <div>
    <q-card class="widget">
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
      <q-card-section>
        <apexchart
          type="bar"
          :options="options"
          :series="membershipTicketData.series"
        ></apexchart>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import apexOpts from 'src/config/apex.json'
export default {
  name: 'MembershipWidget',
  props: {
    title: {
      type: String,
      default: '회원권 유형별 계약 건수'
    }
  },
  mounted () {
    this.refresh()
  },
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState('salesState', [
      'membershipTicketData'
    ]),
    options () {
      return {
        chart: {
          id: 'membership-type-widget',
          stacked: true,
          height: '230',
          defaultLocale: 'ko',
          locales: apexOpts.locales
        },
        xaxis: {
          categories: this.membershipTicketData.category,
          labels: {
            rotateAlways: false,
            rotate: 0,
            hideOverlappingLabels: true
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => { return value }
          }
        },
        tooltip: {
          shared: true,
          followCursor: true,
          inverseOrder: true,
          x: {
            show: true,
            format: 'yyyy년 MM월 dd일 HH:mm'
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('salesState', [
      'getMembershipTicketWidget'
    ]),
    async refresh () {
      this.isLoading = true
      await this.getMembershipTicketWidget()
      await this.$sleep(1000)
      this.isLoading = false
    }
  }
}
</script>
