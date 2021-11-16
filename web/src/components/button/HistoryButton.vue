/**
 * History Button
 *
 * @since 2020-01-06
 * @author jungmin87.kim
 *
 */
<template>
  <div v-if="isShow">
    <!--  백그라운드 배경  -->
    <div
      v-if="isOpen"
      style="background: black; position: fixed; z-index: 9991; height: 100vh; width: 100vw; opacity: 0.3"
    />
    <!--  히스토리 관리 버튼  -->
    <div
      class="history-btn-container"
      :style="isLeft ? {
        top: `${btnY}px`,
        left: `${btnX}px`
      } : {
        top: `${btnY}px`,
        right: `${windowWidth - btnX - 55}px`
      }"
      draggable="true"
      @dragstart="onDragStart"
      @mouseover="isMouseOver = true"
      @mouseleave="isMouseOver = false"
      @mouseup="onMouseUp"
    >
      <q-btn-dropdown
        :label="$t('cmn.historyView')"
        :icon-right="isLeft ? '' : 'restore'"
        :icon="isLeft ? 'restore' : ''"
        size="18px"
        rounded
        fab
        split
        class="history-btn"
        :class="(isOpen || isMouseOver) && !isDrag ? (isLeft ? 'history-btn-left' : 'history-btn-right'): ''"
      >
      </q-btn-dropdown>
      <q-popover
        v-model="isOpen"
        :anchor="`${isTop ? 'top' : 'bottom'} ${isLeft ? 'left' : 'right'}`"
        :self="`${isTop ? 'top' : 'bottom'} ${isLeft ? 'left' : 'right'}`"
        :offset="isLeft ? [-13, -13] : [-13, -13]"
        style="z-index: 9995 !important;"
        :anchor-click="false"
        fit
      >
        <div v-if="history.length === 0">
          <div v-if="isTop" style="height: 25px;"/>
          <q-item style="font-size: 13px">
            <q-item-main :label="$t('cmn.nonHistoryView')" />
          </q-item>
          <div v-if="!isTop" style="height: 25px;"/>
        </div>
        <q-list v-else>
          <div v-if="isTop" style="height: 25px;"/>
          <template v-for="(historyItem, index) in history">
            <nuxt-link
              :to="historyItem.url"
              class="menu-cursor-pointer"
            >
              <q-item :key="historyItem.key" :style="currentPageKey === historyItem.key ? 'color: #027be3' : ''">
                <q-item-main :label="historyItem.name" text-color="primary"/>
                <q-item-side right>
                  <q-btn
                    icon="clear"
                    size="11px"
                    style="padding: 5px 5px 5px 10px;"
                    flat
                    @click.prevent="onDelHistory(historyItem.key)"
                  />
                </q-item-side>
              </q-item>
            </nuxt-link>
          </template>
          <div v-if="!isTop" style="height: 25px;"/>
        </q-list>
      </q-popover>
    </div>
  </div>
</template>

<script>
  import {createNamespacedHelpers} from 'vuex'
  const navigationHelper = createNamespacedHelpers('common/navigation')

  export default {
    name: 'HistoryButton',
    created () {
      window.addEventListener('resize', this.handleResize)
      this.handleResize()
    },
    destroyed () {
      window.removeEventListener('resize', this.handleResize)
    },
    data () {
      return {
        isOpen: false,
        isDrag: false,
        isInitCall: false,
        isMouseOver: false,
        btnX: 140,
        btnY: 80,
        windowWidth: 0,
        windowHeight: 0,
        pos1: 0,
        pos2: 0,
        pox3: 0,
        pos4: 0
      }
    },
    computed: {
      ...navigationHelper.mapState([
        'history',
        'historyPos',
        'currentPageKey'
      ]),
      isTop () { // 화면의 상단과 하단 영역
        const halfHeight = this.windowHeight - 310
        return halfHeight >= this.btnY
      },
      isLeft () { // 화면의 왼쪽과 오른쪽 영역1
        const halfWidth = this.windowWidth - 160
        return halfWidth >= this.btnX
      },
      isShow () {
        if (!this.isInitCall) return false
        let isShowFlag = (this.$route.query.newWindow === void 0)
        if (this.$route.path.startsWith('/install') === true) {
          isShowFlag = false
        } else if (this.$route.query.vsType !== void 0) {
          isShowFlag = true
        }
        return isShowFlag
      }
    },
    mounted () {
      this.setHistoryEvt(this.injectPosition)
    },
    methods: {
      ...navigationHelper.mapActions([
        'deleteHistory',
        'updateHistoryPos'
      ]),
      ...navigationHelper.mapMutations([
        'setHistoryEvt'
      ]),
      // 최초 위치 주입
      injectPosition () {
        this.isInitCall = true
        this.btnX = this.historyPos.x
        this.btnY = this.historyPos.y

        // X, Y 범위 조절
        if (this.btnX < 0) this.btnX = 0
        else if (this.btnX > (this.windowWidth - 55)) this.btnX = (this.windowWidth - 55)
        if (this.btnY < 0) this.btnY = 0
        else if (this.btnY > (this.windowHeight - 55)) this.btnY = (this.windowHeight - 55)
      },
      // Window Resize
      handleResize () {
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight
        // 버튼이 화면 밖으로 벗어 날 경우 위치 조정
        if (this.windowWidth < (this.btnX + 55)) this.btnX = (this.windowWidth - 55)
        if (this.windowHeight < (this.btnY + 55)) this.btnY = (this.windowHeight - 55)
      },
      onDragStart (evt) {
        evt.preventDefault()
        this.isOpen = false
        this.isDrag = true
        this.pos3 = evt.clientX
        this.pos4 = evt.clientY
        document.onmouseup = this.onDragEnd
        document.onmousemove = this.onDrag
      },
      onDrag (evt) {
        evt.preventDefault()
        this.pos1 = this.pos3 - evt.clientX
        this.pos2 = this.pos4 - evt.clientY
        this.pos3 = evt.clientX
        this.pos4 = evt.clientY
        this.btnY = this.btnY - this.pos2
        this.btnX = this.btnX - this.pos1

        // X, Y 범위 조절
        if (this.btnX < 0) this.btnX = 0
        else if (this.btnX > (this.windowWidth - 55)) this.btnX = (this.windowWidth - 55)
        if (this.btnY < 0) this.btnY = 0
        else if (this.btnY > (this.windowHeight - 20)) this.btnY = (this.windowHeight - 20)
      },
      onDragEnd () {
        document.onmouseup = null
        document.onmousemove = null
        this.updateHistoryPos({ x: this.btnX, y: this.btnY })
        this.isDrag = false
        this.isOpen = false
      },
      onMouseUp () {
        if (this.isDrag) {
          this.isDrag = false
          this.isOpen = false
        } else {
          this.isDrag = false
          this.isOpen = !this.isOpen
        }
      },
      // 히스토리 제거 버튼
      async onDelHistory (key) {
        this.deleteHistory(key)
        if (!this.isTop) {
          this.isOpen = false
          await this.$nextTick()
          this.isOpen = true
        }
      }
    }
  }
</script>

<style>
.history-btn-container {
  position: fixed;
  z-index: 9996;
}

.history-btn button {
  background-color: #0061cc;
  color: white;
  padding: 0px;
  border-top-right-radius: 28px !important;
  border-bottom-right-radius: 28px !important;
  webkit-transition: max-width .45s ease-in-out;
  -webkit-transition: max-width .45s ease-in-out;
  transition: max-width .45s ease-in-out;
  max-width: 35px;
  min-height: 35px;
}
.history-btn button .q-btn-inner {
  flex-wrap: nowrap;
  min-height: 0;
}
.history-btn .q-btn-dropdown-arrow {
  display: none;
}
.history-btn button .q-icon {
  padding: 5px;
  margin: 0px !important;
}
.history-btn button .q-btn-inner div {
  font-size: 12px;
  white-space: nowrap;
  overflow-x: hidden;
  webkit-transition: all .45s ease-in-out;
  -webkit-transition: all .45s ease-in-out;
  transition: all .45s ease-in-out;
  padding-right: 0px;
  opacity: 0;
}

.history-btn-left button, .history-btn-right button {
  max-width: 250px;
}

.history-btn-left button .q-btn-inner div {
  opacity: 1;
  padding-right: 10px;
}

.history-btn-right button .q-btn-inner div {
  opacity: 1;
  padding-left: 10px;
}
</style>
