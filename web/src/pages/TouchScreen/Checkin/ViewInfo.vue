<template>
  <div style="width: 80vw;">
    <div class="row">
      <q-btn icon="keyboard_backspace" :label="'뒤로'" flat @click="back" dense />
      <q-space />
      <q-chip>
        <q-avatar color="blue-grey-8" text-color="white">{{sec}}</q-avatar>
        초 후 뒤로 이동
      </q-chip>
    </div>
    <div class="shadow-2">
      <div style="text-align:center; padding-top: 25px;">
        <q-icon name="fas fa-check" class="text-green" style="font-size: 32px;" />
      </div>
      <h2 class="form-title" style="text-align:center; padding: 0 0 16px 0; margin-top: 0; line-height: 160%">
        <b>{{memberAccessData.name}}</b> 회원님 입장 가능합니다. 환영합니다!<br />
        <span style="font-size: 14px;">{{$moment().format('YY-MM-DD HH:mm')}}에 입장하였습니다.</span>
      </h2>
    </div>
    <!-- 보유 회원권 -->
    <div v-if="_.size(memberAccessData.membershipTickets) > 0">
      <div style="font-size: 16px; margin-bottom: 10px;">
        보유 회원권
      </div>
      <q-list class="shadow-2">
        <template
          v-for="(ticket, index) in memberAccessData.membershipTickets"
        >
          <div :key="index">
            <q-item class="bg-blue-grey-8 text-white">
              <q-item-section>{{ticket.session}}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>{{$moment(ticket.sdate).format('YYYY-MM-DD')}} ~ {{$moment(ticket.edate).format('YYYY-MM-DD')}}</q-item-section>
            </q-item>
          </div>
        </template>
      </q-list>
    </div>
    <!-- 보유 수강권 -->
    <div v-if="_.size(memberAccessData.lessonTickets) > 0">
      <div style="font-size: 16px; margin: 10px 0;">
        보유 수강권
      </div>
      <q-list class="shadow-2">
        <template
          v-for="(ticket, index) in memberAccessData.lessonTickets"
        >
          <div :key="index">
            <q-item class="bg-blue-grey-8 text-white">
              <q-item-section>
                <span>
                  {{ticket.session}}
                  <span v-if="reserveInfos[ticket._id]">
                    <template v-for="(reserve, rIndex) in reserveInfos[ticket._id]">
                      <q-chip
                        :key="rIndex"
                        size="sm"
                        :color="getReserveState(reserve)"
                        :label="getReserveLabel(reserve)"
                        text-color="white">
                      </q-chip>
                    </template>
                  </span>
                </span>
              </q-item-section>
              <q-item-section side class="text-white">
                <div class="row" style="height: 32px">
                  <div class="col" v-if="ticket.staffPhoto">
                    <q-avatar
                      side
                      size="36px"
                    >
                      <img :src="ticket.staffPhoto" />
                    </q-avatar>
                  </div>
                  <div class="col" style="font-size: 12px; margin-left: 5px;">
                    <div v-if="ticket.staffTeam">{{ticket.staffTeam}}</div>
                    <div>{{ticket.staffName}}</div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>{{$moment(ticket.sdate).format('YYYY-MM-DD')}} ~ {{$moment(ticket.edate).format('YYYY-MM-DD')}}</q-item-section>
              <q-item-section side>{{`${ticket.useCnt}/${ticket.totCnt}`}}</q-item-section>
            </q-item>
          </div>
        </template>
      </q-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ViewInfo',
  data () {
    return {
      memberState: {
        0: { name: '결석', color: 'red', tooltipColor: 'red' },
        1: { name: '예약', color: 'teal', tooltipColor: '#009688' },
        2: { name: '출석', color: 'primary', tooltipColor: '#027be3' },
        3: { name: '취소', color: 'purple', tooltipColor: '#a664b1' }
      },
      sec: 30,
      secEvt: void 0
    }
  },
  mounted () {
    // 30초 후 뒤로 이동
    this.sec = 30
    this.secEvt = setInterval(() => {
      if (this.sec === 0) {
        return this.back()
      }
      this.sec--
    }, 1000)
  },
  computed: {
    ...mapState('memberAccess', [
      'memberAccessData'
    ]),
    reserveInfos () {
      const index = {}
      _.forEach(this.memberAccessData.reserves, o => {
        if (o.state !== 3) { // 취소만 아니라면 예약 정보를 확인할 수 있음.
          if (!_.isArray(index[o.ticketid])) index[o.ticketid] = []
          index[o.ticketid].push(o)
        }
      })
      return index
    }
  },
  methods: {
    getReserveState (reserve) {
      const state = _.get(reserve, ['state'], void 0)
      return _.get(this.memberState, [state, 'color'])
    },
    getReserveLabel (reserve) {
      const state = _.get(reserve, ['state'], void 0)
      const stateStr = _.get(this.memberState, [state, 'name'], '')
      const stime = this.$moment(reserve.stime).format('HH:mm')
      const etime = this.$moment(reserve.etime).format('HH:mm')
      const label = `${stateStr}: ${stime}~${etime}`
      return label
    },
    back () {
      clearInterval(this.secEvt)
      this.$emit('previous')
    }
  }
}
</script>

<style scoped>
h2 {
  display: block;
  font-size: 1.6em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
</style>
