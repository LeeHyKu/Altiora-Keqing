import BeyondStockInfo from "../BeyondStockInfo";
import BeyondStock from "./BeyondStock";

export default class Domestic extends BeyondStock {
	protected uptime = 10000;
	protected CheckUpdate() { var date = new Date(); return this.CheckWeekday(date) && this.CheckTime(date); }
	private CheckWeekday(date: Date) {
		var day = date.getDay();
		return day !== 0 && day !== 6;
	}
	private CheckTime(date: Date) {
		return (date.getHours() >= 9) && (date.getHours() < 15 || (date.getHours() === 15 && date.getMinutes() <= 30));
	}
	protected async Update(): Promise<BeyondStockInfo> {
		var item = (await this.Exchange.DoDomestic(this.StockID)).result;
		return {
			id: item.cd,
			name: item.nm,
			region: 'KOR',
			regionInfo: {
				iso: 'KOR',
				nation: '대한민국',
				exchange: 'KRW',
				exchangeIndex: 1,
				market: 'KRX',
				index: item.mt === "1" ? 'KOSPI' : 'KOSDAQ',
				indexKr: item.mt === "1" ? '코스피' : '코스닥'
			},
			cost: item.nv,
			costdifn: item.cv,
			costdifr: item.cr,
			opened: item.ms === 'OPEN',
			updtime: new Date(),
			image: `https://ssl.pstatic.net/imgfinance/chart/mobile/candle/day/${item.cd}_end.png`
		};
	}
	protected Struct(): string { return 'DomesticAsset'; }
}