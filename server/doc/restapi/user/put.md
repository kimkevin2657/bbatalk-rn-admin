# 회원 정보 추가하기

회원의 정보를 변경합니다.

**Method** : `PUT`

**URL** : `/api/user`

## Query
* 쿼리는 `{속성}:{값}`으로 검색됩니다.
```javascript
// id 속성으로 검색
/api/user?id=np1
// name 속성으로 검색
/api/user?name=김정민
...
```

## Body
* 변경하고자 하는 부분의 속성을 포함한 JSON 형식의 데이터를 전송합니다.
```javascript
{
	"job": "게이머"
}
```

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "_id": "5d8f9c8d749b553221a4f5a9",
    "consult_c": 0,
    "visit_c": 0,
    "count_arr": [
        {
            "tc": 200,
            "c": 0
        }
    ],
    "create_t": "2019-09-28T16:08:39.051Z",
    "id": "np3",
    "name": "김진현",
    "sex": "man",
    "birth": "19880901",
    "phone": "01011112222",
    "email": "np3@test.com",
    "address": "성남시",
    "job": "PM",
    "cach_r": false,
    "info": {
        "sms": false,
        "email": true,
        "msg": false
    },
    "member": 0,
    "etc": "게임맨.",
    "point": 0,
    "__v": 0
}

or

null
```

## Notes
* 쿼리에 해당하는 도큐먼트를 찾아 속성의 값을 변경합니다.
* 반환 값은 변경 전의 도큐먼트를 반환합니다.