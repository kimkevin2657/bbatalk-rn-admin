# 세션 정보 추가하기

세션의 정보를 추가합니다.

**Method** : `POST`

**URL** : `/api/session`

## Body
* 추가하고자 하는 요소를 포함하여 JSON 형식의 데이터를 전송합니다.
```javascript
{
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
    "cash": false,
    "card": true,
    "visible": true
}
```

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "code": "ok",
    "result": [
        {
            "create_t": "2019-09-28T16:08:39.059Z",
            "_id": "5d8fa283749b553221a4f5ae",
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
* 중복될 요소가 없으므로 주의하여 추가하여야 합니다.