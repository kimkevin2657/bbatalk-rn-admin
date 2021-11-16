<template>
  <div class="auth-grid-container">
    <div class="auth-gird-header"></div>
    <!-- 타이틀 & 로고 영역 -->
    <!-- <div class="grid-title"></div> -->
    <div class="auth-grid-body">
      <div class="auth-grid-left" />
      <!-- 카드 영역 -->
      <div class="auth-grid-center">
        <q-card>
          <q-card-section>
            <div class="column items-center">
              <div class="col">
                <p class="auto-title">
                  {{title}}
                </p>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-tabs
              v-model="tab"
              class="text-grey"
              active-color="indigo"
              indicator-color="indigo"
              align="justify"
            >
              <q-tab name="1" label="1. 약관동의" :disable="tab !== '1'"/>
              <q-tab name="2" label="2. 본인인증" :disable="tab !== '2'"/>
              <q-tab name="3" label="3. 정보입력" :disable="tab !== '3'"/>
              <q-tab name="4" label="4. 가입완료" :disable="tab !== '4'"/>
            </q-tabs>
          </q-card-section>
          <q-card-section>
            <div>
              <join-agree-template
                :type="$route.params.type"
                v-show="tab === '1'"
                @complete="tab = '2'"
              />
              <join-auth-template
                :type="$route.params.type"
                v-show="tab === '2'"
                @complete="tab = '3'"
              />
              <join-user-info-template
                :type="$route.params.type"
                v-show="tab === '3'"
                @complete="tab = '4'"
              />
              <join-complete-template
                :type="$route.params.type"
                v-show="tab === '4'"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="auth-grid-right" />
    </div>
    <div class="auth-grid-footer"></div>
  </div>
</template>

<script>
import JoinAgreeTemplate from './regMember/JoinAgreeTemplate'
import JoinAuthTemplate from './regMember/JoinAuthTemplate'
import JoinUserInfoTemplate from './regMember/JoinUserInfoTemplate'
import JoinCompleteTemplate from './regMember/JoinCompleteTemplate'
export default {
  name: 'RegMember',
  components: {
    JoinAgreeTemplate,
    JoinAuthTemplate,
    JoinUserInfoTemplate,
    JoinCompleteTemplate
  },
  computed: {
    title () {
      const type = this.$route.params.type
      if (type === 'teacher') return '강사 회원 가입'
      if (type === 'manager') return '기업 회원 가입'
      return '일반 회원 가입'
    }
  },
  data () {
    return {
      tab: '1'
    }
  }
}
</script>
