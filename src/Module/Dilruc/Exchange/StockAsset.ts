import UserData from "../../../Core/Citius/User/UserData";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Keqing from "../../../Core/Keqing";
import KeqingBase from "../../../Core/KeqingBase";
import Erica from "../../Erica/Component/Erica";
import Exchange from "./Exchange";
import Stock from "./Stock";
import StockAssetRaw from "./StockAssetRaw";
import StockSellResult from "./StockSellResult";

export default abstract class StockAsset<I, O, S extends Stock<I, any[], O>> extends KeqingBase {
	constructor(keqing: Keqing, private _data: UserData, raw: StockAssetRaw<O>) {
		super(keqing);
		this.id = raw.id;
		this.name = raw.name;
		this.amount = isNaN(raw.amount) ? 0 : raw.amount;
		this.Install(raw.option);
	}
	protected get Data() { return this._data; }
	private id: string;
	private name: string;
	private amount: number;
	protected expiration: boolean = false;
	public get Id() { return this.id; }
	public get Name() { return this.name; }
	public get Amount() { return this.amount; }
	public set Amount(num: number) { this.amount = num; }
	public get Expiration() { return this.expiration; }
	public get IdI() { return `${this.constructor.name}:${this.Id}`; }
	public get NameI() { return `${this.constructor.name}:${this.Name}`; }

	protected abstract Install(option: O);
	protected abstract OptRaw(): O;

	public Raw(): StockAssetRaw<O> {
		this.Stock();
		return {
			struct: this.constructor.name,
			id: this.id,
			name: this.name,
			amount: this.amount,
			option: this.OptRaw()
		};
	}

	public abstract Same(asset: StockAssetRaw<O>): boolean;
	public abstract Reduce(asset: StockAssetRaw<O>);

	public abstract Sellable(): boolean;
	public abstract Stock(): S;
	public abstract Fee(): number;
	public async Sell(amount: number): Promise<StockSellResult> {
		try {
			if (!this.Sellable()) return { id: this.Id, name: this.Name, amount: 0, cost: 0, costPer: 0, feeRate: 0 };
			else {
				var stock = this.Stock();
				var info = await stock.GetInfo();
				var cost = stock.Cost(info);
				amount = Math.max(Math.min(this.Amount, amount), 0);
				var co = cost * amount;
				var fee = this.Fee();
				co -= co * fee;
				co = +co.toFixed(4);
				this.Data.GetComponent(Erica).Money += co;
				this.Amount -= amount;
				if (this.Amount <= 0) this.expiration = true;
				await stock.SetAvailable((await stock.Available()) + amount);
				var res = {
					id: this.Id,
					name: this.Name,
					amount: amount,
					cost: co,
					costPer: cost,
					feeRate: fee
				};
				stock.OnSell(this.Data, res);
				return res;
			}
		}
		catch (e) {
			this.expiration = true;
			throw e;
		}
	}

	protected abstract CreateFeed(): FeedBuilder | Promise<FeedBuilder>;
	public async Feed(): Promise<FeedBuilder> {
		try {
			return this.CreateFeed();
		} catch (e) {
			this.expiration = true;
			this.Qurare.Error(e);
			return this.Karin.Error(e);
		}
	}
}