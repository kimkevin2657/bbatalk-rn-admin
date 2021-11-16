# 모든 룸 정보 가져오기

룸의 모든 정보를 가져 올 수 있습니다.

**Method** : `GET`

**URL** : `/api/room/all`

## Query
* 쿼리는 `{속성}:{값}`으로 검색됩니다.
```javascript
// name 속성으로 검색
/api/room?name=룸1
// state 속성으로 검색
/api/room?state=true
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
            "_id": "5d8f9116749b553221a4f5a5",
            "create_t": "2019-09-28T16:08:39.061Z",
            "name": "룸1",
            "gym": {
                "id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "state": true,
            "visible": true,
            "desc": "헬스1",
            "__v": 0
        },
        {
            "_id": "5d8f924d749b553221a4f5a6",
            "create_t": "2019-09-28T16:08:39.061Z",
            "name": "룸2",
            "gym": {
                "id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "state": true,
            "visible": true,
            "desc": "헬스2",
            "__v": 0
        },
        {
            "_id": "5d8f9254749b553221a4f5a7",
            "create_t": "2019-09-28T16:08:39.061Z",
            "name": "룸3",
            "gym": {
                "id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "state": true,
            "visible": true,
            "desc": "헬스3",
            "__v": 0
        },
        {
            "_id": "5d8f9261749b553221a4f5a8",
            "create_t": "2019-09-28T16:08:39.061Z",
            "name": "룸4",
            "gym": {
                "id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "state": true,
            "visible": true,
            "desc": "테니스1",
            "__v": 0
        }
    ]
}
```

## Notes
* 쿼리에 해당하는 모든 항목을 가져올 수 있습니다.