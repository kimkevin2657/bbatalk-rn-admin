# 세션 정보 추가하기

세션의 정보를 변경합니다.

**Method** : `PUT`

**URL** : `/api/session`

## Query
* 쿼리는 `{속성}:{값}`으로 검색됩니다.
```javascript
// name 속성으로 검색
/api/session?name=룸1
// desc 속성으로 검색
/api/session?desc=설명등등
...
```

## Body
* 변경하고자 하는 부분의 속성을 포함한 JSON 형식의 데이터를 전송합니다.
```javascript
{
	"desc": "테니스 15명"
}
```

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "_id": "5d8fa4b0e1e5813e63462a26",
    "create_t": "2019-09-28T18:16:29.392Z",
    "name": "세션3",
    "desc": "사이클 20명",
    "gym": {
        "id": "5d8f7c3eb9722f2d569dba61",
        "name": "웰페리온"
    },
    "count": 15,
    "month": 4,
    "amount": 1000000,
    "etc": "테스트 세션",
    "card": true,
    "visible": true,
    "__v": 0
}

or

null
```

## Notes
* 쿼리에 해당하는 도큐먼트를 찾아 속성의 값을 변경합니다.
* 반환 값은 변경 전의 도큐먼트를 반환합니다.