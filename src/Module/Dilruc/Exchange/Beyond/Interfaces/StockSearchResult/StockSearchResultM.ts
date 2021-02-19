import StockSearchResult from "./StockSearchResult";

export default interface StockSearchResultM {
	result: {
		d: Array<StockSearchResult>; //결과
		totCnt: number; //결과 수
		t: string;
	},
	resultCode: string;
}