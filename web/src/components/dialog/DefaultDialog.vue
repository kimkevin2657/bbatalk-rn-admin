<template>
  <q-dialog
    v-model="isOpen"
    stack-buttons
    square
    flat
    :no-esc-dismiss="false"
    :no-backdrop-dismiss="true"
  >
    <q-card
      class="grid-container"
      :style="dialogStyle"
    >
      <q-toolbar class="bg-blue-grey-8 text-white shadow-2" style="height: 15px">
        <q-btn flat round dense >
          <q-icon :name="titleIcon" />
        </q-btn>
        <!-- <q-icon flat round dense name="account_box" class="q-mr-sm" /> -->
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
      </q-toolbar>

      <q-separator />
      <q-card-section class="q-pa-none scroll">
        <q-scroll-area :style="innerCss" class="q-pa-md">
          <slot />
        </q-scroll-area>
        <q-resize-observer @resize="onResize" />
      </q-card-section>

      <q-separator />

      <q-card-actions
        align="right"
        class=""
      >
        <template
          v-for="(button, index) in filterdButtons"
        >
          <q-btn
            :key="index"
            :label="button.label"
            :color="button.color"
            :text-color="button.textColor"
            :disable="disableButtons.indexOf(button.btnKey) >= 0"
            @click="onClickBtn(button.btnKey)"
          />
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'DefaultDialog',
  props: {
    title: {
      type: String,
      default: 'Default Dialog'
    },
    titleIcon: {
      type: String,
      default: 'account_box'
    },
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 300
    },
    useButtons: {
      type: Array,
      default: () => {
        return ['confirm', 'apply', 'cancel', 'close', 'regist']
      }
    },
    closeButtons: { // 버튼 선택 시 닫히는 버튼 타입
      type: Array,
      default: () => {
        return ['cancel', 'close']
      }
    },
    disableButtons: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted () {
    this.inner = { width: this.width, height: this.height }
  },
  data () {
    return {
      buttons: [
        { btnKey: 'continue', label: '계속', color: 'blue-grey-4', textColor: 'white' },
        { btnKey: 'remove', label: '삭제', color: 'blue-grey-6', textColor: 'white' },
        { btnKey: 'close', label: '닫기', color: 'blue-grey-6', textColor: 'white' },
        { btnKey: 'cancel', label: '취소', color: 'blue-grey-6', textColor: 'white' },
        { btnKey: 'apply', label: '적용', color: 'blue-grey-8', textColor: 'white' },
        { btnKey: 'edit', label: '수정', color: 'blue-grey-8', textColor: 'white' },
        { btnKey: 'reglesson', label: '수강 등록', color: 'blue-grey-8', textColor: 'white' },
        { btnKey: 'confirm', label: '확인', color: 'blue-grey-8', textColor: 'white' },
        { btnKey: 'regist', label: '등록', color: 'blue-grey-8', textColor: 'white' },
        { btnKey: 'next', label: '다음', color: 'blue-grey-8', textColor: 'white' }
      ],
      isOpen: false,
      inner: { width: 0, height: 0 }
    }
  },
  computed: {
    dialogStyle () {
      let styleProp = ''
      if (this.width > 0) {
        styleProp += `width: ${this.width}px; `
      }
      if (this.height > 0) {
        styleProp += `height: ${this.height}px;`
      }
      return styleProp
    },
    filterdButtons () {
      return this.buttons.filter((o) => {
        return this.useButtons.indexOf(o.btnKey) >= 0
      })
    },
    innerCss () {
      return `height: ${this.inner.height}px; max-width: ${this.inner.width}px`
    }
  },
  watch: {
    isOpen (v) {
      if (!v) {
        this.$emit('hide')
      }
    }
  },
  methods: {
    onClickBtn (btnKey) {
      if (this.closeButtons.indexOf(btnKey) >= 0) {
        this.isOpen = false
      }
      this.$emit(btnKey)
    },
    onResize (size) {
      this.inner = size
    },
    show () {
      this.isOpen = true
    },
    hide () {
      this.isOpen = false
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-rows: 50px 1px auto 1px 52px;
  max-width: 1200px;
}
</style>
