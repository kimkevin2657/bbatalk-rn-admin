# 강사 정보 제거하기

강사의 정보를 제거합니다.

**Method** : `DELETE`

**URL** : `/api/teacher`

## Query
* 쿼리는 `{속성}:{값}`으로 검색됩니다.
```javascript
// id 속성으로 검색
/api/teacher?id=np1
// name 속성으로 검색
/api/teacher?name=김정민
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