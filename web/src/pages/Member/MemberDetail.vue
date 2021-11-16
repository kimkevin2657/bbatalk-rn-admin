<template>
  <div>
    <top></top>
    <div
      class="row"
      :class="$q.screen.gt.md ? 'q-ma-sm q-pa-lg' : 'q-my-sm q-pa-sm'"
    >
      <div class="q-pa-sm col-md-6 col-sm-12 card-area">
        <!-- 프로필 카드 -->
        <member-detail-profile-card class="card-block"/>
      </div>
      <div class="q-pa-sm col-md-6 col-sm-12 card-area">
        <!-- 가입 정보 카드 -->
        <member-detail-regist-card class="card-block"/>
      </div>
      <div class="q-pa-sm col-12">
        <member-detail-log-card />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Top from '../../layouts/component/Top'
// Card
import MemberDetailProfileCard from './memberDetail/MemberDetailProfileCard'
import MemberDetailRegistCard from './memberDetail/MemberDetailRegistCard'
import MemberDetailLogCard from './memberDetail/MemberDetailLogCard'
export default {
  name: 'MemberDetail',
  components: {
    Top,
    MemberDetailProfileCard,
    MemberDetailRegistCard,
    MemberDetailLogCard
  },
  mounted () {
    if (!_.get(this.memberData, '_id')) {
      this.$router.push('/manager/member/MemberState')
    }
  },
  computed: {
    ...mapState('member', [
      'memberData'
    ])
  }
}
</script>

<style scoped>
/* 카드 간의 높이를 맞추기 위한 스타일 */
.card-area {
  display: flex;
  flex-direction: column;
}
.card-block {
  flex: 1;
}
</style>
