<template>
  <q-header bordered class="bg-white text-primary">
    <q-toolbar>
      <div class="row" style="width: 100%">
        <div class="col">
          <q-btn
            v-if="$q.screen.lt.md"
            flat
            dense
            round
            @click="leftOpen = !leftOpen"
            icon="menu"
            aria-label="Menu"
          />
          <q-btn
            flat
            dense
          >
            <img src="~assets/images/logo.png" style="width: 130px; height: 50px;">
          </q-btn>
        </div>
        <q-space />
        <!-- 터치 출석 -->
        <q-btn
          v-if="$q.screen.gt.sm"
          icon="mdi-gesture-tap-button"
          dense
          flat
          text-color="blue-grey"
          @click="$router.push('/Checkin')"
        >
          <q-tooltip :content-style="'min-width: 60px'">
            터치 출석
          </q-tooltip>
        </q-btn>
      </div>
      <slot name="body" />
    </q-toolbar>
  </q-header>
</template>

<script>
// this.$route.query.menuName 메뉴명 가져오기?
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'MHeader',
  computed: {
    ...mapState('managerLayout', [
      'leftDrawerOpen'
    ]),
    leftOpen: {
      get () {
        return this.leftDrawerOpen
      },
      set (isVal) {
        this.setLeftDrawerOpen(isVal)
      }
    }
  },
  methods: {
    ...mapMutations('managerLayout', [
      'setLeftDrawerOpen'
    ])
  }
}
</script>
