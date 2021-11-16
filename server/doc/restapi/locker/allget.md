# 모든 락커 정보 가져오기

락커의 모든 정보를 가져 올 수 있습니다.

**Method** : `GET`

**URL** : `/api/locker/all`

## Query
* 쿼리는 `{속성}:{값}`으로 검색됩니다.
```javascript
// name 속성으로 검색
/api/locker?name=락커1
// state 속성으로 검색
/api/locker?state=false
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
            "_id": "5d8f8dc3749b553221a4f5a3",
            "create_t": "2019-09-28T16:08:39.060Z",
            "name": "락커4",
            "gym": {
                "id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "state": false,
            "__v": 0
        },
        {
            "_id": "5d8f8dbf749b553221a4f5a2",
            "create_t": "2019-09-28T16:08:39.060Z",
            "name": "락커3",
            "gym": {
                "id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "state": false,
            "__v": 0
        },
        {
            "_id": "5d8f8dbc749b553221a4f5a1",
            "create_t": "2019-09-28T16:08:39.060Z",
            "name": "락커2",
            "gym": {
                "id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "state": false,
            "__v": 0
        },
        {
            "_id": "5d8f8d34749b553221a4f5a0",
            "create_t": "2019-09-28T16:08:39.060Z",
            "name": "락커1",
            "gym": {
                "id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "user": {
                "id": "5d8f736195a8bd2bcc661cae",
                "name": "김정민"
            },
            "stime": "2019-09-28T16:37:17.038Z",
            "etime": "2020-09-29T16:37:17.038Z",
            "state": true,
            "__v": 0
        }
    ]
}
```

## Notes
* 쿼리에 해당하는 모든 항목을 가져올 수 있습니다.