import BeyondStockInfo from "../BeyondStockInfo";
import CurrencyExchange from "../CurrencyExchange";
import BeyondStock from "./BeyondStock";

export default class Foreign extends BeyondStock {
	protected uptime = 60000;
	private checkedAt: Date;
	private checkedIn: boolean;
	protected async Update(): Promise<BeyondStockInfo> {
		var info = await this.Exchange.DoForeign(this.StockID);
		this.checkedAt = new Date();
		this.checkedIn = info.marketStatus === 'OPEN';
		var exchange = await this.Citius.GetSingleton(CurrencyExchange).GetRate(info.currencyType.code);
		return {
			id: info.reutersCode,
			name: info.stockName || info.stockNameEng,
			region: info.stockExchangeType.nationType,
			regionInfo: {
				iso: info.stockExchangeType.nationType,
				index: info.stockExchangeType.nameEng,
				indexKr: info.stockExchangeType.nameKor,
				exchange: info.currencyType.code,
				exchangeIndex: exchange,
				nation: info.stockExchangeType.nationType,
				market: info.stockExchangeType.name
			},
			cost: +(+(info.closePrice.replace(/,/g, '')) * exchange).toFixed(3),
			costdifn: +(+info.compareToPreviousClosePrice * exchange).toFixed(3),
			costdifr: +(+info.fluctuationsRatio).toFixed(3),
			opened: this.checkedIn,
			updtime: new Date(),
			image: info.imageCharts.candleDay
		};
	}

	protected CheckUpdate(): boolean {
		return this.checkedIn || Date.now() - this.checkedAt.getTime() > 1800000
	}
	protected Struct(): string {
		return 'ForeignAsset';
	}
}