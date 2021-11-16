<template>
  <q-drawer
    v-model="isLeftOpen"
    content-class="bg-blue-grey-10"
    show-if-above
    bordered
    elevated
    :width="250"
    dark
  >
    <!-- elevated : 사이드바 오른쪽 그림자 추가 -->
    <q-scroll-area style="height: 100%;">
      <!-- 센터 목록 정보 -->
      <q-item
        clickable
        class="bg-blue-grey-9 subitem col"
      >
        <!-- 센터 선택 목록 -->
        <q-select
          v-model="gymData._id"
          :options="gymDataList"
          class="col-12"
          option-value="_id"
          option-label="name"
          emit-value
          map-options
          hide-bottom-space
          dark
          flat
          dense
        >
        </q-select>
      </q-item>
      <!-- 메뉴 출력 부 -->
      <q-list>
        <template v-for="(menu, index) in menus">
          <!-- 부모 메뉴 -->
          <q-item
            v-show="!menu.children"
            clickable
            tag="a"
            :key="index"
            :to="menu.to"
          >
            <q-item-section avatar>
              <q-icon :name="menu.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{menu.label}}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- 자식을 가진 부모 메뉴 -->
          <q-expansion-item
            :v-model="menu.isOpen"
            :value="menu.isOpen"
            v-show="menu.children"
            :key="'e'+index"
            expand-separator
            :icon="menu.icon"
            :label="menu.label"
            @input="(val) => onChnageMenu(menu.label, val)"
          >
            <template v-for="(cMenu, cIndex) in menu.children">
              <!-- 자식 메뉴 -->
              <q-item
                v-if="!cMenu.hidden"
                clickable
                tag="a"
                :key="'c'+cIndex"
                :to="cMenu.to"
                class="bg-blue-grey-9 subitem"
              >
                <!-- icon -->
                <q-item-section avatar>
                  <q-icon
                    v-show="cMenu.icon"
                    :name="cMenu.icon"
                  />
                  <q-icon
                    v-show="!cMenu.icon"
                    :name='"keyboard_arrow_right"'
                  />
                </q-item-section>
                <!-- label -->
                <q-item-section>
                  <q-item-label>{{cMenu.label}}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-expansion-item>
        </template>
        <q-separator />
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
// 정의
import { managerMenu, teacherMenu, uesrMenu } from './layoutDefine'
export default {
  name: 'MSidebar',
  data () {
    return {
      isOpen: true,
      menus: []
    }
  },
  async mounted () {
    try {
      await this.reqGetGymData()
      await this.reqGetGymDataList()
    } catch (e) {
      this.$notify.error(e.toString())
    }

    if (this.memberType === 'manager') this.menus = _.cloneDeep(managerMenu)
    if (this.memberType === 'teacher') this.menus = _.cloneDeep(teacherMenu)
    if (this.memberType === 'user') this.menus = _.cloneDeep(uesrMenu)
  },
  computed: {
    ...mapState('managerLayout', [
      'leftDrawerOpen'
    ]),
    ...mapState('auth', [
      'memberType'
    ]),
    ...mapState('gym', [
      'gymData',
      'gymDataList'
    ]),
    isLeftOpen: {
      get () {
        if (!this.$q.screen.lt.md) return true
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
    ...mapActions('gym', [
      'reqGetGymDataList',
      'reqGetGymData'
    ]),
    onChnageMenu (menuLabel, val) {
      const tempMenu = _.cloneDeep(this.menus)
      _.forEach(tempMenu, o => {
        if (o.label === menuLabel) {
          o.isOpen = val
          return
        }
        o.isOpen = false
      })
      this.menus = tempMenu
    }
  }
}
</script>

<style scoped lang="scss">
.subitem {
  font-size: 0.9em;
  padding: 0px 25px;
}
.char-icon {
  -webkit-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
  margin: 0px 15px 0;
  border-radius: 30px;
  color: #fff;
  display: block;
  text-decoration: none;
  position: relative;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.7142em;
  padding: 0px 8px;
  line-height: 0.525rem;
}

.shadow-box {
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  font-size: 12px;
  text-align: center;
  img {
    width: 70px;
    height: 70px;
    border-radius: 100%;
  }
}

.m-center {
  display: block;
  text-align: center;
}
</style>
