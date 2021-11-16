<template>
  <div class="grid-container">
    <div class="auth-form-box">
      <div style="text-align:center; margin-top: 50px;">
        <q-icon name="fas fa-check" class="text-green" style="font-size: 32px;" />
      </div>
      <h2 class="form-title" style="text-align:center; padding-top: 0; margin-top: 0;">
        회원가입이 완료되었습니다!
      </h2>
      <div style="text-align:center;">모든 회원가입 절차가 완료되었습니다.</div>
      <div style="text-align:center;">로그인 후 서비스를 이용할 수 있습니다.</div>
      <q-space/>
      <div class="column items-center" style="margin: 30px 0">
        <div class="col">
          <q-btn
            :to="'/auth/login'"
            style="margin-right:15px; text-align:center;"
            color="indigo"
            label="로그인 화면으로"
          />
        </div>
      </div>
      <q-space/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JoinComplateTemplate'
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-rows: auto 40px 50px;
}

.form-title {
  color: #333;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  font-weight: normal;
  text-align: left;
}

h2 {
  display: block;
  font-size: 1.6em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}

table {
  border: 1px solid #ddd;
  border-collapse: separate;
  border-spacing: 2px;
  border-color: grey;
  background-color: transparent;
  border-collapse: collapse;
  /* width: 600px; */
  margin: 10px 0 10px 0px;
}
th, td {
  border: 1px solid #ddd;
  padding: 7px 15px;
  text-align: left;
}
th {
  background-color: #F1F1F1;
}

</style>
