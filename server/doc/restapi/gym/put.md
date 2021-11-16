# 센터 정보 추가하기

센터의 정보를 변경합니다.

**Method** : `PUT`

**URL** : `/api/gym`

## Query
* 쿼리는 `{속성}:{값}`으로 검색합니다.
```javascript
// _id 속성으로 검색
/api/gym?_id=5d8f7c3eb9722f2d569dba61
// id 속성으로 검색
/api/gym?id=testCenter1
// name 속성으로 검색
/api/gym?name=웰페리온1
```

## Body
* 변경하고자 하는 부분의 속성을 포함한 JSON 형식의 데이터를 전송합니다.
```javascript
{
	"name": "웰페리온3_변경"
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
            "create_t": "2019-09-28T15:23:56.475Z",
            "_id": "5d8f8137b9722f2d569dba62",
            "id": "testCenter3",
            "name": "웰페리온3",
            "__v": 0
        }
    ]
}

or

null
```

## Notes
* 쿼리에 해당하는 도큐먼트를 찾아 속성의 값을 변경합니다.
* 반환 값은 변경 전의 도큐먼트를 반환합니다.