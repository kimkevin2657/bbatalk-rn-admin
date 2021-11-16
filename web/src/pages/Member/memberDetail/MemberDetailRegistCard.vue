// 회원정보 - 가입 정보 템플릿
<template>
  <q-card class="q-pb-sm">
    <q-item dense>
      <q-card-section>
        <q-item-label class="text-h5">가입 정보</q-item-label>
        <q-item-label caption>회원이 센터에 가입 후 활동한 정보를 간략하게 확인할 수 있습니다.</q-item-label>
      </q-card-section>
    </q-item>
    <q-list class="q-px-md">
      <!-- 등록일 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'member-card-header' : 'member-card-header-small'">
          <q-item-label caption>최초 등록일</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{memberReg}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset="item" />
      <!-- 회원번호 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'member-card-header' : 'member-card-header-small'">
          <q-item-label caption>회원번호</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{memberData.special_n}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset="item" />
      <!-- 보유 포인트 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'member-card-header' : 'member-card-header-small'">
          <q-item-label caption>보유 포인트</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{`${memberData.point}점`}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset="item" />
      <!-- 총 구매금 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'member-card-header' : 'member-card-header-small'">
          <q-item-label caption>총 구매금</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{totalPrice}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset="item" />
      <!-- 수강 종목 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'member-card-header' : 'member-card-header-small'">
          <q-item-label caption>수강 종목</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{teamList}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset="item" />
      <!-- 락커 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'member-card-header' : 'member-card-header-small'">
          <q-item-label caption>락커</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{memberData.locker}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MemberDetailRegistCard',
  computed: {
    ...mapState('member', [
      'memberData'
    ]),
    memberReg () {
      return this.$moment(this.memberData.regDate).format('YYYY-MM-DD')
    },
    totalPrice () {
      const price = _.get(this.memberData, ['purchase', 'tPrice'], 0)
      const cnt = _.get(this.memberData, ['purchase', 'totalCnt'], 0)
      return `${price.toLocaleString()}원 (${cnt}회)`
    },
    teamList () {
      return _.get(this.memberData, ['purchase', 'teamList'], []).join(', ')
    }
  }
}
</script>

<style scoped>
.member-card-header {
  max-width: 120px;
  min-width: 120px;
}

.member-card-header-small {
  max-width: 70px;
  min-width: 70px;
}
</style>
