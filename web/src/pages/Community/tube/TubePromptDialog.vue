<template>
  <q-dialog v-model="isOpen" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            뽜튜브 추가
          </div>
        </q-card-section>

        <q-card-section>
          동영상의 <b>주소</b> 또는 <b>ID</b>를 입력하여주세요.
          <q-icon name="info" color="primary">
            <q-tooltip>
                <b>세가지 형식 중 하나</b><br/>
                1. [동영상ID]<br/>
                2. https://www.youtube.com/watch?v=[동영상ID]<br/>
                3. https://youtu.be/[동영상ID]
            </q-tooltip>
          </q-icon>
        </q-card-section>

        <q-card-section>
          <q-input
            dense
            v-model="tubeStr"
            autofocus
            @keyup.enter="isOpen = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="취소" v-close-popup />
          <q-btn flat label="확인" @click="onClick"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TubePromptDialog',
  data () {
    return {
      isOpen: false,
      tubeStr: ''
      // tubeStr: 'https://youtu.be/H-AcDBLqxi4'
    }
  },
  computed: {
    ...mapState('auth', [
      'gymInfo'
    ])
  },
  methods: {
    ...mapActions('community', [
      'reqAddTube'
    ]),
    async onClick () {
      const vedioKey = this.getVedioKey()
      try {
        await this.reqAddTube({ key: vedioKey, gymid: this.gymInfo.id })
        this.isOpen = false
        this.tubeStr = ''
      } catch (e) {
      }
    },
    /**
     * 동영상 키 추출
     */
    getVedioKey () {
      // 동영상 키 추출
      let str = ''
      if (/^https:\/\/www.youtube.com\/watch\?v=/.test(this.tubeStr)) {
        const url = new URL(this.tubeStr)
        str = url.searchParams.get('v')
      } else if (/^https:\/\/youtu.be\//.test(this.tubeStr)) {
        str = this.tubeStr.split(/^https:\/\/youtu.be\//)[1]
      } else {
        str = this.tubeStr
      }
      return str
    },
    getUrlPrams (urls) {
      var params = {}
      window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => { params[key] = value })
      return params
    },
    show () {
      this.isOpen = true
    }
  }
}
</script>
