// 강사정보 - 프로필 템플릿
<template>
  <q-card class="q-pb-sm">
    <q-item dense>
      <q-card-section>
        <q-item-label class="text-h5">프로필</q-item-label>
        <q-item-label caption>강사의 기본 정보를 확인 할 수 있습니다.</q-item-label>
      </q-card-section>
    </q-item>
    <q-list class="q-px-md">
      <!-- 이름 & 사진 -->
      <q-item dense>
        <q-item-section :class="$q.screen.gt.md ? 'staff-card-header' : 'staff-card-header-small'">
          <q-item-label caption>이름</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{staffName}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-avatar size="60px">
            <img :src="staffData.photo">
          </q-avatar>
        </q-item-section>
      </q-item>
      <q-separator inset="item" />
      <!-- 생년월일 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'staff-card-header' : 'staff-card-header-small'">
          <q-item-label caption>생년월일</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{staffData.birth}}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label top caption>{{staffBirth}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset="item" />
      <!-- 성별 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'staff-card-header' : 'staff-card-header-small'">
          <q-item-label caption>성별</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{staffGender}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset="item" />
      <!-- 주소 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'staff-card-header' : 'staff-card-header-small'">
          <q-item-label caption>주소</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{`${staffData.address_f} ${staffData.address_l}`}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset="item" />
      <!-- 연락처 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'staff-card-header' : 'staff-card-header-small'">
          <q-item-label caption>연락처</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{staffData.phone}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset="item" />
      <!-- 연락처 -->
      <q-item>
        <q-item-section :class="$q.screen.gt.md ? 'staff-card-header' : 'staff-card-header-small'">
          <q-item-label caption>이메일</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 16px">{{staffData.email}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'StaffDetailProfileCard',
  computed: {
    ...mapState('staff', [
      'staffData'
    ]),
    staffName () {
      let name = this.staffData.name
      if (this.staffData.engName) name += ` (${this.staffData.engName})`
      return name
    },
    staffGender () {
      if (this.staffData.gender === 'man') return '남성'
      return '여성'
    },
    staffBirth () {
      const val = this.staffData.birth
      const birthday = new Date(val)
      const today = new Date()
      let years = today.getFullYear() - birthday.getFullYear()
      let korOld = years + 1
      birthday.setFullYear(today.getFullYear())
      if (today < birthday) years--
      return `${korOld}살 (만 ${years}살)`
    }
  }
}
</script>

<style scoped>
.staff-card-header {
  max-width: 120px;
  min-width: 120px;
}

.staff-card-header-small {
  max-width: 70px;
  min-width: 70px;
}
</style>
