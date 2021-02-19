import FeedBuilder from "../../../../../Core/Karin/Contents/Feed/FeedBuilder";
import StockAsset from "../../StockAsset";
import StockAssetRaw from "../../StockAssetRaw";
import Beyond from "../Beyond";
import BeyondOption from "../BeyondOption";
import BeyondStockInfo from "../BeyondStockInfo";
import BeyondStock from "./BeyondStock";

export default abstract class BeyondAsset<S extends BeyondStock> extends StockAsset<BeyondStockInfo, BeyondOption, S>{
	private _buyat: Date;
	private _breakp: number;
	public get Buyat() { return this._buyat; }
	public get Breakp() { return this._breakp; }
	public set Breakp(num: number) { this._breakp = num; }

	protected Install(option: BeyondOption) {
		this._buyat = option.buyat;
		this._breakp = option.breakp;
	}
	protected OptRaw(): BeyondOption {
		return {
			buyat: this._buyat,
			breakp: this._breakp
		};
	}
	public Same(asset: StockAssetRaw<BeyondOption>): boolean {
		return (
			asset.struct === this.constructor.name &&
			asset.id === this.Id &&
			(Date.now() - asset.option.buyat.getTime() < 600000 ? !this.Sellable() : this.Sellable())
		);
	}
	public Reduce(asset: StockAssetRaw<BeyondOption>) {
		this.Breakp = +(((this.Amount * this.Breakp) + (asset.amount * asset.option.breakp)) / (this.Amount + asset.amount)).toFixed(4);
		this.Amount += asset.amount;
	}
	public Sellable(): boolean { return Date.now() - this.Buyat.getTime() >= 600000; }
	public Stock(): S { return <S>this.Citius.GetSingleton(Beyond).GetStock(this.Id, this.isForeign()); }
	protected abstract isForeign(): boolean;
	protected async CreateFeed(): Promise<FeedBuilder> {
		var info = await this.Stock().GetInfo();
		var cansell = new Date(this.Buyat.getTime() + 600000);
		var bp = this.Breakp;
		bp += bp * this.Fee();
		bp = +bp.toFixed(3);
		return this.Karin.Feed(`주식정보: ${this.Name}`).TextFull(true).Text({
			T: `[${info.regionInfo.market} ${info.id}] ${info.name}\r\n${info.cost}원(${info.costdifn >= 0 ? '▲' : '▽'} ${Math.abs(info.costdifn)}원 ${Math.abs(info.costdifr)}%)`,
			D: `${this.Amount}주 보유중 | 평가가치 ${+(this.Amount * info.cost).toFixed(3)}원\r\n손익분기점: 주당 ${bp}원\r\n${this.Sellable() ? '판매가능' : `${cansell.toLocaleTimeString()}부터 판매가능`}${info.regionInfo.exchange !== 'KRW' ? `\r\n1${info.regionInfo.exchange} = ${info.regionInfo.exchangeIndex}KRW` : ''}`
		});
	}
}