# 모든 센터 정보 가져오기

센터의 모든 정보를 가져 올 수 있습니다.

**Method** : `GET`

**URL** : `/api/gym/all`

## Query
* 쿼리는 `{속성}:{값}`으로 검색됩니다.
```javascript
// _id 속성으로 검색
/api/gym?_id=5d8f7c3eb9722f2d569dba61
// id 속성으로 검색
/api/gym?id=testCenter1
// name 속성으로 검색
/api/gym?name=웰페리온1
```

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "code": "ok",
    "result": [
        {
            "_id": "5d8f7c3eb9722f2d569dba61",
            "create_t": "2019-09-28T15:23:56.475Z",
            "id": "testCenter1",
            "name": "웰페리온1",
            "__v": 0
        },
        {
            "_id": "5d8f7bedb9722f2d569dba60",
            "create_t": "2019-09-28T15:23:56.475Z",
            "id": "testCenter",
            "name": "웰페리온",
            "__v": 0
        }
    ]
}
```

## Notes
* 쿼리에 해당하는 모든 항목을 가져올 수 있습니다.