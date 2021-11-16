<template>
  <div :class="$q.screen.gt.md ? 'q-pa-md' : ''">
    <MarketingPathTemplate />
  </div>
</template>

<script>
import MarketingPathTemplate from './mInquirySetting/MarketingPathTemplate'
export default {
  name: 'MInquirySetting',
  components: {
    MarketingPathTemplate
  }
}
</script>
