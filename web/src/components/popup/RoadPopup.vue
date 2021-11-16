<template>
  <default-dialog
    ref="dialog"
    title="주소 찾기"
    :title-icon="'map'"
    :width="350"
    :height="605"
    :useButtons="['close']"
  >
    <vue-daum-postcode @complete="onComplete" @load="onLoad"/>
    <q-inner-loading :showing="isLoading">
      <q-spinner-cube size="50px" color="primary" />
    </q-inner-loading>
  </default-dialog>
</template>

<script>
import DefaultDialog from '../dialog/DefaultDialog'
import VueDaumPostcode from './roadPopup/vue-daum-postcode'
export default {
  name: 'RoadPopup',
  components: {
    DefaultDialog,
    VueDaumPostcode
  },
  data () {
    return {
      isLoading: true
    }
  },
  methods: {
    onComplete (data) {
      this.$emit('complete', data)
      this.$refs.dialog.hide()
    },
    onLoad () {
      this.isLoading = false
    },
    show () {
      this.$refs.dialog.show()
    }
  }
}
</script>
