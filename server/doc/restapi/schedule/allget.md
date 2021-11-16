# 모든 스케줄 정보 가져오기

스케줄의 모든 정보를 가져 올 수 있습니다.

**Method** : `GET`

**URL** : `/api/schedule/all`

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
    "code": "ok",
    "result": [
        {
            "_id": "5d9031d48355a043a33bb609",
            "create_t": "2019-09-29T04:21:06.478Z",
            "teacher": {
                "_id": "5d8f9ef7749b553221a4f5ab",
                "name": "김남욱"
            },
            "gym": {
                "_id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "stime": "2019-09-29T05:00:00.000Z",
            "etime": "2019-09-29T06:00:00.000Z",
            "session": {
                "_id": "5d8fa4b0e1e5813e63462a26",
                "name": "세션3"
            },
            "room": {
                "_id": "5d8f9116749b553221a4f5a5",
                "name": "룸1"
            },
            "member": [
                {
                    "state": 0,
                    "count_arr": [
                        {
                            "tc": 5,
                            "c": 3
                        }
                    ],
                    "_id": "5d8f736195a8bd2bcc661c12",
                    "name": "김진현"
                }
            ],
            "__v": 0
        },
        {
            "_id": "5d90309b217d1e43117d5d8c",
            "create_t": "2019-09-29T04:18:02.808Z",
            "teacher": {
                "_id": "5d8f9ef7749b553221a4f5ab",
                "name": "김남욱"
            },
            "gym": {
                "_id": "5d8f7c3eb9722f2d569dba61",
                "name": "웰페리온"
            },
            "stime": "2019-09-29T04:00:00.000Z",
            "etime": "2019-09-29T05:00:00.000Z",
            "session": {
                "_id": "5d8fa4b0e1e5813e63462a26",
                "name": "세션3"
            },
            "room": {
                "_id": "5d8f9116749b553221a4f5a5",
                "name": "룸1"
            },
            "member": [
                {
                    "state": 0,
                    "count_arr": [
                        {
                            "tc": 0,
                            "c": 0
                        }
                    ],
                    "_id": "5d8f736195a8bd2bcc661cae",
                    "name": "김정민"
                }
            ],
            "__v": 0
        }
    ]
}
```

## Notes
* 쿼리에 해당하는 모든 항목을 가져올 수 있습니다.