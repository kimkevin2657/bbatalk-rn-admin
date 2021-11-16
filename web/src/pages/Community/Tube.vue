<template>
  <div>
    <top>
      <template v-slot:body>
        <!-- 헤더 사이드 추가/수정/삭제 Template -->
        <header-edit-template
          :visibles="['add']"
          @add="onAdd"
        />
      </template>
    </top>
    <div class="row" style="padding: 20px;">
        <template v-for="vedio in tubeDataList">
          <q-card class="col-xs-12 col-sm-6 col-md-4 col-lg-3" :key="vedio.key" flat style="padding:5px; min-height: 335px">
            <q-video
              v-if="vedio.key === selectedKey"
              style="height:100%"
              :src="`https://www.youtube.com/embed/${vedio.key}?autoplay=1`"
              :key="vedio.key"
            />
            <q-img
              v-if="vedio.key !== selectedKey"
              style="cursor: pointer;"
              :src="`http://img.youtube.com/vi/${vedio.key}/hqdefault.jpg`"
              :key="vedio.key"
              @click="onClickVedio(vedio.key)"
            />

            <q-card-section v-if="vedio.key !== selectedKey" style="display:grid; grid-template-columns: auto 20px;">
              <div>
                <div class="text-h6">{{vedio.title}}</div>
                <div class="text-subtitle2">{{vedio.channelTitle}}</div>
              </div>
              <div>
                <q-btn icon="more_vert" round dense flat>
                  <q-menu
                    :offset="[80, 10]"
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    anchor="bottom left"
                  >
                    <q-list style="min-width: 100px">
                      <!-- 동영상 삭제 아이템 -->
                      <q-item
                        clickable
                        v-close-popup
                        @click="onRemove(vedio.key)"
                      >
                        <q-item-section avatar>
                          <q-avatar icon="delete" color="negative" text-color="white" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>삭제</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <!-- <q-btn-dropdown flat dense dropdown-icon="more_vert">
                </q-btn-dropdown> -->
              </div>
            </q-card-section>

            <!-- <q-card-section>
              {{vedio.description}}
            </q-card-section> -->
          </q-card>
        </template>
        <!-- 유튜브 추가 팝업 -->
        <tube-prompt-dialog ref="tubePromptDialog"/>
    </div>
  </div>
</template>

<script>
// 유튜브 속성값 제어: https://developers.google.com/youtube/player_parameters?hl=ko
// http://img.youtube.com/vi/[동영상 ID값]/[이미지형식].jpg
// http://i.ytimg.com/vi/[동영상 ID값]/[이미지형식].jpg
import { mapState, mapActions } from 'vuex'
import TubePromptDialog from './tube/TubePromptDialog'
import Top from '../../layouts/component/Top'
import HeaderEditTemplate from '../../layouts/template/HeaderEditTemplate'
export default {
  name: 'Tube',
  components: {
    Top,
    TubePromptDialog,
    HeaderEditTemplate
  },
  async mounted () {
    this.editVisible = ['add']
    this.$loader.show({ state: '가져오는 중...' })
    await this.reqGetAllTube()
    this.$loader.hide()
  },
  /**
   * 해당 라우터에서 떠나기 전에 페이지 이동을 제어해주는 Interceptor
   */
  beforeRouteLeave (to, from, next) {
    next() // 페이지 이동 허용
  },
  computed: {
    ...mapState('community', [
      'tubeDataList'
    ]),
    ...mapState('auth', [
      'gymInfo'
    ])
  },
  data () {
    return {
      isHeaderEditTemplate: true, // isHeaderEditTemplate 사용
      selectedKey: void 0
    }
  },
  methods: {
    ...mapActions('community', [
      'reqGetAllTube',
      'reqAddTube',
      'reqDelTube'
    ]),
    onAdd () {
      this.$refs.tubePromptDialog.show()
    },
    onClickVedio (key) {
      this.selectedKey = key
    },
    onHeaderEvt (evtType) {
      if (evtType === 'add') return this.$refs.tubePromptDialog.show()
    },
    async onRemove (tubeId) {
      await this.reqDelTube({ key: tubeId })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 300px;
}
</style>
