<template>
  <div>
    <top>
      <template v-slot:body>
        <!-- 헤더 사이드 추가/수정/삭제 Template -->
        <header-edit-template
          v-if="[].indexOf(tab) >= 0"
          @add="onEvtClick('add')"
          @edit="onEvtClick('edit')"
          @remove="onEvtClick('remove')"
          :disables="buttonDisables"
        />
      </template>
    </top>
    <q-scroll-area style="height: calc(100vh - 110px);">
      <div :class="$q.screen.gt.md ? 'q-pa-md' : ''">
        <div class="q-gutter-y-md">
          <q-card>
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="product" label="상품" />
              <q-tab name="member" label="회원" />
              <q-tab name="staff" label="직원" />
              <q-tab name="room" label="룸" />
              <!-- <q-tab name="inquiry" label="문의 설정" /> -->
              <!-- <q-btn-dropdown auto-close stretch flat label="옵션 설정">
                <q-list>
                    <q-item clickable @click="tab = 'option'">
                    <q-item-section>락커 설정</q-item-section>
                    </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-tab name="servey" label="설문지 설정" /> -->
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="inquiry">
                <m-inquiry-setting ref="inquirySetting"/>
              </q-tab-panel>

              <q-tab-panel name="member">
                  <m-member-setting ref="memberSetting" />
              </q-tab-panel>

              <q-tab-panel name="product">
                <m-product-setting
                  ref="productSetting"
                />
              </q-tab-panel>

              <q-tab-panel name="staff">
                <m-staff-setting ref="staffSetting"/>
              </q-tab-panel>

              <q-tab-panel name="room">
                <m-room-setting
                  ref="roomSetting"
                />
              </q-tab-panel>

              <q-tab-panel name="option">
                <m-option-setting ref="optionSetting"/>
              </q-tab-panel>

              <q-tab-panel name="servey">
                <m-servey-setting ref="serveySetting"/>
              </q-tab-panel>

            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
// 컴포넌트
import MInquirySetting from './Layout/MInquirySetting'
import MMemberSetting from './Layout/MMemberSetting'
import MProductSetting from './Layout/MProductSetting'
import MStaffSetting from './Layout/MStaffSetting'
import MRoomSetting from './Layout/MRoomSetting'
import MOptionSetting from './Layout/MOptionSetting'
import MServeySetting from './Layout/MServeySetting'
import Top from '../../../layouts/component/Top'
import HeaderEditTemplate from '../../../layouts/template/HeaderEditTemplate'
export default {
  components: {
    Top,
    HeaderEditTemplate,
    MInquirySetting,
    MMemberSetting,
    MProductSetting,
    MStaffSetting,
    MRoomSetting,
    MOptionSetting,
    MServeySetting
  },
  data () {
    return {
      tab: 'product',
      dataSelected: []
    }
  },
  computed: {
    buttonDisables () {
      const selectedSize = _.size(this.dataSelected)
      if (selectedSize === 0) return ['remove', 'edit']
      if (selectedSize === 1) return []
      if (selectedSize > 1) return ['edit']
      return []
    }
  },
  methods: {
    onEvtClick (type) {
      const evtDict = {
        inquiry: 'inquirySetting',
        member: 'memberSetting',
        product: 'productSetting',
        staff: 'staffSetting',
        room: 'roomSetting',
        option: 'optionSetting',
        servey: 'serveySetting'
      }
      const evtRefsKey = evtDict[this.tab]
      if (!evtRefsKey) return
      if (type === 'add' && _.has(this.$refs, [evtRefsKey, 'onAdd'])) {
        this.$refs[evtRefsKey].onAdd()
      }
      if (type === 'edit' && _.has(this.$refs, [evtRefsKey, 'onEdit'])) {
        this.$refs[evtRefsKey].onEdit()
      }
      if (type === 'remove' && _.has(this.$refs, [evtRefsKey, 'onRemove'])) {
        this.$refs[evtRefsKey].onRemove()
      }
    }
  }
}
</script>
