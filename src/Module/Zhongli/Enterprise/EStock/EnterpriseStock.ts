import UserData from "../../../../Core/Citius/User/UserData";
import FeedBuilder from "../../../../Core/Karin/Contents/Feed/FeedBuilder";
import Stock from "../../../Dilruc/Exchange/Stock";
import StockAssetRaw from "../../../Dilruc/Exchange/StockAssetRaw";
import StockAvailable from "../../../Dilruc/Exchange/StockAvailable";
import StockBuyResult from "../../../Dilruc/Exchange/StockBuyResult";
import StockSellResult from "../../../Dilruc/Exchange/StockSellResult";
import Enterprise from "../Enterprise";
import EStockArg from "./EStockArg";
import EStockInfo from "./EStockInfo";
import EStockOption from "./EStockOption";
import EStockRaw from "./EStockRaw";

export default class EnterpriseStock extends Stock<EStockInfo, EStockArg, EStockOption>{
	private enterprise: Enterprise;

	private id: string;
	private name: string;

	private cost: number;
	private costy: number;

	private stocks: number;

	private costu: Date;
	private stocki: Date;

	private bv: number;
	private sv: number;

	private bo: number; //note: 최대 5% 적용됨

	public get Enterprise() { return this.enterprise; }

	public get StockID() { return this.id; }
	public get StockName() { return this.name; }

	public get CostNow() { return +this.cost.toFixed(3); }
	public get CostYesterday() { return +this.costy.toFixed(3); }
	public get CostDiffrance() { return +(this.CostNow - this.CostYesterday).toFixed(3); }

	public get StockListed() { return this.stocks; }

	public get BuyVolume() { return this.bv; }
	public get SellVolume() { return this.sv; }

	public get BonusChance() { return this.bo || 0; }

	public get CostUpdated() { return this.costu; }
	public get CanStockIncrease() { return this.stocki?.toDateString?.() !== new Date().toDateString(); }

	public get High() { return +(this.costy + (this.costy * 0.3)).toFixed(3); }
	public get Low() { return +(this.costy - (this.costy * 0.3)).toFixed(3); }

	public get CircuitBreaked() { return this.CostNow <= this.Low; }

	protected Initalize(name: string, id: string, raw: EStockRaw, entp: Enterprise) {
		this.enterprise = entp;

		this.id = id;
		this.name = name;

		this.cost = raw.cost;
		this.costy = raw.costy;
		this.costu = raw.costupd;

		this.stocks = raw.stocks;
		if (raw.stockinc) this.stocki = raw.stockinc;
	}
	public Raw(): EStockRaw {
		return {
			cost: this.cost,
			costy: this.costy,
			costupd: this.costu,
			stockinc: this.stocki,
			stocks: this.stocks,
			bonuschance: this.bo
		}
	}

	protected uptime = 30000;
	protected Update(): EStockInfo {
		if (new Date().toDateString() !== this.costu.toDateString()) this.NextDay();
		this.cost = this.UpdateNum();
		this.costu = new Date();
		return {
			id: this.StockID,
			fullname: this.StockName,
			cost: this.CostNow,
			difn: this.CostDiffrance
		}
	}
	private NextDay() {
		this.costy = this.cost;
		this.bv = 0;
		this.sv = 0;
		this.bo = 0;
	}
	private UpdateNum(): number {
		if (this.CircuitBreaked) return this.CostNow;
		else {
			var coi = Math.min(Math.max(Math.floor(Math.log10(this.CostNow)) - 2, 0), 3);
			var postive = Math.max(Math.min((this.BuyVolume - this.SellVolume) / this.StockListed || 0, 5), 1);
			var nagative = Math.max(Math.min((this.SellVolume - this.BuyVolume) / this.StockListed || 0, 5), 1);
			var chance = 50 + Math.max(Math.min((this.CostDiffrance / +`1${'0'.repeat(coi)}`) + this.BonusChance, 30), -30);
			return Math.max(this.CostNow + this.Choice(chance, coi, postive, -nagative), this.Low, 0);
		}
	}
	private Choice(chance: number, digit: number, postive: number, nagative: number) {
		var dig = +`1${'0'.repeat(digit)}`;
		return dig * (Math.floor(Math.random() * (postive - nagative + 1)) + nagative);
	}

	protected CheckUpdate(): boolean { return true; }
	public CheckSearch(name: string): boolean {
		return name === this.StockID;
	}
	public ID(info: EStockInfo): string {
		return info.id;
	}
	public Name(info: EStockInfo): string {
		return info.fullname;
	}
	public LimitDefault(): number { return 6000; }
	public Cost(info: EStockInfo): number {
		return info.cost;
	}
	public async GetAvailable(): Promise<number> {
		return await this.Citius.GetSingleton(StockAvailable).GetLimit(this.constructor.name, this.StockID);
	}
	public async SetAvailable(num: number) {
		return await this.Citius.GetSingleton(StockAvailable).SetLimit(this.constructor.name, this.StockID, num);
	}
	protected Option(info: EStockInfo): EStockOption {
		return {
			breakp: info.cost
		}
	}
	protected Struct(): string { return 'EnterpriseAsset'; }
	public async Feed(): Promise<FeedBuilder> {
		await this.GetInfo();
		var limit = await this.Available();
		return this.Karin.Feed(`주식정보:${this.id}`).TextFull(true).Text({
			T: `[DSE ${this.StockID}] ${this.StockName}\r\n${this.CostNow}원 (${this.CostDiffrance >= 0 ? '▲' : '▽'} ${Math.abs(this.CostDiffrance)}원)`,
			D: `다이루크 증권거래소(DSE) | ${this.CircuitBreaked ? '거래중단' : '거래가능'}\r\n상한가: ${this.High}원 | 하한가: ${this.Low}원\r\n상장주 ${this.StockListed}주 | ${limit}주 구매가능`
		});
	}
	protected Buyable(): boolean { return !this.CircuitBreaked; }
	protected OnBuy(user: UserData, res: StockBuyResult<EStockOption>) { this.bv += res.amount || 0; }
	public OnSell(user: UserData, res: StockSellResult) { this.sv += res.amount || 0; }

	public async Correction() { await this.SetAvailable(Math.max(this.StockListed - await this.Enterprise.Holder.Reduce(), 0)) }
	public async Offering(per: number) {
		if (!this.CanStockIncrease) return false;
		else {
			per = Math.max(Math.min(per, 10), 1);
			this.stocks += this.stocks * (per / 100);
			this.stocks = Math.round(this.stocks);
			await this.Enterprise.Holder.ForceUpdate();
			await this.Correction();
			await this.DoUpdate();
			this.stocki = new Date();
			return true;
		}
	}

	public async Assign(amount: number): Promise<StockAssetRaw<EStockOption>> {
		var info = await this.GetInfo();
		var ava = await this.Available();
		amount = Math.min(amount, ava) || 0;
		ava -= amount;
		await this.SetAvailable(ava);
		return {
			struct: this.Struct(),
			id: info.id,
			name: info.fullname,
			amount: amount,
			option: this.Option(info)
		};
	}
}