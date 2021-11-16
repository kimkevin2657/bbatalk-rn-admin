# 모든 세션 정보 가져오기

세션의 모든 정보를 가져 올 수 있습니다.

**Method** : `GET`

**URL** : `/api/session/all`

## Query
* 쿼리는 `{속성}:{값}`으로 검색됩니다.
```javascript
// name 속성으로 검색
/api/session?name=세션1
// desc 속성으로 검색
/api/session?desc=true
...
```

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "code": "ok",
    "result": [
        {
            "_id": "5d8fa398e1e5813e63462a25",
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
        },
        {
            "_id": "5d8fa2ec749b553221a4f5af",
            "create_t": "2019-09-28T16:08:39.059Z",
            "name": "세션2",
            "desc": "수영 10명",
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
        },
        {
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
    ]
}
```

## Notes
* 쿼리에 해당하는 모든 항목을 가져올 수 있습니다.