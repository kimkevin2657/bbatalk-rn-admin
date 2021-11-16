<template>
  <div>
    <q-card>
      <q-card-section class="q-pa-sm">
        <div class="widget-title">매출 통계</div>
      </q-card-section>
      <div style="height:10px;">
        <q-linear-progress
          indeterminate
          color="blue-grey"
          v-if="isLoading"
        />
      </div>
      <q-card-section class="q-pt-none">
        <div class="row q-guatter-x-sm">
          <q-card-section
            horizontal
            class="col-xs-12 col-sm-6 col-md-3"
            v-for="(opt, index) in opts"
            :key="`sc-${index}`"
          >
            <div style="align-self: center;">
              <q-avatar
                :color="opt.color"
                text-color="white"
                :icon="opt.icon"
              >
              </q-avatar>
            </div>
            <div class="q-ml-md">
              <div class="title">{{opt.title}}</div>
              <div class="sails">{{salesStr(salesStatsData[opt.key])}}</div>
              <div class="refund">환불: {{refundStr(salesStatsData[opt.key])}}</div>
            </div>
          </q-card-section>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'SalesWidget',
  data () {
    return {
      opts: [
        {
          key: 'membership',
          title: '회원권',
          icon: 'mdi-ticket-account',
          color: 'indigo'
        },
        {
          key: 'lesson',
          title: '수강권',
          icon: 'mdi-ticket-confirmation',
          color: 'teal'
        },
        {
          key: 'option',
          title: '옵션',
          icon: 'mdi-apps',
          color: 'grey'
        },
        {
          key: 'total',
          title: '총 매출',
          icon: 'mdi-alpha-t',
          color: 'blue-grey'
        }
      ],
      isLoading: false
    }
  },
  mounted () {
    this.refresh()
  },
  computed: {
    ...mapState('salesState', [
      'salesStatsData'
    ])
  },
  methods: {
    ...mapActions('salesState', [
      'getSalesStats'
    ]),
    salesStr ({ sales = 0, cnt = 0 }) {
      const v = this.$util.comma(sales)
      const c = this.$util.comma(cnt)
      return `${v}원 (${c}건)`
    },
    refundStr ({ refund = 0, rcnt = 0 }) {
      const v = this.$util.comma(refund)
      const c = this.$util.comma(rcnt)
      return `${v}원 (${c}건)`
    },
    async refresh () {
      this.isLoading = true
      await this.getSalesStats()
      await this.$sleep(1000)
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.refund-label {
  color: #e74c5e;
  font-size: 10px;
}
.title {
  font-size: 12px;
  color: #616f80;
  font-family: inherit;
  font-weight: 500;
  text-transform: uppercase;
}
.sails {
  box-sizing: border-box;
  color: rgb(97, 111, 128);
  display: block;
  font-family: Rubik, sans-serif;
  font-size: 16px;
  font-weight: 500;
  height: 18px;
  line-height: 24px;
  overflow-wrap: break-word;
  text-align: left;
  text-size-adjust: 100%;
}
.refund {
  color: #e74c5e;
  font-size: 12px;
  font-weight: 400;
  line-height: 23.8px;
  overflow-wrap: break-word;
}
</style>
