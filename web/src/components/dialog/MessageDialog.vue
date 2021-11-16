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
          <q-icon name="mdi-message-text-outline" />
        </q-btn>
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section
        class="scroll bg-white"
      >
        <template v-if="msgType === 'newLine'">
          <p
            v-for="(text, index) in message"
            :key="index"
            :style="txtAlign"
          >
            {{ text }}
          </p>
        </template>
        <p v-else>
          {{ message }}
        </p>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <template
          v-for="(button, index) in filterdButtons"
        >
          <q-btn
            :key="index"
            :label="button.label"
            :color="button.color"
            :text-color="button.textColor"
            @click="onClickBtn(button.btnKey)"
          />
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'MessageDialog',
  props: {
    title: {
      type: String,
      default: 'Message Dialog'
    },
    isHeader: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    textAlign: {
      type: String,
      default: 'center'
    },
    useButtons: { // 사용 할 타입의 버튼 타입
      type: Array,
      default: () => {
        return ['confirm', 'apply', 'cancel', 'close']
      }
    },
    closeButtons: { // 버튼 선택 시 닫히는 버튼 타입
      type: Array,
      default: () => {
        return ['cancel', 'close']
      }
    }
  },
  data () {
    return {
      buttons: [
        { btnKey: 'close', label: '닫기', color: 'blue-grey-6', textColor: 'white' },
        { btnKey: 'cancel', label: '취소', color: 'blue-grey-6', textColor: 'white' },
        { btnKey: 'apply', label: '적용', color: 'blue-grey-8', textColor: 'white' },
        { btnKey: 'confirm', label: '확인', color: 'blue-grey-8', textColor: 'white' }
      ],
      isOpen: false,
      message: '',
      msgType: ''
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
    txtAlign () {
      let styleProp = 'center'
      if (this.textAlign === 'left') {
        styleProp = 'left'
      } else if (this.textAlign === 'right') {
        styleProp = 'right'
      }
      return `text-align: ${styleProp}`
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
      if (this.cb) this.cb(btnKey)
      else this.$emit(btnKey)
    },
    show (message, opts, cb) {
      _.forEach(Object.keys(opts), key => {
        this[key] = opts[key]
      })
      if (cb) this.cb = cb
      else this.cb = void 0
      if (message !== undefined) {
        if (message.includes('<br>') || message.includes('<br />') || message.includes('<br/>')) {
          this.message = message.split('<br>')
          this.msgType = 'newLine'
        } else if (message.includes('\n')) {
          this.message = message.split('\n')
          this.msgType = 'newLine'
        } else {
          this.message = message
          this.msgType = 'ok'
        }
      }
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
  grid-template-rows: 64px auto 1px 52px;
}
.grid-container-noheader {
  display: grid;
  grid-template-rows: auto 1px 52px;
}
</style>
