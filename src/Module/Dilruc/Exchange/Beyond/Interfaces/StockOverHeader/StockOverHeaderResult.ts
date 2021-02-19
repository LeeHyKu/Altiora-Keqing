//국내증시 전용
export default interface StockOverHeaderResult {
	cd: string; //주식 ID
	nyn: string; //알 수 없음: 기본 "N"
	pcv: number; //전일 가격
	ms: string; //시장 열림여부: "OPEN" | "CLOSE"
	nt: number; //알 수 없음: 기본 0
	mt: string; //시장: 코스피 "1" | 코스닥 "2"
	nv: number; //현재 주가(실시간)
	tyn: string; //알 수 없음: 기본 "N"
	lv: number; //저가
	al: string, //알 수 없음: 기본 ""
	my: number; //알 수 없음: 기본 0
	hv: number; //고가
	cr: number; //전일대비 변동량(퍼센트)
	aq: number; //거래량
	cv: number; //전일대비 변동량(원화)
	rf: string; //알 수 없음: 기본 5
	time: number; //현재 시간
	nm: string; //주식 이름
}