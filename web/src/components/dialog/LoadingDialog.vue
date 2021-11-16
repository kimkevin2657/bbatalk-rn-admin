<template>
  <q-dialog
    v-model="isOpen"
    stack-buttons
    square
    :no-esc-dismiss="true"
    :no-backdrop-dismiss="true"
  >
    <q-card
      :class="useButtons.length !== 0 ? 'grid-container' : 'grid-container-nobtn' "
      class="grid-container-noheader text-white"
      :style="dialogStyle"
    >
      <q-card-section
        class="scroll"
      >
        <div class="grid-container-section">
          <div class="grid-icon">
            <!-- icon -->
            <q-spinner
              color="primary"
              size="60px"
              :style="'position: unset !important; width: 60px !important; height: 60px !important;'"
              :thickness="5"
            />
          </div>
          <div class="grid-content">
            <!-- text -->
            <p>
              {{ state }}
            </p>
          </div>
        </div>
      </q-card-section>

      <!-- <q-separator /> -->

      <q-card-actions
        v-if="useButtons.length !== 0"
        align="center"
      >
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
      buttons: [
        { btnKey: 'close', label: '닫기', color: 'white', textColor: 'black' },
        { btnKey: 'cancel', label: '취소', color: 'negative', textColor: 'white' },
        { btnKey: 'apply', label: '적용', color: 'white', textColor: 'black' },
        { btnKey: 'confirm', label: '확인', color: 'primary', textColor: 'white' }
      ],
      isOpen: false,
      state: 'Loading...', // 로딩 출력 문구
      closeButtons: ['cancel', 'close', 'confirm', 'apply'], // 버튼 선택 시 닫히는 버튼 타입
      useButtons: [], // 사용 할 타입의 버튼 타입
      textAlign: 'center', // 문구 위치
      height: 0, // 높이 지정
      width: 200 // 너비 지정
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
    show (opts) {
      if (_.has(opts, 'state')) this.state = opts.state
      if (_.has(opts, 'useButtons')) this.useButtons = opts.useButtons
      this.isOpen = true
    },
    setState (state) {
      this.state = state
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
  grid-template-rows: auto 52px;
  background: rgba(56, 41, 41, 0.8);
}
.grid-container-nobtn {
  display: grid;
  grid-template-rows: auto;
  background: rgba(56, 41, 41, 0.8);
}
.grid-container-section {
  display: grid;
  grid-template-rows: auto auto;
}
.grid-icon {
  position: relative;
  overflow: hidden;
  height: 100px;
  padding-top: 20px;
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
}
.grid-content {
  padding-top:30px;
  text-align: center;
}
</style>
