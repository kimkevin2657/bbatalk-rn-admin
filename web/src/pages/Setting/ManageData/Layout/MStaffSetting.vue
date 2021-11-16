<template>
  <div :class="$q.screen.gt.md ? 'q-pa-md' : ''">
    <!-- 부서 구분 -->
    <DepartmentTemplate />
    <br style="margin-bottom: 10px;"/>
    <!-- 직급 구분 -->
    <RankTemplate />
  </div>
</template>

<script>
import DepartmentTemplate from './mStaffSetting/DepartmentTemplate'
import RankTemplate from './mStaffSetting/RankTemplate'
export default {
  components: {
    DepartmentTemplate,
    RankTemplate
  },
  computed: {
  },
  async mounted () {
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
</style>
