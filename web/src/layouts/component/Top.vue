<template>
  <q-card square>
    <q-toolbar>
      <q-breadcrumbs>
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="primary"
          />
        </template>
        <q-breadcrumbs-el v-if="middleMenu && $q.screen.gt.sm" :label="middleMenu.label" />
        <q-breadcrumbs-el>
          <q-select
            v-model="pageInfo"
            :options="filteredMenu"
            option-value="to"
            option-label="label"
            flat
            dense
            borderless
            @input="movePage"
          />
        </q-breadcrumbs-el>
      </q-breadcrumbs>

      <q-space/>

      <slot name="body" />
    </q-toolbar>
  </q-card>
</template>

<script>
// this.$route.query.menuName 메뉴명 가져오기?
import { mapState, mapMutations } from 'vuex'
import { managerMenu } from '../managerLayout/layoutDefine'
export default {
  name: 'Top',
  data () {
    return {
      pageInfo: ''
    }
  },
  async mounted () {
    await this.$nextTick()
    const index = _.findIndex(this.middleMenu.children, o => o.to === this.$route.path)
    this.pageInfo = _.get(this.middleMenu.children, [index], void 0)
  },
  computed: {
    ...mapState('managerLayout', [
      'leftDrawerOpen'
    ]),
    middleMenu () {
      let middleKey = void 0
      const paths = this.$route.path.split('/')
      middleKey = paths[2]
      const index = _.findIndex(managerMenu, o => o.key === middleKey)
      const menuItem = _.get(managerMenu, [index], void 0)
      return menuItem
    },
    filteredMenu () {
      if (!_.isArray(this.middleMenu.children)) return []
      return this.middleMenu.children.filter(o => {
        if (o.to !== this.$route.path && o.hidden) return false
        return true
      })
    },
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
    ]),
    movePage (pageinfo) {
      if (this.$route.path === pageinfo.to) return
      this.$router.push(pageinfo.to)
    }
  }
}
</script>
