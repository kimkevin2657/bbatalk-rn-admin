# Moment.js 활용

날짜 관련 데이터를 파싱, 검증, 조작, 그리고 출력을 위해서 주로 이용되는 라이브러리이다.

## 주로 사용되는 함수

* 현재 시간

    ```javascript
    var now = moment()
    ```

* 문자열을 통한 시간정보 생성
    ```javascript
    var time = moment('2020-01-01')
    ```

* 정형화된 시간정보
    
    원하는 형태의 시간정보를 생성할 수 있다.
    ```javascript
    moment().format('YYYY-MM-DD HH:mm:ss')
    ```

* 상대적인 시간

    특정 시간정보가 지금으로부터 어느 정도의 시간거리를 가지는지 대략적으로 알 수 있다.
    ```javascript
    moment('20150101', 'YYYYMMDD').fromNow() // 5 years ago
    moment().startOf('day').fromNow() // 19 hours ago
    moment().endOf('day').fromNow() // in 5 hours
    moment().startOf('hour').formNow() // 34 minutes ago

    ```

* 시간 차이 계산

    ```javascript
    moment('2016-06', 'YYYY-MM').diff('2015-01', 'month') // 17
    ```

* 날짜 사이의 값 확인

    ```javascript
    /*
        Usage: date.isBetween(start, finish, type, '()')
        type: years, months, days, hours, minutes, seconds, milliseconds(default)
        (, ) : 일치할 시 값의 불포함 (<=, >=)
        [, ] : 일치할 시 값의 포함 (<, >)
    */
    const date = moment('2020/04/14')
    const sdate = moment('2020/01/01')
    const edate = moment('2020/05/01')
    date.isBetween(sdate, edate)
    ```
