export default interface DilucRegion {
	iso: string; //ISO 3166-1 ALPHA-3
	nation: string;

	market: string;
	index: string; //market || nation
	indexKr: string; //market || nation
	exchange: string;
	exchangeIndex: number;
}