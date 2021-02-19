import { ObjectId } from "mongodb";
import { CustomType } from "node-kakao";
import { isNullOrUndefined } from "util";
import UserData from "../../../Core/Citius/User/UserData";
import CarouselBuilder from "../../../Core/Karin/Contents/Carousel/CarouselBuilder";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import List from "../../../Core/Karin/Contents/List/List";
import Profile from "../../../Core/Karin/Items/Profile";
import Keqing from "../../../Core/Keqing";
import KeqingBase from "../../../Core/KeqingBase";
import Erica from "../../Erica/Component/Erica";
import Inventory from "../../Esther/Inventory/Inventory";
import Item from "../../Esther/Venti/Item";
import Rarity from "../../Esther/Venti/Rarity";
import Recipe from "../../Esther/Venti/Uppskrift/Recipe/Recipe";
import Uppskrift from "../../Esther/Venti/Uppskrift/Uppskrift";
import Venti from "../../Esther/Venti/Venti";
import Zhongli from "../Zhongli";
import EnterpriseRank from "./EnterpriseRank";
import EnterpriseRaw from "./EnterpriseRaw";
import EnterpriseHolder from "./EStock/EnterpriseHolder";
import EnterpriseStock from "./EStock/EnterpriseStock";
import Product from "./Product";
import { SharedRecipe } from "./SharedRecipe";

export default class Enterprise extends KeqingBase {
	private _id: ObjectId;
	private _name: string;
	private _stname: string;
	private _rank: EnterpriseRank;
	private _description?: string;

	private boss: ObjectId;
	private employees: ObjectId[];
	private maxemploy: number;

	private sales: number;
	private products: Product[];
	private recipes: SharedRecipe[];

	private stock: EnterpriseStock;
	private holder: EnterpriseHolder;

	public get ID() { return this._id; }
	public get Name() { return this._name; }
	public get Rank() { return this._rank; }
	public get Description() { return this._description || ''; }
	public set Description(desc: string) { this._description = desc; }

	public get Boss() { return this.boss; }
	public get Employees() { return this.employees; }
	public get MaxEmploy() { return this.maxemploy || 10; }
	public get Employable() { return this.Employees.length < this.MaxEmploy; }

	public Recipes(who: ObjectId) { return this.recipes.filter(e => e.whoshared.toHexString() !== who.toHexString()).map(e => e.recipe); }
	public get Products() { return this.products.filter(e => e.amount > 0); }

	public get StockName() { return this._stname; }
	public get Stock() { return this.stock; }
	public get Holder() { return this.holder; }

	constructor(keqing: Keqing, raw: EnterpriseRaw) { super(keqing); this.Install(raw); }

	private Install(raw: EnterpriseRaw) {
		this._id = isNullOrUndefined(raw._id) ? new ObjectId() : raw._id;
		this._name = raw.name;
		this._rank = raw.rank;
		if (raw.description) this._description = raw.description;

		this.boss = raw.boss;
		this.employees = raw.employees;
		this.maxemploy = raw.maxemploy;

		this.sales = raw.sales;
		this.products = raw.products;
		var upps = this.Citius.GetSingleton(Uppskrift);
		this.recipes = raw.recipes.map(e => { return { whoshared: e.whoshared, recipe: new (upps.GetByName(e.recipe.struct))(this.Keqing, e.recipe) } });

		this._stname = raw.stname;
		this.stock = new EnterpriseStock(this.Keqing, [this.Name, this.StockName, raw.stock, this]);
		this.holder = new EnterpriseHolder(this.Keqing, this);
	}
	public Raw(): EnterpriseRaw {
		return {
			_id: this._id,
			name: this._name,
			rank: this._rank,
			description: this._description || '',
			boss: this.boss,
			employees: this.employees,
			maxemploy: this.maxemploy,
			sales: this.sales,
			products: this.Products,
			recipes: this.recipes.map(e => { return { whoshared: e.whoshared, recipe: e.recipe.Raw() } }),
			stname: this._stname,
			stock: this.Stock.Raw()
		};
	}

	public Extend() { return ++this.maxemploy; }

	public async BossData() { return this.Citius.User.FindByID(this.Boss); }
	public async EmployeesData() {
		var datas: UserData[] = [];
		for (var user of this.employees) {
			try {
				datas.push(await this.Citius.User.FindByID(user));
			} catch { continue; }
		}
		return datas;
	}
	public Joined(id: ObjectId) { var hs = id.toHexString(); return [this.boss, ...this.employees].some(e => e.toHexString() === hs); }
	public isBoss(id: ObjectId) { return this.Boss.toHexString() === id.toHexString(); }

	public async Info(): Promise<FeedBuilder> {
		var boss = await (await this.BossData()).GetUserInfo();
		await this.Stock.GetInfo();
		return this.Karin.Feed('정보').TextFull(true).Text({
			T: `[DSE ${this.StockName}] ${this.Name}\r\n(${EnterpriseRank.Kr[this.Rank]})`,
			D: `사주: ${boss.Nickname} | 직원수: ${this.Employees.length}명\r\n주식수: ${this.Stock.StockListed}주 | 주가: ${this.Stock.CostNow}원\r\n${this.Description || '설명없음'}`
		});
	}
	public async UserList(): Promise<CarouselBuilder<List>> {
		var car = this.Karin.Carousel<List>(CustomType.LIST, '직원목록');
		var usds = await this.EmployeesData();

		var boin = await (await this.BossData()).GetUserInfo();
		var listf = this.Karin.List('').Head({ TD: { T: `${this.StockName}社 직원 p.1` } }).Item({ TH: { THU: boin.ProfileImageURL, H: 200, W: 200 }, TD: { T: boin.Nickname, D: '사장' } });
		var i = 0, j = 0;
		for (i = 0; i < 4 && i < usds.length; i++) {
			var info = await usds[i].GetUserInfo();
			listf.Item({ TH: { THU: info.ProfileImageURL, H: 200, W: 200 }, TD: { T: info.Nickname, D: '직원' } });
		}
		car.add(listf);

		if (usds.length > 4) {
			for (i = 0; i < (usds.length - 4) / 5; i++) {
				var list = this.Karin.List('').Head({ TD: { T: `${this.StockName}社 직원 p.${i + 2}` } });
				for (j = 0; j < 5 && ((i * 5) + j + 4) < usds.length; j++) {
					var info = await usds[(i * 5) + j + 4].GetUserInfo();
					list.Item({ TH: { THU: info.ProfileImageURL, H: 200, W: 200 }, TD: { T: info.Nickname, D: '직원' } })
				}
				car.add(list);
			}
		}
		return car;
	}

	public Handover(user: ObjectId) {
		if (!this.Joined(user) || this.isBoss(user)) return;
		else {
			this.employees.push(this.boss);
			this.boss = user; this.employees.splice(this.employees.findIndex(e => e.toHexString() === user.toHexString()), 1);
		}
	}
	public Enroll(user: ObjectId) {
		if (this.Citius.GetSingleton(Zhongli).GetJoined(user) || this.Joined(user) || this.employees.length >= this.MaxEmploy) return;
		else this.employees.push(user);
	}
	public Resign(user: ObjectId) {
		if (!this.Joined(user) || this.isBoss(user)) return;
		else this.employees.splice(this.employees.findIndex(e => e.toHexString() === user.toHexString()), 1);
	}

	public ShareRecipe(who: ObjectId, recipe: Recipe<any>) { if (!this.recipes.some(e => e.whoshared.toHexString() === who.toHexString() && e.recipe.Id === recipe.Id)) this.recipes.push({ whoshared: who, recipe: recipe }); }
	public RecipeList(): FeedBuilder | CarouselBuilder<Feed> {
		if (this.recipes.length < 1) return this.Karin.Reject('공유된 레시피가 없습니다', '레시피 없음');
		else {
			var car = this.Karin.Carousel<Feed>(CustomType.FEED, '공유레시피 목록');
			for (var reci of this.recipes) car.add(reci.recipe.Feed());
			return car;
		}
	}

	public async Shop(): Promise<FeedBuilder | CarouselBuilder<Feed>> {
		if (this.Products.length < 1) return this.Karin.Reject('판매중인 상품이 없습니다', '상품없음');
		else {
			var car = this.Karin.Carousel<Feed>(CustomType.FEED, '상점');
			var cache: Map<ObjectId, Profile> = new Map();
			for (var item of this.Products) {
				var profile = cache.get(item.author) || await (await this.Citius.User.FindByID(item.author)).GetProfile();
				if (!cache.has(item.author)) cache.set(item.author, profile);
				car.add(this.Karin.Feed('').Profile(profile).TextFull(true).Text({
					T: `[${Rarity.rarityKo[item.product.item.rarity]}] ${item.product.item.name}\r\n${item.price}원 (id: ${item.tid})`,
					D: `${item.product.struct} | ${item.amount}개 남음\r\n${item.product.item.description}`
				}));
			}
			return car;
		}
	}
	public Sell(who: ObjectId, item: Item<any>, price: number) {
		var hash = item.Hash();
		var index = this.products.findIndex(e => e.author.toHexString() === who.toHexString() && e.hash === hash && e.price === price);
		if (index !== -1) this.products[index].amount++;
		else {
			this.products.push({
				product: item.RawI(),
				author: who,
				amount: 1,
				price: Math.min(Math.max(price || 0, 0), Number.MAX_SAFE_INTEGER),
				hash: item.Hash(),
				tid: this.GenerateUid(5)
			});
		}
	}
	public async Buy(who: UserData, hash: string): Promise<FeedBuilder> {
		var prod = this.Products.find(e => e.product.item.name === hash || e.tid === hash);
		if (!prod) return this.Karin.Reject('알 수 없는 아이템입니다', '아이템 없음');
		else if (who.GetComponent(Erica).Money <= prod.price) return this.Karin.Reject(`돈이 부족합니다\r\n(가격: ${prod.price}원, 현재 ${who.GetComponent(Erica).Money}원)`, '돈부족');
		else {
			var item = this.Citius.GetSingleton(Venti).CreateByName(who, prod.product).Clone();
			who.GetComponent(Inventory).AddItem(item);
			prod.amount--;
			(await this.Citius.User.FindByID(prod.author)).GetComponent(Erica).Money += prod.price;
			who.GetComponent(Erica).Money -= prod.price;
			return item.Feed();
		}
	}

	private GenerateUid(length: number) {
		var result = '';
		var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
}