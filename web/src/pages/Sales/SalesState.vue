<template>
  <div>
    <top>
      <template v-slot:body>
        <search-button
          :from="stateData.from"
          :to="stateData.to"
          @search="({from, to}) => {
            setStateData({from, to})
            allQuery()
          }"
        />
      </template>
    </top>
    <q-scroll-area style="height: calc(100vh - 108px);">
      <div
        class="row q-col-gutter-sm q-mt-sm q-mb-sm"
        :class="$q.screen.lt.sm ? '' : 'q-mx-sm'"
      >
        <sales-widget
          ref="sales"
          class="col-12"
          :title="'회원권 매출'"
        />
        <membership-type-widget
          ref="membershipType"
          class="col-xs-12 col-sm-6"
        />
        <membership-ticket-widget
          ref="membershipTicket"
          class="col-xs-12 col-sm-6"
        />
        <lesson-team-widget
          ref="lessonTeam"
          class="col-xs-12 col-sm-6"
        />
        <lesson-ticket-widget
          ref="lessonTicket"
          class="col-xs-12 col-sm-6"
        />
        <!-- <option-widget class="col-xs-12 col-sm-6" /> -->
        <vip-top-ten-widget
          ref="memberTopTen"
          class="col-xs-12 col-sm-6"
        />
        <staff-top-ten-widget
          ref="staffTopTen"
          class="col-xs-12 col-sm-6"
        />
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import SearchButton from 'src/components/button/SearchButton'
// component
import Top from 'src/layouts/component/Top'
// widget
import SalesWidget from 'src/pages/Sales/SalesState/SalesWidget'
import MembershipTypeWidget from 'src/pages/Sales/SalesState/MembershipTypeWidget'
import MembershipTicketWidget from 'src/pages/Sales/SalesState/MembershipTicketWidget'
import LessonTeamWidget from 'src/pages/Sales/SalesState/LessonTeamWidget'
import LessonTicketWidget from 'src/pages/Sales/SalesState/LessonTicketWidget'
// import OptionWidget from 'src/pages/Sales/SalesState/OptionWidget'
import VipTopTenWidget from 'src/pages/Sales/SalesState/VipTopTenWidget'
import StaffTopTenWidget from 'src/pages/Sales/SalesState/StaffTopTenWidget'

export default {
  name: 'SalesState',
  components: {
    Top,
    SearchButton,
    SalesWidget,
    MembershipTypeWidget,
    MembershipTicketWidget,
    LessonTeamWidget,
    LessonTicketWidget,
    // OptionWidget,
    VipTopTenWidget,
    StaffTopTenWidget
  },
  mounted () {
    // this.initStateData()
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState('salesState', [
      'stateData'
    ])
  },
  methods: {
    ...mapMutations('salesState', [
      'setStateData',
      'initStateData'
    ]),
    async allQuery () {
      this.$refs.sales.refresh()
      this.$refs.membershipType.refresh()
      this.$refs.membershipTicket.refresh()
      this.$refs.lessonTeam.refresh()
      this.$refs.lessonTicket.refresh()
      this.$refs.memberTopTen.refresh()
      this.$refs.staffTopTen.refresh()
    }
  }
}
</script>
