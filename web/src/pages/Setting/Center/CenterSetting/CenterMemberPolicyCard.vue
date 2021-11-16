<template>
  <q-card :class="$q.screen.gt.sm ? 'q-ma-md' : 'q-mt-md'">
    <q-card-section>
      <q-item-label class="text-h6">회원 정책 설정</q-item-label>
      <q-item-label caption>회원에 관련된 정책을 설정 할 수 있습니다.</q-item-label>
    </q-card-section>
    <q-separator inset />
    <q-card-section class="row q-col-gutter-md">
      <q-select
        label="회원 등급 누적 형식"
        v-model="gymData.memberRank"
        :options="rankOpts"
        emit-value
        map-options
        class="col-12"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'CenterMemberPolicyCard',
  data () {
    return {
      // 회원 등급 누적 형식
      rankOpts: [
        { label: '설정 안함', value: 0 },
        { label: '금년 누적', value: 1 },
        { label: '전년 누적', value: 2 },
        { label: '전체 누적', value: 3 }
      ]
    }
  },
  computed: {
    ...mapState('gym', [
      'gymData'
    ])
  },
  methods: {
    ...mapActions('gym', [
      'reqUpdateGym'
    ])
  }
}
</script>
