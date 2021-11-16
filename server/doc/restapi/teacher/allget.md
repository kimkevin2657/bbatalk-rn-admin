# 모든 강사 정보 가져오기

강사의 모든 정보를 가져 올 수 있습니다.

**Method** : `GET`

**URL** : `/api/teacher/all`

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
    "code": "ok",
    "result": [
        {
            "_id": "5d8f9fce749b553221a4f5ad",
            "create_t": "2019-09-28T16:08:39.054Z",
            "id": "pt3",
            "gym": {
                "id": "5d8f7bedb9722f2d569dba60",
                "name": "웰페리온"
            },
            "name": "김진현",
            "rank": "과장",
            "team": "게임",
            "career": "게임강사",
            "__v": 0
        },
        {
            "_id": "5d8f9fbc749b553221a4f5ac",
            "create_t": "2019-09-28T16:08:39.054Z",
            "id": "pt2",
            "gym": {
                "id": "5d8f7bedb9722f2d569dba60",
                "name": "웰페리온"
            },
            "name": "신성욱",
            "rank": "과장",
            "team": "수영",
            "career": "수영강사",
            "__v": 0
        },
        {
            "_id": "5d8f9ef7749b553221a4f5ab",
            "create_t": "2019-09-28T16:08:39.054Z",
            "id": "pt1",
            "gym": {
                "id": "5d8f7bedb9722f2d569dba60",
                "name": "웰페리온"
            },
            "name": "김남욱",
            "rank": "실장",
            "team": "운영",
            "career": "트레이너",
            "__v": 0
        }
    ]
}
```

## Notes
* 쿼리에 해당하는 모든 항목을 가져올 수 있습니다.