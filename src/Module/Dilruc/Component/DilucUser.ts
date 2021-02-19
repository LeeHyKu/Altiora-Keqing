import { CustomType } from "node-kakao";
import UserComponent from "../../../Core/Citius/User/UserComponent";
import CarouselBuilder from "../../../Core/Karin/Contents/Carousel/CarouselBuilder";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Diluc from "../Diluc";
import StockAsset from "../Exchange/StockAsset";
import StockAssetCS from "../Exchange/StockAssetCS";
import StockAssetRaw from "../Exchange/StockAssetRaw";
import DilucRaw from "./DilucRaw";

export default class DilucUser extends UserComponent<DilucRaw> {
	private inventory: StockAsset<any, any, any>[];
	private Filter(id: string, struct?: string) { id = id.toLowerCase(); return this.Inventory.filter(e => (e.Id.toLowerCase() === id || e.IdI.toLowerCase() === id || e.Name.toLowerCase() === id || e.NameI.toLowerCase() === id) && (!struct || e.constructor.name === struct) && e.Sellable()); }
	public get Inventory() { return this.inventory.filter(e => !e.Expiration && e.Amount > 0); }
	public Has(id: string, struct?: string) { return this.Inventory.some(e => e.Id === id && (!struct || e.constructor.name === struct)); }
	public Red(id: string, struct?: string) { return this.Inventory.filter(e => e.Id === id && (!struct || e.constructor.name === struct)).map(e => e.Amount).reduce((p, n) => p + n); }

	protected Initialization(): DilucRaw {
		return {
			assets: []
		};
	}
	protected Installation(raw: DilucRaw) {
		this.inventory = raw.assets.map(e => this.Citius.GetSingleton(Diluc).CreateByName(this.Data, e));
	}
	public Raw(): DilucRaw {
		return {
			assets: this.Inventory.map(e => {
				try { return e.Raw(); }
				catch { return null; }
			}).filter(e => e)
		};
	}

	public AddBuyData(asset: StockAssetRaw<any>) {
		var find = this.Inventory.find(e => e.Same(asset));
		if (find) { find.Reduce(asset); return find; }
		else {
			var cr = this.Citius.GetSingleton(Diluc).CreateByName(this.Data, asset);
			this.inventory.push(cr);
			return cr;
		}
	}
	public async Sell(name: string, amount: number): Promise<FeedBuilder> {
		var stocks = this.Filter(name);
		if (stocks.length < 1) return this.Karin.Reject('보유하고 있는 주식이 아닙니다', '주식 없음');
		else {
			amount = isNaN(amount) ? 0 : amount;
			var am = amount;
			var co = 0;
			var cop = 0;
			var fee = stocks[0].Fee();
			var id = stocks[0].Id;
			var name = stocks[0].Name;
			for (var stock of stocks) {
				var res = await stock.Sell(amount);
				amount -= res.amount;
				co += res.cost;
				cop += res.costPer;
				if (amount <= 0) continue;
			}
			cop = +(cop / stocks.length).toFixed(3);
			return this.Karin.Confirm(`${am - amount}주 판매완료\r\n${co}원(주당 ${cop}원${fee ? `, 수수료 ${fee * 100}%` :''})`, `[${id}] ${name}`);
		}
	}

	public async InventoryFeed(struct?: StockAssetCS): Promise<CarouselBuilder<Feed> | FeedBuilder> {
		var list = struct ? this.Inventory.filter(e => e instanceof struct) : this.Inventory;
		if (list.length < 1) return this.Karin.Reject('보유하고 있는 주식이 없습니다', '주식없음');
		else {
			var car = this.Karin.Carousel<Feed>(CustomType.FEED, '주식보유정보');
			for (var inv of list) car.add(await inv.Feed());
			return car;
		}
	}
}