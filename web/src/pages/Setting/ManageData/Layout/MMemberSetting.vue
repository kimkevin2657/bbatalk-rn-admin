<template>
  <div :class="$q.screen.gt.md ? 'q-pa-md' : ''">
    <div class="q-mb-md row">
      <q-space />
      <q-checkbox
        v-model="isMemberGroup"
        label="회원 분류"
        color="blue-grey"
        class="q-mr-sm"
        dense
      />
      <q-checkbox
        v-model="isMemberRank"
        label="회원 등급"
        color="blue-grey"
        class="q-mr-sm"
        dense
      />
      <q-checkbox
        v-model="isMemberType"
        label="회원 구분"
        color="blue-grey"
        class="q-mr-sm"
        dense
      />
      <q-checkbox
        v-model="isRegPath"
        label="등록 경로"
        color="blue-grey"
        class="q-mr-sm"
        dense
      />
    </div>
    <MemberGroupTemplate v-show="isMemberGroup" />
    <br
      style="margin-bottom: 10px;"
      v-show="isMemberGroup"
    />
    <MemberRankTemplate v-show="isMemberRank" />
    <br
      style="margin-bottom: 10px;"
      v-show="isMemberRank"
    />
    <MemberTypeTemplate v-show="isMemberType" />
    <br
      style="margin-bottom: 10px;"
      v-show="isMemberType"
    />
    <RegPathTemplate v-show="isRegPath" />
    <!-- <br style="margin-bottom: 10px;"/>
    <RegTypeTemplate /> -->
  </div>
</template>

<script>
import MemberGroupTemplate from './mMemberSetting/MemberGroupTemplate'
import MemberRankTemplate from './mMemberSetting/MemberRankTemplate'
import MemberTypeTemplate from './mMemberSetting/MemberTypeTemplate'
import RegPathTemplate from './mMemberSetting/RegPathTemplate'
// import RegTypeTemplate from './mMemberSetting/RegTypeTemplate'
export default {
  name: 'MMemerSetting',
  components: {
    MemberGroupTemplate,
    MemberRankTemplate,
    MemberTypeTemplate,
    RegPathTemplate
    // RegTypeTemplate
  },
  data () {
    return {
      isMemberGroup: true,
      isMemberRank: true,
      isMemberType: true,
      isRegPath: true
    }
  }
}
</script>
