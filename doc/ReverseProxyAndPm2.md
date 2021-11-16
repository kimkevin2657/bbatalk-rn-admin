<b>하기 내용은 "[Nginx 서버로 Load Balance 구현하기]"에서 구현된 내용이므로 참고 정보만 바랍니다. </b><br/>

[Nginx 서버로 Load Balance 구현하기]: https://github.com/programrubber/nopeople/blob/master/doc/nginxLoadBalanceStrategy.md

## Reverse Proxy & PM2를 이용하여 가용성 및 무중단 서비스 만들기
웹 서버의 데몬을 여러개 생성하여 가용성을 확보하고 Load Balance를 통해서 부하를 분산 할 수 있도록하여
성능도 잡을 수 있도록 하여야 한다. 
현재 설계를 최대한 동시성이 발생하지 않도록 처리를 함으로써 중복되는 Process를 여러개 생성할 수 있는 구조로 작성이 되어 있지만 웹서버를 구동할 시에 SSH를 https를 구동할수 있긴하지만 하나의 데몬에서만 
가능한 구조이다. 이를 해결하기위해서는 https를 nginx에서 실행이 되어야 하며 nodejs 에서는 greenlock 라이브러리를 통해서 3개월에 한번씩 갱신을 할 수 있는 구조로 개발이 되었기 때문에  구현된 내용은 제거가 되어야 한다. 하지만 https를 적용하기 위해서는 SSL 인증서를 발급받아야하며 Greenlock처럼 무료 인증서를 발급받기에는 힘들 것으로 보이므로 유료 결재하여 인증서를 넣어 주는 작업이 되어야 할 것 같다. (3개월 마다 발급받아 갱신하여주는건 힘들 것 같다 ..., 방법이 있으면 ... 어떻게 해야할 것인가?)

### 1. Reverse Proxy를 적용하는 이유는?
  * 로드 밸런싱을 사용하여 부하를 분산 처리 할 수 있다.
  * 캐쉬를 사용함으로써 성능상 이점을 볼 수 있다.

### 2. 운영 환경
  * 개발 환경: Amazon Linux2 (centos 기반 운영체제)
  * Nodejs: 12.13.1

### 3. 확인해봐야 할 사항
  * 포트를 변경하고 proxy 포트를 443으로 변경하였을때에 정상적으로 실행이 가능하다면 greenlock을 지속적으로 사용할 수 있을 것이므로 확인이 필요함. 아니라면 nginx에 SSH 인증서를 발급받아 적용 하여야함.

### 4. Nginx 설치 & 실행
  ```bash
  > sudo yum install nginx   # nginx 설치
  > sudo service nginx start # 서비스 시작
  > ps -ef | grep nginx      # nginx 구동하는지 확인
  > sudo netstat -ntlp       # 프로세스에서 사용하는 포트 정보 확인
  ```

### 5. Firewall
  * centos6에서는 iptable, centos7에서는 firewalld에서 방화벽을 설정한다.
  * amazon에서는 Security Group를 사용하여 접근 제어를 한다.
  * Amazon 홈페이지에서 보안 그룹에서 인바운드 설정을 하여 정책을 추가할 수 있도록 한다.

### 6. PM2
  * PM2는 Nodejs 프로세스 매니저 역할을 수행하며 Nodejs의 프로세스가 임의로 종료되더 라도 재실행을 시켜줌으로써 무중단 서비스를 실행을 수행할 수 있다. 
  * PM2를 이용하여 nodejs를 관리가 되어야 하므로 global 영역에 설치되어야 한다.

  ```bash
  # 설치 
  > npm install -g pm2       # PM2 설치

  # 실행
  > pm2 start conf/pm2.config.js

  # 서비스 등록 및 관리
  > pm2 startup              # 시스템 boot 활성화
  > pm2 save                 # 

  # 새로운 NodeJS 업그레이드시 에는 서비스 재등록
  pm2 unstartup              # 시스템 boot 비활성화
  pm2 startup                #
  ```
  * pm2.config.js
  ``` javascript
  var ignoreWatch = [
    'node_modules',
    'logs',
    'data',
    'client',
    'conf'
  ]
  module.exports = {
    apps : [
    {
      name: 'server',
      script: 'server.js',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      instances: 1, // 실행될 인스턴스의 수
      autorestart: true,
      watch: false,
      ignore_watch: ignoreWatch,
      max_memory_restart: '400M',
      env: {
        'NODE_ENV': 'production'
      }
    },
    {
      name: 'scrapper',
      script: './worker/scrapper/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      ignore_watch: ignoreWatch,
      max_memory_restart: '200M'
    }]
  };
  ```
### 7. Nginx Reverse-Proxy 설정
  ```bash
    cd /etc/nginx/sites-enabled
    sudo rm default               # 기존 default 파일 제거
    sudo vi default
  ```

  * default 파일 생성
  ```bash
  server {
    listen 80;
    listen [::]:80;

    access_log /var/log/nginx/reverse-access.log;
    error_log /var/log/nginx/reverse-error.log;

    location / {
                proxy_pass http://127.0.0.1:3000;
    }
  }
  ```

  * 아래 명령어를 수행하고 주석과 같이 출력된다면 준비는 끝난것...
  ```bash
  sudo nginx -t
  # nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
  # nginx: configuration file /etc/nginx/nginx.conf test is successful

  sudo service nginx restart
  ```
