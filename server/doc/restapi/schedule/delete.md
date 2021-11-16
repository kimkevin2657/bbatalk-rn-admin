# 세션 정보 제거하기

스케줄의 정보를 제거합니다.

**Method** : `DELETE`

**URL** : `/api/schedule`

## Query
* 쿼리는 `{속성}:{값}`으로 검색됩니다.
```javascript
// teacher Object내부 name 속성으로 검색
/api/schedule?teacher.name=김남욱
// member Array 내부 객체 중 name 속성으로 검색
/api/schedule?member.name=김진현
// stime 보다 큰 etime 보다 작은 값으로 검색
/api/schedule/all?stime=2019-09-29T06:00:00.000Z&etime=2019-09-29T07:00:00.000Z
...
```

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "code": "ok"
}

or 

null
```

## Notes
* 쿼리된 내용의 도큐먼트를 반환하면서 Document가 제거 됩니다.
* 도큐먼트는 하나만 제거됩니다.