/**
약관동의 목록 형식
 */
<template>
  <div class="form_term form_content">
    <template v-for="(item, index) in textArr">
      <p :key="index">
        {{ item }}
      </p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AgreeTemplate',
  props: {
    textArr: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.form_content {
  width: 100%;
  height: 220px;
  overflow-y: auto;
  padding: 10px 15px;
  background-color: #F1F1F1;
}
.form_content p {
  text-align:left;
}
</style>
