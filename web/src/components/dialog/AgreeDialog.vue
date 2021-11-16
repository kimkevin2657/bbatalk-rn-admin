/**
약관동의 Dialog
 */
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
      <q-toolbar
        class="bg-blue-grey-8 text-white shadow-2"
        style="height: 15px"
      >
        <q-btn
          flat
          round
          dense
        >
          <q-icon :name="titleIcon" />
        </q-btn>
        <!-- <q-icon flat round dense name="account_box" class="q-mr-sm" /> -->
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
      </q-toolbar>

      <q-separator />

      <q-card-section class="scroll q-pa-none">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          animated
          flat
        >
          <!-- STEP1: 약관 동의 -->
          <q-step
            :name="1"
            title="약관 동의"
            icon="settings"
            :done="step > 1"
            color="blue-grey-8"
          >
            <!-- 약관 정보: delayTicket.json -->
            <agree-template :textArr="textArr" />
            <div class="row">
              <q-space />
              <q-checkbox
                v-model="isAgree"
                label="약관에 동의 합니다."
                color="blue-grey-6"
              />
            </div>
          </q-step>
          <!-- STEP2: 기간연장 등록 -->
          <q-step
            :name="2"
            title="등록"
            icon="assignment"
            :done="step > 2"
            color="blue-grey-8"
            class="dialog-stepper"
            :style="`height:${height-190}px`"
          >
            <q-scroll-area
              :style="innerCss"
              class="q-pa-md"
            >
              <slot />
            </q-scroll-area>
            <!-- <q-resize-observer @resize="onResize" /> -->
          </q-step>
        </q-stepper>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <template v-for="(button, index) in filterdButtons">
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
// component
import AgreeTemplate from 'components/template/AgreeTemplate'
export default {
  name: 'AgreeDialog',
  components: {
    AgreeTemplate
  },
  props: {
    title: {
      type: String,
      default: 'Default Dialog'
    },
    textArr: {
      type: Array,
      default: () => []
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
    closeButtons: { // 버튼 선택 시 닫히는 버튼 타입
      type: Array,
      default: () => {
        return ['cancel', 'close']
      }
    }
  },
  mounted () {
    this.inner = { width: this.width, height: this.height }
  },
  data () {
    return {
      step: 1,
      isAgree: false,
      buttons: [
        { btnKey: 'close', label: '닫기', color: 'blue-grey-6', textColor: 'white' },
        { btnKey: 'cancel', label: '취소', color: 'blue-grey-6', textColor: 'white' },
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
    useButtons () {
      if (this.step === 1) return ['cancel', 'next']
      return ['cancel', 'confirm']
    },
    disableButtons () {
      if (this.step === 1 && !this.isAgree) return ['next']
      return []
    },
    innerCss () {
      return `height: ${this.inner.height - 200}px; max-width: ${this.inner.width}px`
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
      if (btnKey === 'next') {
        this.step++
        return
      }
      this.$emit(btnKey)
    },
    onResize (size) {
      this.inner = size
    },
    show () {
      this.step = 1
      this.isAgree = false
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
