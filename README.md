# Keqing Kakaotalk bot
**Deploy repo, Kakaotalk bot, Universal, Scaleable and Modifiable Solution, Node.js(TS4) "Keqing"**<br>
2020년 11월 24일부터 2021년 1월 18일까지 진행한 프로젝트입니다.<br>
본 레포는 배포용 입니다.
## 아카이브
본 프로젝트는 [node-kakao](https://github.com/storycraft/node-kakao)의 구버전을 사용하므로 현재 실행이 불가능한(접속시 영구정지) 상태입니다.<br>
따라서 본 리포지토리는 참고용으로 사용해주시기 바랍니다.
## 라이선스
본 소스코드는 GPLv3로 배포되므로 **응용/확장 등 본 소스코드를 이용하여 제작한 채팅봇은 소스코드를 공개해야 됩니다.**
## 주의사항
**본 채팅봇은 카카오톡의 통신 프로토콜인 '로코' 프로토콜을 호환하는 라이브러리를 사용하여 제작한 채팅봇입니다.**<br>
**본 채팅봇을 가동함으로써 얻는 불이익에 대한 책임은 사용자에게 있습니다.**<br>
 - 고치지 않은 버그가 있을 수도 있습니다.
 - 본 프로젝트는 [node-kakao](https://github.com/storycraft/node-kakao)의 구버전(3.1.x)을 사용합니다.<br>차후 실행이 불가능할 수 있습니다.
## 모듈
### 코어
#### Citius
유저, 채널의 데이터 관리를 담당하는 모듈입니다.<br>
mongodb를 사용합니다.
#### Fortius
이벤트/명령어 처리 모듈입니다.<br>
이 봇을 만들면서 가장 아쉬웠던 모듈입니다.
#### Karin
카카오링크를 쉽게 생성할 수 있는 모듈입니다.
#### Lamy
api 백엔드 서버 모듈입니다 (미완성)
#### Nakri
유저에게 질문을 주는 모듈입니다.
#### Qurare
로깅 모듈입니다.
### 응용
#### Diluc
주식 모듈입니다.
#### Erica
돈/레벨/출석 모듈입니다.
#### Esther
레시피/직업/스텟 모듈입니다. (미완성)
##### Venti
아이템을 담당하는 Esther의 서브모듈입니다. (미완성)
#### Gomoku
오목 모듈입니다.
#### Kagura
채널 채팅량 집계 모듈입니다.
#### Odin
전투 모듈입니다. (미완성)
#### Shiritori
끝말잇기 모듈입니다.<br>
[브위](https://blog.naver.com/ttyy3388)님이 제작하신 끝말잇기를 기반으로 제작했습니다.
#### Utils
유틸리티 명령어 모듈입니다.
#### Zhongli
가상회사(길드) 모듈입니다.
