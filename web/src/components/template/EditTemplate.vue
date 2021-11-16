/**
헤더의 추가/수정/삭제 템플릿
 */
<template>
  <div style="align-self: flex-end;">
    <!-- 1024px 이하, Mobile & Tablet -->
    <template v-if="$q.screen.lt.sm && flex">
      <!-- 헤더 툴팁 모음 -->
      <q-btn icon="mdi-playlist-edit" round dense flat>
        <q-menu
          :offset="[80, 10]"
          transition-show="flip-right"
          transition-hide="flip-left"
          anchor="bottom left"
        >
          <q-list>
            <q-item-label header>편집</q-item-label>
            <template v-for="(menu, n) in menus">
              <q-item
                v-if="visibles.findIndex(o => o === menu.key) >= 0"
                :key="`x.${n}`"
                :disable="disables.findIndex(o => o === menu.key) !== -1"
                clickable
                v-close-popup tabindex="0"
                @click="onClick(menu.key)"
              >
                <q-item-section avatar>
                  <q-avatar :icon="menu.sIcon" :color="menu.color" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{menu.title}}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-menu>
      </q-btn>
    </template>
    <!-- 1024px 이상, Desktop -->
    <template v-else v-for="(menu, n) in menus">
      <q-btn
        v-if="visibles.findIndex(o => o === menu.key) >= 0"
        :key="`d.${n}`"
        :label="menu.title"
        :icon="menu.icon"
        :disable="disables.findIndex(o => o === menu.key) !== -1"
        :size="'12px'"
        color="black"
        flat
        dense
        @click="onClick(menu.key)"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'EditTemplate',
  props: {
    disables: {
      type: Array,
      default: () => []
    },
    visibles: {
      type: Array,
      default: () => ['add', 'edit', 'remove']
    },
    flex: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      menus: [
        { key: 'add', icon: 'add_circle_outline', sIcon: 'add', title: '추가', color: 'primary' },
        { key: 'edit', icon: 'edit', sIcon: 'edit', title: '수정', color: 'teal' },
        { key: 'remove', icon: 'delete', sIcon: 'delete', title: '삭제', color: 'negative' }
      ]
    }
  },
  methods: {
    onClick (evtType) {
      this.$emit(evtType)
    }
  }
}
</script>
