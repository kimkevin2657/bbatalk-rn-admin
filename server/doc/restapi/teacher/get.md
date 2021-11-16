# 강사 정보 가져오기

강사의 정보를 하나만 가져옵니다.

**Method** : `GET`

**URL** : `/api/teacher`

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
    "result": {
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
    }
}

or 

null
```

## Notes
* 쿼리에 해당하는 하나의 도큐먼트를 가져옵니다.