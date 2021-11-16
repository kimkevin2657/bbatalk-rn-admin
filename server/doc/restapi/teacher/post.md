# 강사 정보 추가하기

강사의 정보를 추가합니다.

**Method** : `POST`

**URL** : `/api/teacher`

## Body
* 추가하고자 하는 요소를 포함하여 JSON 형식의 데이터를 전송합니다.
```javascript
{
    "id": "pt1",
    "gym": {
        "id": "5d8f7bedb9722f2d569dba60",
        "name": "웰페리온"
    },
    "name": "김남욱",
    "rank": "실장",
    "team": "운영",
    "career": "트레이너"
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
            "create_t": "2019-09-28T16:08:39.054Z",
            "_id": "5d8f9ef7749b553221a4f5ab",
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
* 중복된 id를 입력할 경우 code:400이 발상하며 "Error: 이미 존재하는 강사 입니다."라는 에러가 출력됩니다.