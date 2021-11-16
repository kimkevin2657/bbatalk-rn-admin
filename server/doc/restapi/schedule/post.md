# 스케줄 정보 추가하기

스케줄의 정보를 추가합니다.

**Method** : `POST`

**URL** : `/api/schedule`

## Body
* 추가하고자 하는 요소를 포함하여 JSON 형식의 데이터를 전송합니다.
```javascript
{
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
    "member": [{
        "_id": "5d8f736195a8bd2bcc661cae",
        "name": "김정민",
        "state": 0,
        "count_arr": [
            {"tc": 0, "c": 0}
        ]
    }]
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
            "create_t": "2019-09-29T04:18:02.808Z",
            "_id": "5d90309b217d1e43117d5d8c",
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
* 중복될 요소가 없으므로 주의하여 추가하여야 합니다.