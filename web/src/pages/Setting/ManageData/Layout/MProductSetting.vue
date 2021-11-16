/*
  상품 설정 데이터
*/
<template>
  <div :class="$q.screen.gt.md ? 'q-pa-md' : ''">
    <div class="q-mb-md row">
      <q-space />
      <q-checkbox
        v-model="isMembership"
        label="회원권"
        color="blue-grey"
        class="q-mr-sm"
        dense
      />
      <q-checkbox
        v-model="isLesson"
        label="수강권"
        color="blue-grey"
        class="q-mr-sm"
        dense
      />
      <q-checkbox
        v-model="isLockerGroup"
        label="락커 그룹"
        color="blue-grey"
        dense
      />
    </div>
    <!-- 회원권 설정 -->
    <membership-template v-show="isMembership" />
    <br
      style="margin-bottom: 10px;"
      v-show="isMembership"
    />
    <!-- 강습권 설정 -->
    <lesson-template v-show="isLesson" />
    <br
      style="margin-bottom: 10px;"
      v-show="isLesson"
    />
    <!-- 락커그룹 설정 -->
    <locker-group-template v-show="isLockerGroup" />
  </div>
</template>

<script>
import LessonTemplate from './mProductSetting/LessonTemplate'
import MembershipTemplate from './mProductSetting/MembershipTemplate'
import LockerGroupTemplate from './mProductSetting/LockerGroupTemplate'

export default {
  name: 'MProductSetting',
  components: {
    LessonTemplate,
    MembershipTemplate,
    LockerGroupTemplate
  },
  data () {
    return {
      isMembership: true,
      isLesson: true,
      isLockerGroup: true
    }
  }
}
</script>
