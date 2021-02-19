import { isNullOrUndefined } from "util";
import UserData from "../../../Core/Citius/User/UserData";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Keqing from "../../../Core/Keqing";
import KeqingBase from "../../../Core/KeqingBase";
import Erica from "../../Erica/Component/Erica";
import Exchange from "./Exchange";
import StockAssetRaw from "./StockAssetRaw";
import StockBuyResult from "./StockBuyResult";
import StockSellResult from "./StockSellResult";

export default abstract class Stock<I, R extends any[], O> extends KeqingBase {
	constructor(keqing: Keqing, arg: R) {
		super(keqing);
		this.Initalize(...arg);
	}
	protected abstract Initalize(...args: R);

	private _info: I;
	private _time: Date;
	protected uptime: number;
	protected abstract Update(): I | Promise<I>;
	protected abstract CheckUpdate(): boolean;
	protected async DoUpdate() { this._info = await this.Update(); this._time = new Date(); }
	public async GetInfo() {
		if (!this._info || ((!this._time || Math.floor(Date.now() / 1000) - Math.floor(this._time.getTime() / 1000) > this.uptime / 1000) && this.CheckUpdate())) await this.DoUpdate();
		return this._info;
	}
	public abstract CheckSearch(name: string): boolean;
	public abstract ID(info: I): string;
	public abstract Name(info: I): string;
	public abstract LimitDefault(): number;
	public abstract Cost(info: I): number;
	protected abstract Option(info: I): O;
	protected abstract Struct(): string;

	public async Available(): Promise<number> {
		var av = await this.GetAvailable();
		return isNullOrUndefined(av) ? this.LimitDefault() : av;
	}
	public abstract GetAvailable(): Promise<number>;
	public abstract SetAvailable(num: number): Promise<void>;

	public async Buy(user: UserData, amount: number): Promise<StockBuyResult<O>> {
		var erica = user.GetComponent(Erica);
		var info = await this.GetInfo();
		var id = this.ID(info);
		var name = this.Name(info);
		var limit = await this.Available();
		var cost = this.Cost(info);
		if (!this.Buyable()) return { id: id, name: name, amount: 0, cost: 0, costPer: cost, asset: { struct: this.Struct(), id: id, name: name, amount: 0, option: this.Option(info) } };
		else {
			amount = Math.floor(Math.max(Math.min(isNaN(amount) ? 0 : amount, erica.Money / cost || 0, limit || 0), 0));
			var costT = +(amount * cost).toFixed(3);
			erica.Money -= costT;
			await this.SetAvailable(limit - amount);
			var res = {
				id: id,
				name: name,
				amount: amount,
				cost: costT,
				costPer: cost,
				asset: {
					struct: this.Struct(),
					id: id,
					name: name,
					amount: amount,
					option: this.Option(info)
				}
			};
			this.OnBuy(user, res);
			return res;
		}
	}
	protected Buyable(): boolean { return true; }
	protected OnBuy(user: UserData, res: StockBuyResult<O>) { }
	public OnSell(user: UserData, res: StockSellResult) { }

	public abstract Feed(): Promise<FeedBuilder>;
}