# 센터 정보 추가하기

센터의 정보를 추가합니다.

**Method** : `POST`

**URL** : `/api/gym`

## Body
* 추가하고자 하는 요소를 포함하여 JSON 형식의 데이터를 전송합니다.
```javascript
{
	"id": "testCenter3",
	"name": "웰페리온3"
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
```

## Notes
* 중복된 id를 입력할 경우 code:400이 발상하며 "Error: 이미 존재하는 센터 입니다."라는 에러가 출력됩니다.