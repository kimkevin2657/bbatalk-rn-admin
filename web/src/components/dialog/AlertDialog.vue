<template>
  <q-dialog
    v-model="isOpen"
    stack-buttons
    square
    :no-esc-dismiss="true"
    :no-backdrop-dismiss="true"
  >
    <q-card
      class="grid-container-noheader"
      :style="dialogStyle"
    >
      <q-card-section
        class="scroll"
      >
        <div class="grid-container-section">
          <div class="grid-icon">
            <!-- icon -->
            <q-icon
              :name="type"
              :class="`text-${theme[type].iconColor}`"
              style="font-size: 4rem"
            />
          </div>
          <div class="grid-content">
            <!-- text -->
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
          </div>
        </div>
      </q-card-section>
      <!-- <q-separator /> -->
      <q-card-actions align="center">
        <template
          v-for="(button, index) in filterdButtons"
        >
          <q-btn
            :key="index"
            flat
            :label="button.label"
            @click="onClickBtn(button.btnKey)"
          />
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AlertDialog',
  data () {
    return {
      theme: {
        info: { bg: 'grey-13', iconColor: 'blue' },
        warning: { bg: 'grey-13', iconColor: 'amber' },
        error: { bg: 'grey-13', iconColor: 'red' }
      },
      buttons: [
        { btnKey: 'close', label: '닫기', color: 'white', textColor: 'black' },
        { btnKey: 'cancel', label: '취소', color: 'negative', textColor: 'white' },
        { btnKey: 'apply', label: '적용', color: 'white', textColor: 'black' },
        { btnKey: 'confirm', label: '확인', color: 'primary', textColor: 'white' }
      ],
      isOpen: false,
      type: 'info',
      message: '',
      msgType: '',
      // Options
      width: 0,
      height: 0,
      textAlign: 'center',
      useButtons: ['confirm'], // 사용 할 타입의 버튼 타입
      closeButtons: ['cancel', 'close', 'confirm', 'apply'] // 버튼 선택 시 닫히는 버튼 타입
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
      this.$emit(btnKey)
    },
    show (type, message) {
      if (['info', 'warning', 'error'].indexOf(type) === -1) {
        this.type = 'info'
      } else {
        this.type = type
      }
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
.grid-container-noheader {
  display: grid;
  grid-template-rows: auto 52px;
  background-color: #fafafa;
}
.grid-container-section {
  display: grid;
  grid-template-rows: auto auto;
}
.grid-icon {
  /* width: 100px; */
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
}
.grid-content {
  padding:30px 20px 0px 20px;
}
</style>
