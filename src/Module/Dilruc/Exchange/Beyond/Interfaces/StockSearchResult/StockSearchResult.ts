export default interface StockSearchResult {
	cd: string; //주식 ID
	nm: string; //주식 이름
	nv: string; //현재 주가(현지화)
	cv: string; //전일대비 변동률(현지화)
	cr: string; //전일대비 변동률(퍼센트)
	rf: string; //알 수 없음
	mks: number; //시가총액(현지화, 국내 억단위, 해외 천단위)
	aa?: number; //거래대금(국내일 경우, 1단위)
	aq?: number; //거래량(해외일 경우, 1단위)
	nation: string; //국가코드 (ISO 3166-1 ALPHA-3)
	etf: boolean; //상장지수펀드
	market?: string; //거래소(해외일 경우)
}