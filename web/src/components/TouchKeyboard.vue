<template>
  <div class="row q-col-gutter-sm">
    <q-card
      class="col-12 q-pa-md q-mb-md bg-grey-10"
      dark
      style="font-size: 26px; height: 71px; text-align: center;"
      square
    >
      {{value}}
    </q-card>
    <!-- <q-separator class="col-12"/> -->
    <template v-for="val in 9">
      <q-btn :label="val" class="col-4" :key="val" size="lg" push @click="onInput(val)"/>
    </template>
    <q-btn :label="'C'" class="col-4" size="lg" push @click="onClear" />
    <q-btn :label="0" class="col-4" size="lg" push @click="onInput(0)"/>
    <!-- 백스페이스 -->
    <q-btn
      icon="mdi-backspace-outline"
      class="col-4"
      size="md"
      push
      @click="onBackspace"
    />
    <q-btn
      label="확인"
      class="col-12 q-mt-md"
      size="lg"
      color="blue-grey"
      push
      @click="onConfirm"
      dense
      glossy
    />
  </div>
</template>

<script>
export default {
  name: 'TouchKeyboard',
  data () {
    return {
      value: '',
      requestCnt: 0, // 5회 동안 FullScreen을 시도 한다.
      limitCnt: 5
    }
  },
  methods: {
    onInput (input) {
      if (_.size(this.value) > 5) return
      if (!this.value) this.value = ''
      this.value += input
    },
    onClear () {
      this.value = ''
    },
    onBackspace () {
      if (_.size(this.value) > 0) {
        this.value = this.value.substr(0, _.size(this.value) - 1)
      }
    },
    onConfirm () {
      this.$emit('confirm', this.value)
    }
  }
}
</script>
