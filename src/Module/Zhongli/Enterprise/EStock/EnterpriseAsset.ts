import FeedBuilder from "../../../../Core/Karin/Contents/Feed/FeedBuilder";
import StockAsset from "../../../Dilruc/Exchange/StockAsset";
import StockAssetRaw from "../../../Dilruc/Exchange/StockAssetRaw";
import Zhongli from "../../Zhongli";
import EnterpriseStock from "./EnterpriseStock";
import EStockInfo from "./EStockInfo";
import EStockOption from "./EStockOption";

export default class EnterpriseAsset extends StockAsset<EStockInfo, EStockOption, EnterpriseStock>{
	private _breakp: number;
	public get Breakpoint() { return this._breakp; }

	protected Install(option: EStockOption) {
		this._breakp = option.breakp;
	}
	protected OptRaw(): EStockOption {
		return {
			breakp: this.Breakpoint
		}
	}
	public Same(asset: StockAssetRaw<EStockOption>): boolean {
		return (
			asset.id === this.Id &&
			asset.struct === this.constructor.name
		);
	}
	public Reduce(asset: StockAssetRaw<EStockOption>) {
		this._breakp = ((this.Amount * this.Breakpoint) + (asset.amount * asset.option.breakp)) / (this.Amount + asset.amount);
		this.Amount += asset.amount;
	}
	public Sellable(): boolean {
		return !this.Stock().CircuitBreaked;
	}
	public Stock(): EnterpriseStock {
		return this.Citius.GetSingleton(Zhongli).GetByStName(this.Id).Stock;
	}
	public Fee(): number { return 0; }
	protected async CreateFeed(): Promise<FeedBuilder> {
		var stock = this.Stock();
		var info = await stock.GetInfo();
		return this.Karin.Feed(`주식보유정보:${this.Name}`).TextFull(true).Text({
			T: `[DSE ${stock.StockID}] ${stock.StockName}`,
			D: `${this.Amount}주 | ${this.Amount * stock.CostNow}원\r\n${!stock.CircuitBreaked ? '판매가능' : '판매불가'}`
		});
	}
}