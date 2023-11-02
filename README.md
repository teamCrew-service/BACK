# teamCrew

# 목차

1. [프로젝트 소개](#loudspeaker-프로젝트-소개)
2. [개발 인원](#office-개발-인원)
3. [기술 스택](#wrench-기술-스택)
4. [라이브러리](#books-라이브러리)
5. [아키텍처](#pushpin-아키텍처)
6. [ERD](#bank-erd)
7. [개선 사항](#rocket-개선-사항)

---

## :loudspeaker: 프로젝트 소개

- 내 주변 모임 찾기부터 다양한 모임을 즐길 수 있도록 도와주는 플랫폼 서비스

### 프로젝트 목표

- 소셜 로그인을 통해 간편한 로그인 서비스 제공
- Map의 위치 기반 서비스를 활용한 주변 모임 찾기 / 카테고리 검색을 통해 원하는 모임 조회
- 찜하기 기능을 통해 관심있는 모임을 등록
- 가입이 등록된 모임에서는 가입을 통해 모임에 가입
- 실시간 채팅을 통해 모임 구성원들과 원활한 소통 제공
- S3를 이용한 image 관리 storage 구축
- Docker를 이용한 CI/CD 구축

#### 홈페이지 :

#### :calendar: 프로젝트 기간 : 2023년 08월 06일 ~ 2023년 10월

### [GitHub](https://github.com/teamCrew-service)

### [Notion](https://burly-fridge-a81.notion.site/Team-CREW-d3269422b794420495da4d74548012cd?pvs=4)

### :mag: [API Document](http://13.125.234.29/swagger)

### 주요 기능

#### 위치 기반 서비스

- Naver Map을 이용해 자신의 주변에 있는 모임을 확인 가능

#### 카테고리 별 모임 조회

- 카테고리 별로 모임을 조회할 때 parameter에 따라 값을 변경해서 전달
- 조회한 모임에서 검색어를 넣었을 경우 검색어에 해당하는 모임을 확인 가능

#### 달력을 통해 일정 확인

- 모임의 달력을 통해 모임의 일정을 쉽게 확인 가능

#### cronJob을 통해 scheduling

- 공지, 일정 등에서 scheduling을 이용하여 날짜에 맞춰 마감 처리 및 정리

#### socket.io를 통해 실시간 채팅

- socket.io를 통해 실시간 채팅을 모임원들과 즐길 수 있음

#### 이미지 저장 기능

- multer, s3, AWS-sdk를 이용해 이미지 저장

#### CI/CD 파이프라인 구성

- Github Action을 이용한 자동 배포 구축

---

## :office: 개발 인원

### Front-End

- 최정운 (React) [FE팀장]
- 홍주혁 (React)

### Back-End

- 박윤수 (Node.js) [BE팀장]
- 변창일 (Node.js)
- 김승호 (Node.js)

### Design

- 김준영 (Designer)

---

## :wrench: 기술 스택

<code>Node.js</code> / <code>Nest.js</code> / <code>TypeOrm</code> / <code>Git</code> / <code>MySQL</code> / <code>mongoDB</code>

---

## :books: 라이브러리

| 라이브러리              | 설명                              |
| :---------------------- | :-------------------------------- |
| Nestjs                  | 서버 프레임워크                   |
| express                 | 서버                              |
| swagger                 | API 명세서 관리                   |
| typescript              | 유지, 보수 및 생산성 향상         |
| mysql2                  | MySQL                             |
| jwt                     | 서명 암호화                       |
| passport                | 소셜 간편화를 위한 라이브러리     |
| passport-google-oauth20 | google 소셜 로그인                |
| passport-kakao          | kakao 소셜 로그인                 |
| passport-naver-v2       | naver 소셜 로그인                 |
| eslint                  | 정적 코드 분석                    |
| typeorm                 | Object Relational Mapping         |
| axios                   | Promise 기반 HTTP 클라이언트      |
| schedule                | 서버 내 scheduling 관리           |
| socket.io               | 양 방향 통신 라이브러리           |
| websockets              | 실시간 업데이트 제공(채팅)        |
| mongoose                | NoSQL DB(채팅)                    |
| aws-sdk                 | AWS 서비스 이용을 위한 라이브러리 |
| cron                    | cronJob                           |
| schedule                | scheduling                        |
| multer                  | formData 저장을 위한 라이브러리   |
| multer-s3               | s3를 이용하여 이미지 저장         |

---

## :pushpin: 아키텍처

---

## :bank: ERD

## ![ERD](https://www.notion.so/Team-CREW-d3269422b794420495da4d74548012cd?pvs=4#8d4624f609cb43ca984d6e3c694f958f)

## :rocket: 개선 사항

---
