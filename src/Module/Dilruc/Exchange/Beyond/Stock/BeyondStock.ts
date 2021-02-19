import FeedBuilder from "../../../../../Core/Karin/Contents/Feed/FeedBuilder";
import Stock from "../../Stock";
import StockAvailable from "../../StockAvailable";
import Beyond from "../Beyond";
import BeyondArgs from "../BeyondArgs";
import BeyondOption from "../BeyondOption";
import BeyondStockInfo from "../BeyondStockInfo";

export default abstract class BeyondStock extends Stock<BeyondStockInfo, BeyondArgs, BeyondOption> {
	private _id: string;
	private _exchange: Beyond;
	protected get StockID() { return this._id; }
	protected get Exchange() { return this._exchange; }

	protected Initalize(beyond: Beyond, id: string) {
		this._id = id;
		this._exchange = beyond;
	}
	public CheckSearch(name: string): boolean { return this.StockID === name; }
	public ID(info: BeyondStockInfo): string { return info.id; }
	public Name(info: BeyondStockInfo) { return info.name; }
	public LimitDefault(): number { return 10000; }
	public Cost(info: BeyondStockInfo) { return info.cost; }
	protected Option(info: BeyondStockInfo): BeyondOption { return { buyat: new Date(), breakp: info.cost }; }
	public async GetAvailable() { return await this.Citius.GetSingleton(StockAvailable).GetLimit(this.constructor.name, this.StockID); }
	public async SetAvailable(num: number) { await this.Citius.GetSingleton(StockAvailable).SetLimit(this.constructor.name, this.StockID, num); }
	public async Feed(): Promise<FeedBuilder> {
		var info = await this.GetInfo();
		var available = await this.Available();
		return this.Karin.Feed(`주식정보: ${info.name}`).TextFull(true).Text({
			T: `[${info.regionInfo.market} ${info.id}] ${info.name}\r\n${info.cost}원(${info.costdifn >= 0 ? '▲' : '▽'} ${Math.abs(info.costdifn)}원 ${Math.abs(info.costdifr)}%)`,
			D: `${info.regionInfo.indexKr} | ${info.opened ? '장내' : '장외'}\r\n${available}주 구매가능${info.regionInfo.exchange !== 'KRW' ? `\r\n1${info.regionInfo.exchange} = ${info.regionInfo.exchangeIndex}KRW` : ''}\r\n(업데이트 ${info.updtime.toLocaleTimeString()}, 장내 1분)`
		}).Image({
			THU: info.image,
			W: 658, H: 408
		});
	}
}