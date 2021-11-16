
<template>
  <q-layout view="hHh lpr lFf">
    <!-- Header -->
    <m-header />
    <!-- left sidebar -->
    <m-sidebar />
    <!-- Router -->
    <q-page-container>
      <router-view
        ref="pageComp"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
// 컴포넌트
import MSidebar from './managerLayout/MSidebar'
import MHeader from './managerLayout/MHeader'

export default {
  name: 'ManagerLayout',
  components: {
    MHeader,
    MSidebar
  },
  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>
