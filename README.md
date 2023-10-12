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

#### [GitHub](https://github.com/teamCrew-service)

#### [Notion](https://burly-fridge-a81.notion.site/Team-CREW-d3269422b794420495da4d74548012cd?pvs=4)

---

### :mag: [API Document](http://13.125.234.29/swagger)

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

---

## :books: 라이브러리

| 라이브러리              | 설명                          |
| :---------------------- | :---------------------------- |
| Nestjs                  | 서버 프레임워크               |
| express                 | 서버                          |
| swagger                 | API 명세서 관리               |
| typescript              | 유지, 보수 및 생산성 향상     |
| mysql2                  | MySQL                         |
| jwt                     | 서명 암호화                   |
| passport                | 소셜 간편화를 위한 라이브러리 |
| passport-google-oauth20 | google 소셜 로그인            |
| passport-kakao          | kakao 소셜 로그인             |
| passport-naver-v2       | naver 소셜 로그인             |
| eslint                  | 정적 코드 분석                |
| typeorm                 | Object Relational Mapping     |
| axios                   | Promise 기반 HTTP 클라이언트  |
| schedule                | 서버 내 scheduling 관리       |

---

## :pushpin: 아키텍처

---

## :bank: ERD

---

## :rocket: 개선 사항

---
