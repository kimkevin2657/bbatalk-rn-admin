# Nginx 서버로 Load Balance 구현하기

기존 단일 Node에서 GreenLock 모듈을 이용하여 https를 구현되어 있다.<br/>
이러한 구조에서 분산 처리가 가능하도록 Nginx에 Multi Node Process로 변경될 것이다.<br/>
구조를 변경하기 위해서는 아래의 과정을 거쳐 적용해야한다.
  1. Let's Encrypt 인증서 발급 및 Nginx 서버에 SSL 인증서 적용
  2. Crontab을 이용하여 주기적으로 인증서 갱신
  3. PM2를 사용하여 Multi-Node 실행
  4. Reverse-Proxy를 통해서 Multi Node Process에 Proxy 처리

><b>Nginx</b></br>
> 웹서버이다. 높은 점유율을 차지하고 있는 아파치의 기술적인 한계를 보안하기 위해 나온 제품이라고 한다.<br/>
> 아파치에 비해 다수의 연결에 효율적이고, 적은 리소스를 사용한다.<br/><br/>
><b>리버스 프록시 서버</b><br/>
>서버 앞단에 웹서버를 이용하여 사용자가 바로 서버에 접근하지 않고 앞에 있는 웹서버에 요청을 하도록 하는 역할을 한다. 사용자의 요청에 따라 리버스 프록시 서버(앞단의 웹서버)는 서버의 포트나 디렉토리에 연결해 준다.
이렇게 하면 사용자가 직접하는 요청과 프록시 서버를 거친 요청이 다르기 때문에 직접적으로 노출되지 않는 이점이 있고, 하나의 요청으로 여러 형태로 처리하는 분산처리가 가능하다.


## 1. Let's Encrypt 인증서 발급

Let's Encrypt는 무료 SSL 인증서를 발급 받을 수 있다.<br/>
인증서는 3개월의 유효하고 이후에는 주기적인 갱신이 필요로 한다.<br/>
인증서 발급을 위해선 root 권한을 사용할 수 있어야 하며 Public 도메인이 할당된 서버에서만 발급이 가능하다.<br/>
도메인 인증자 이메일을 계정당 1개의 인증서만 무료로 받을 수 있다.<br/>
certbot을 이용한다면 서버에 직접 설치하여 간단하게 서버별로 SSL 인증서를 발급받고 주기적으로 재발급 처리가 가능해진다.<br/>
1일 3회 이상 발급을 시도 할 수 없으므로 가능하면 실수 하지 않도록 주의 해야한다.

### 1.1 Certbot 설치
```shell
# EPEL repository 활성화
$ yum -y install epel-release
# amazon linux 2 에서 EPEL 활성화
$ sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
$ sudo yum-config-manager --enable epel

# certbot-nginx 설치
$ sudo yum install -y certbot python2-certbot-nginx

# 외부 인터넷을 사용할 수 없는 서버를 위하여 certbot 설치에 필요한 rpm들을 다운로드 받을 수 있습니다.
$ sudo yum install certbot python2-certbot-nginx --downloadonly --downloaddir=/root/certbot
```
 * 참고: https://aws.amazon.com/ko/premiumsupport/knowledge-center/ec2-enable-epel/

### 1.2 Certbot 명령어 설명
```shell
$ sudo certbot --nginx --standalone -d example.com centonly
```
 * apache / nginx
 * standalone / webroot: 인증서 발급 방식, 세가지 방식을 직접 선택할 경우 --manual 옵션을 붙일 것, Dns 방식의 경우 --preferred-challenges dns 값을 붙인다.
 * -d [도메인 이름]: 발급할 인증서의 도메인을 입력하는 부분, 여러 도메인을 입력해야할 경우 ,(콤마)로 구분 입력
 * certonly: 웹 서비스 설정 파일에 인증서 관련 내용을 임의로 수정하지 못하도록 한다.

### 1.3 Certbot 실행
```shell
$ sudo su # ec2에서 루트 권한 취득
$ systemctl stop nginx
$ certbot --nginx
$ certbot certonly --standalone -d example.com
# 도메인 관리자 이메일 주소 입력
# 이용원칙 동의 및 인증기관에 등록되는 사항 "A" 입력하여 동의
# 제3자 업체에 정보를 공유-싫다면 N
# Congratulations! 문구가 나온다면 발급이 정상적으로 된 것임.
```

### 1.4 Nginx 서버에 반영하기
인증서가 생성이 완료된다면 "/etc/letsencrypt/live/[신청한 인증서의 도메인명].com" 위치에 저장됨

생성되는 파일들은 아래와 같이 생성이 된다.
```shell
cert.pem
chain.pem
fullchain.pem
privkey.pem
```
example.com의 Nginx 서버에 설정한다면 위치를 다음과 같이 설정한다. (위치: /etc/nginx/nginx.conf)
```
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name exaple.com www.example.com;
    root /usr/share/nginx/html;
    # include /etc/nginx/example.com.conf.d/*.conf;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/example.com/privket.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

```
중지 되었던 웹서비스를 다시 시작한다.
```shell
$ systemctl start nginx
```

웹사이트에서 인증서가 제대로 발급된지 확인을 한다. (URL의 자물쇠 모양을 클릭하여 인증서를 확인할 수 있다.)<br/>
인증서의 발급자가 Let's Encrypt Authority X3으로 생성되는지 확인한다.<br/>
참고 : https://certbot.eff.org<br/>

## 2. Crontab을 이용하여 주기적으로 인증서 갱신
ssl 인증서를 갱신 하기 위해서는 아래의 명령을 사용한다.
```shell
$ certbot renew
```
만약 갱신날짜가 되지 않은 ssl 인증서는 skkiped 처리가 된다.
강제로 갱신하고 싶다면 
```shell
$ certbot renew --dry-run
```
ssl 인증서가 만료되었을때에 인증서를 갱신할 수 있도록 crontab을 등록한다.
```shell
# open crontab
crontab -e

# add daily renew ssl schedule
@daily certbot renew
```
위 처럼 처리한다면 매일 renew 명령어를 수행해 만료된 인증서를 자동으로 갱신하여 준다.

## 3. PM2를 사용하여 Multi-Node 실행
* pm2를 이용하여 nodejs를 관리가 되어야 하므로 global 영역에 설치 되어야함
 - npm install -g pm2

아래 파일을 등록하여 node를 여러개 가동 할 수 있도록 한다.

```js
var ignoreWatch = [
  'node_modules',
  'logs',
  'data',
  'dist',
  'conf'
]
// Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  apps : [
  {
    name: 'server-1',
    script: 'index.js',
    autorestart: true,
    watch: true,
    ignore_watch: ignoreWatch,
    max_memory_restart: '1500M',
    env: {
      'port': '3000'
    }
  },
  {
    name: 'server-2',
    script: 'index.js',
    autorestart: true,
    watch: true,
    ignore_watch: ignoreWatch,
    max_memory_restart: '1500M',
    env: {
      'port': '3001'
    }
  },
  {
    name: 'server-3',
    script: 'index.js',
    autorestart: true,
    watch: true,
    ignore_watch: ignoreWatch,
    max_memory_restart: '1500M',
    env: {
      'port': '3002'
    }
  },
  {
    name: 'server-4',
    script: 'index.js',
    autorestart: true,
    watch: true,
    ignore_watch: ignoreWatch,
    max_memory_restart: '1500M',
    env: {
      'port': '3003'
    }
  },
  ]
};
```

* 서비스 실행
  ecosystem형식의 파일을 등록하여 사용할 것 임.
  ```shell
  $ pm2 [start|restart|stop|delete] ecosystem.config.js
  ```

* 서비스 등록 및 관리
  ```shell
  $ pm2 startup // 시스템 boot 활성화
  $ pm2 save
  ```
* 새로운 NodeJS 업그레이드시에는 서비스 재등록
  ```shell
  $ pm2 unstartup // 시스템 boot 비활성화
  $ pm2 startup
  ```

## 4. Reverse-Proxy를 통해서 Multi Node Process에 Proxy 처리
PM2를 통해 http 웹 서버를 3000번 포트 이후로 쭈욱 세팅하려면 아래와 같이 세팅이 필요하다.

```
upstream ffaso-server {
    ip_hash;
    server localhost:3000;
    server localhost:3001;
}

server {
    access_log /var/log/nginx/reverse-access.log;
    error_log /var/log/nginx/reverse-error.log;
    location / {
        proxy_pass http://ffaso-server;
    }
}
```
upstream을 사용해야 load balance를 사용할 수 있다.

><b>Load balancing methods</b><br/>
> * round-robin(디폴트) - 공평하게 돌아가면서 분배
> * hash - 해시한 값으로 분배, 사용하려면 "hash <키>" 형태를 사용
> * ip_hash - 아이피로 해싱하여 분배
> * random - 랜덤 분배
> * least_conn - 연결 수가 가장 적은 서버를 선택해서 분배, 가중치를 고려할 수 있다.
> * least_time - 연결 수가 가장 적으면서 평균 응답시간이 가장 적은 쪽을 선택하여 분배<br/>
> 참고: http://nginx.org/en/docs/stream/ngx_stream_upstream_module.html<br/>
> <br/>

><b>Parameter</b><br/>
> * weight -  가중치를 둬서 더 많이 가도록 설정
> * max_conns - 최대 연결 한계
> * max_fails - 최대 실패 한계, 최대 실패 횟수에 도달하면 서버가 죽은걸로 간주
> * fail_timeout - 시간을 정함. 시간을 넘어선다면 서버가 죽은걸로 간주
> * backup - 백업 서버로 간주하고 다른 메인 서버가 죽을 경우 동작. hash, random 일 경우 무의미
> * down - 표시한 서버는 사용하지 않음
