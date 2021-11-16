# 회원 정보 추가하기

회원의 정보를 추가합니다.

**Method** : `POST`

**URL** : `/api/user`

## Body
* 추가하고자 하는 요소를 포함하여 JSON 형식의 데이터를 전송합니다.
```javascript
{
    "id": "np3",
    "gym": {
        "id": "5d8f7bedb9722f2d569dba60",
        "name": "웰페리온"
    },
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
    "consult_c": 0,
    "visit_c": 0,
    "count_arr": [
        {
            "tc": 200,
            "c": 0
        }
    ]
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
            "consult_c": 0,
            "visit_c": 0,
            "count_arr": [
                {
                    "tc": 200,
                    "c": 0
                }
            ],
            "gym": {
                "id": "5d8f7bedb9722f2d569dba60",
                "name": "웰페리온"
            },
            "create_t": "2019-09-28T16:08:39.051Z",
            "_id": "5d8f9c8d749b553221a4f5a9",
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
    ]
}
```

## Notes
* 중복된 id를 입력할 경우 code:400이 발상하며 "Error: 이미 존재하는 회원 입니다."라는 에러가 출력됩니다.