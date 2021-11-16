# 센터 정보 가져오기

센터의 정보를 하나만 가져옵니다.

**Method** : `GET`

**URL** : `/api/gym`

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
    "result": {
        "_id": "5d8f7c3eb9722f2d569dba61",
        "create_t": "2019-09-28T15:23:56.475Z",
        "id": "testCenter1",
        "name": "웰페리온1",
        "__v": 0
    }
}

or 

null
```

## Notes
* 쿼리에 해당하는 하나의 도큐먼트를 가져옵니다.