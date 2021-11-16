## 데이터 증가 관리 전략 (로그 관리)

테이블의 크기가 증가 할 수록 로그의 양이 무한대로 증가 할 수 있다.

무한대로 증가할 경우 메모리에 차지하는 Index 부터 성능의 영향을 미칠 수 있다.

아래와 같은 전략 중 하나를 선택하여 데이터를 관리해야한다.

 ### Capped Collections
   * Capped Collections는 크기가 고정되어 있으며 Cap에 도달 한 이후 새 데이터를 삽입 할 때 오래된 데이터를 제거한다.
 ### Multiple Collections, Single Database
   * Collection의 이름을 정기적으로 변경하며 필요한 경우 데이터베이스에서 오래된 컬렉션을 삭제 할 수 있다.
   * 장점
        1. 컬렉션 이름 바꾸기는 빠르다.
        2. mongodb는 컬렉션을 삭제 할 때에 메모리로 가져오지 않는다.
        3. mongodb는 데이터 조각화 없이 전체 컬렉션을 제거하여 사용 가능한 공간을 효율적으로 재사용할 수 있다.

   * 현재 및 이전 데이터를 분석할 수 있는 이벤트에 의존하는 분석이 있는 경우 쿼리의 복잡성을 증가 시킬수 있다.
   * 하지만 대부분의 실시간 데이터 수집 시스템의 경우 이 방법이 가장 이상적이다.
 ### Multiple Databases
   * "Multiple Collections, Single Database" 전략과 같이 DB를 변경한다.
   * 이렇게 할 경우 삽입이나 쿼리에 복잡성이 크게 증가하지만 MongoDB는 디스크 공간을 파일 시스템으로 반환한다.
   * 이벤트 삽입률 및 데이터 보존률이 매우 다양한 시나리오에서 가장 적합하다.
   
## 적용방법
 * 두번째 전략인 "Multiple Collections, Single Database"를 적용하여 로그 Collection을 년도별로 생성하여 관리를 할 수 있도록 한다.
 * Log Collection들을 관리 할 수 있는 tblManager를 통해서 로그 Collection을 관리하고 NodeJS에서는 서버 시작 시에 
   해당 컬렉션을 조회하고 Shcema를 주입한다.
 * 년도 별로 Log Collection을 생성 및 제거 할 수 있는 로직을 설계 및 추가한다.
 * 로그를 추가 할 때에는 현재 년도의 컬렉션으로 추가를 한다.
 * 쿼리 시에 일자의 조회 범위를 확인하고 Aggregation의 $lookup을 통해 현재 컬렉션에 Join하고 $match를 통해 쿼리 하여 결과를 반환한다.
