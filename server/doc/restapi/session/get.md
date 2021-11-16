# 세션 정보 가져오기

세션의 정보를 하나만 가져옵니다.

**Method** : `GET`

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

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "code": "ok",
    "result": {
        "_id": "5d8fa283749b553221a4f5ae",
        "create_t": "2019-09-28T16:08:39.059Z",
        "name": "세션1",
        "desc": "테니스 10명",
        "gym": {
            "id": "5d8f7c3eb9722f2d569dba61",
            "name": "웰페리온"
        },
        "count": 10,
        "month": 3,
        "amount": 2000000,
        "etc": "테스트 세션",
        "card": true,
        "visible": true,
        "__v": 0
    }
}

or 

null
```

## Notes
* 쿼리에 해당하는 하나의 도큐먼트를 가져옵니다.