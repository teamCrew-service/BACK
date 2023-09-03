# node:18 이미지를 기반으로 새 Docker 이미지를 생성
FROM node:18

# /var/app 디렉터리를 컨테이너 안에 생성
RUN mkdir -p /var/app

# /var/app 디렉터리를 작업 디렉터리로 설정
WORKDIR /var/app

# 현재 호스트의 모든 파일을 컨테이너의 /var/app 디렉터리에 복사
COPY . .

# 패키지 설치 (package.json과 package-lock.json에 명시된 모듈)
RUN npm install

# 프로젝트 빌드 (dist 폴더에 빌드 결과물 저장)
RUN npm run build

# 3000번 포트를 열어 외부에서 접근 가능하게 함
EXPOSE 3000

# 컨테이너가 실행될 때 "npm run start:prod" 명령어를 실행
# 개발 모드로 앱을 시작
CMD ["npm", "run", "start:prod"]
