# 룸 정보 추가하기

룸의 정보를 추가합니다.

**Method** : `POST`

**URL** : `/api/room`

## Body
* 추가하고자 하는 요소를 포함하여 JSON 형식의 데이터를 전송합니다.
```javascript
{
	"name": "룸1",
	"gym": {
        "id": "5d8f7c3eb9722f2d569dba61",
        "name": "웰페리온"
    },
    "state": true,
    "visible": true,
    "desc": "헬스1"
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
            "create_t": "2019-09-28T16:08:39.061Z",
            "_id": "5d8f9116749b553221a4f5a5",
            "name": "룸1",
            "gym": {
                "id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "state": true,
            "visible": true,
            "desc": "헬스1",
            "__v": 0
        }
    ]
}
```

## Notes
* 중복될 요소가 없으므로 주의하여 추가하여야 합니다.