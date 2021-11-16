# server

## 실행 방법
```bash
// node_modules가 없다면 아래 명령어 실행
$npm install

// server 디렉토리 하위에 data 폴더가 없다면 생성할 것
$mkdir data

// windows
$npm run mongo
$npm run server

//linux
$npm run mongo:linux
$npm run server

// mac
$npm run mongo:mac
$npm run server
```
linux 용 mongod binary가 bin directory에 없으므로 환경에 맞는 빌드해야 함.

## GraphQL
 - Graphiql: https://ffaso.com/graphql
 - GrapqhQL Voyager: https://ffaso.com/voyager

<!--
## Model

|모델 명|링크|
|:---|:---|
| 센터 | [Gym] |
| 회원 | [User] |
| 강사 | [Teacher] |
| 스케줄 | [Schedule] |
| 락커 | [Locker] |
| 룸 | [Room] |
| 세션 | [Session] |


## REST API
* Gym
  * [모든 센터 정보 가져오기] : /gym/all (GET)
  * [센터 정보 가져오기] : /gym (GET)
  * [센터 정보 추가하기] : /gym (POST)
  * [센터 정보 수정하기] : /gym (PUT)
  * [센터 정보 제거하기] : /gym (DELETE)
  
* User
  * [모든 회원 정보 가져오기] : /user/all (GET)
  * [회원 정보 가져오기] : /user (GET)
  * [회원 정보 추가하기] : /user (POST)
  * [회원 정보 수정하기] : /user (PUT)
  * [회원 정보 제거하기] : /user (DELETE)
  
* Teacher
  * [모든 강사 정보 가져오기] : /teacher/all (GET)
  * [강사 정보 가져오기] : /teacher (GET)
  * [강사 정보 추가하기] : /teacher (POST)
  * [강사 정보 수정하기] : /teacher (PUT)
  * [강사 정보 제거하기] : /teacher (DELETE)
  
* Schedule
  * [모든 스케줄 정보 가져오기] : /schedule/all (GET)
  * [스케줄 정보 가져오기] : /schedule (GET)
  * [스케줄 정보 추가하기] : /schedule (POST)
  * [스케줄 정보 수정하기] : /schedule (PUT)
  * [스케줄 정보 제거하기] : /schedule (DELETE)

* Locker
  * [모든 락커 정보 가져오기] : /locker/all (GET)
  * [락커 정보 가져오기] : /locker (GET)
  * [락커 정보 추가하기] : /locker (POST)
  * [락커 정보 수정하기] : /locker (PUT)
  * [락커 정보 제거하기] : /locker (DELETE)
  
* Room
  * [모든 룸 정보 가져오기] : /room/all (GET)
  * [룸 정보 가져오기] : /room (GET)
  * [룸 정보 추가하기] : /room (POST)
  * [룸 정보 수정하기] : /room (PUT)
  * [룸 정보 제거하기] : /room (DELETE)
  
* Session
  * [모든 세션 정보 가져오기] : /session/all (GET)
  * [세션 정보 가져오기] : /session (GET)
  * [세션 정보 추가하기] : /session (POST)
  * [세션 정보 수정하기] : /session (PUT)
  * [세션 정보 제거하기] : /session (DELETE)
-->

[Gym]: https://github.com/programrubber/nopeople/blob/master/server/src/models/gymSchema.js
[User]: https://github.com/programrubber/nopeople/blob/master/server/src/models/userSchema.js
[Teacher]: https://github.com/programrubber/nopeople/blob/master/server/src/models/teacherSchema.js
[Schedule]: https://github.com/programrubber/nopeople/blob/master/server/src/models/scheduleSchema.js
[Locker]: https://github.com/programrubber/nopeople/blob/master/server/src/models/lockerSchema.js
[Room]: https://github.com/programrubber/nopeople/blob/master/server/src/models/roomSchema.js
[Session]: https://github.com/programrubber/nopeople/blob/master/server/src/models/sessionSchema.js

[Postman]: https://www.getpostman.com/collections/75f8375e8ca65f4ad4e4

[모든 센터 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/gym/allget.md
[센터 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/gym/get.md
[센터 정보 추가하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/gym/post.md
[센터 정보 수정하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/gym/put.md
[센터 정보 제거하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/gym/delete.md
  
[모든 회원 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/user/allget.md
[회원 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/user/get.md
[회원 정보 추가하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/user/post.md
[회원 정보 수정하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/user/put.md
[회원 정보 제거하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/user/delete.md
  
[모든 강사 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/teacher/allget.md
[강사 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/teacher/get.md
[강사 정보 추가하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/teacher/post.md
[강사 정보 수정하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/teacher/put.md
[강사 정보 제거하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/teacher/delete.md
  
[모든 스케줄 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/schedule/allget.md
[스케줄 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/schedule/get.md
[스케줄 정보 추가하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/schedule/post.md
[스케줄 정보 수정하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/schedule/put.md
[스케줄 정보 제거하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/schedule/delete.md

[모든 락커 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/locker/allget.md
[락커 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/locker/get.md
[락커 정보 추가하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/locker/post.md
[락커 정보 수정하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/locker/put.md
[락커 정보 제거하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/locker/delete.md
  
[모든 룸 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/room/allget.md
[룸 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/room/get.md
[룸 정보 추가하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/room/post.md
[룸 정보 수정하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/room/put.md
[룸 정보 제거하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/room/delete.md
  
[모든 세션 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/session/allget.md
[세션 정보 가져오기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/session/get.md
[세션 정보 추가하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/session/post.md
[세션 정보 수정하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/session/put.md
[세션 정보 제거하기]: https://github.com/programrubber/nopeople/blob/master/server/doc/restapi/session/delete.md
