/*
  출입 현황 페이지
 */
<template>
  <div>
    <top />
    <div class="q-pa-md">
      <!-- 서브 타이틀 -->
      <div class="row justify-between">
        <div class="col-4 text-h6"> </div>
        <q-page-sticky position="top-right" :offset="[13, 13]">
          <div class="col-3 q-gutter-sm">
            <!-- <q-btn color="red-5" label="모두 지우기" @click="onClikcTest" /> -->
          </div>
        </q-page-sticky>
      </div>
      <!-- 출입현황 목록 -->
      <member-access-data-list/>
    </div>
  </div>
</template>

<script>
// 상태 관리용 스토어 등록
import { mapState, mapActions } from 'vuex'

// 컴포넌트
import Top from 'src/layouts/component/Top'

// 테이블
import MemberAccessDataList from './dataTable/MemberAccessDataList'

export default {
  name: 'MemberAccess',
  components: {
    Top,
    MemberAccessDataList
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('memberAccess', [
    ])
  },
  methods: {
    ...mapActions('partitionLog', [
    ])
  }
}
</script>
