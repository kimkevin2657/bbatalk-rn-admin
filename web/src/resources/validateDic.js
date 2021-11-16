/**
 * 유효성 검사 시 화면에 출력되는 메세지를 정의한다.
 */

const dictionary = {
  ko: {
    messages: {
      required: '필수 입력 항목입니다.',
      email: '이메일 형식으로 입력',
      id: '영문,숫자,_만 입력 가능(4~20자)',
      password: '영문,숫자,특수기호를 포함한 비밀번호(8~32자)',
      pwdcheck: '비밀번호가 일치하지 않습니다.',
      phone: '숫자, - 를 포함한 숫자만 입력',
      ip: 'IP 주소만 입력할 수 있습니다.',
      time: 'HH:MM 형식으로 입력하세요.',
      date: 'YYYY-MM-DD 형식으로 입력하세요.',
      max_value: '최대값 이상으로 입력 할 수 없습니다.',
      min_value: '최소값 이하로 입력 할 수 없습니다.',
      range_date: '입력 기간이 범위를 벗어났습니다.'
    }
  }
}

export {
  dictionary
}
