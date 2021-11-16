export default {
  methods: {
    onRemove (fn) {
      const msgArr = [
        '선택된 항목을 제거 하시겠습니까?'
      ]
      const opts = {
        title: '제거',
        useButtons: ['confirm', 'cancel'],
        textAlign: 'left'
      }
      this.$msg.show(msgArr.join('\n'), opts, function (btnKey) {
        this.$msg.hide()
        if (btnKey !== 'confirm') return
        fn() // 전달 받은 함수 실행
      })
    }
  }
}
