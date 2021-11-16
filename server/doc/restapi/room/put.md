# 룸 정보 추가하기

룸의 정보를 변경합니다.

**Method** : `PUT`

**URL** : `/api/room`

# Query
* 쿼리는 `{속성}:{값}`으로 검색됩니다.
```javascript
// name 속성으로 검색
/api/room?name=룸1
// state 속성으로 검색
/api/room?state=true
...
```

## Body
* 변경하고자 하는 부분의 속성을 포함한 JSON 형식의 데이터를 전송합니다.
```javascript
{
	"desc": "테니스1_변경"
}
```

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "_id": "5d8f9261749b553221a4f5a8",
    "create_t": "2019-09-28T16:08:39.061Z",
    "name": "룸4",
    "gym": {
        "id": "5d8f7c3eb9722f2d569dba61",
        "name": "웰페리온"
    },
    "state": true,
    "visible": true,
    "desc": "테니스1",
    "__v": 0
}

or

null
```

## Notes
* 쿼리에 해당하는 도큐먼트를 찾아 속성의 값을 변경합니다.
* 반환 값은 변경 전의 도큐먼트를 반환합니다.