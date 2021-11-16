<!--
  Top ToolBar

  @since 2020-02-14
  @author programrubber
-->

<template>
  <div :class="`page-header-btn-group${last ? '-last' : ''}`">
    <div class="inline-group">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupTools',
  props: {
    last: {
      type: Boolean,
      default: false
    }
  }
}
</script>
