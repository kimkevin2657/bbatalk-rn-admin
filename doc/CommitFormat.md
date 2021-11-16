## Github 커밋 메시지 포맷

### Github commit message 이슈에 자동 링크
 * Github에서 commit을 할때에 "#[Issue Number]"를 입력하게 될 경우 자동으로 이슈에 커밋 내용을 추가하여 준다.

### 커밋과 함께 이슈를 Close 할 수 있는 Keyword
 * 이슈에 올라온 버그 또는 기능을 수정하였을 때에 "[Keyword] #[Issue]"를 입력하게 되면 이슈가 Close 되면서 자동 링크가 생성된다.

 * Keyword
   * close
   * closes
   * closed
   * fix
   * fixes
   * fixed
   * resolve
   * resolves
   * resolved

 * ex) fix #2


### Repository에 Commit Message 형식
 * 이슈에 커밋 자동 등록 하기
    ```
    #2 - 기능에 대해서 수정하였습니다.
    ```
 * 이슈에 커밋 자동 등록 및 이슈 닫기
    ```
    fix #2 - 버그를 수정하였습니다.
    ```
