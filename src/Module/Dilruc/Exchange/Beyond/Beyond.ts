import Exchange from "../Exchange";
import StockOverHeadResultM from "./Interfaces/StockOverHeader/StockOverHeadResultM";
import Axios from "axios";
import StockSearchResultM from "./Interfaces/StockSearchResult/StockSearchResultM";
import StockForeignResult from "./Interfaces/StockForeignResult";
import Foreign from "./Stock/Foreign";
import Domestic from "./Stock/Domestic";
import BeyondStock from "./Stock/BeyondStock";
import UserData from "../../../../Core/Citius/User/UserData";
import FeedBuilder from "../../../../Core/Karin/Contents/Feed/FeedBuilder";
import DilucUser from "../../Component/DilucUser";

const SEARCH = 'https://m.stock.naver.com/api/json/search/searchListJson.nhn?keyword={0}';
const DOMESTIC = 'https://m.stock.naver.com/api/item/getOverallHeaderItem.nhn?code={0}';
const FOREIGN = 'https://api.stock.naver.com/stock/{0}/basic';

export default class Beyond extends Exchange {
	public async Buy(user: UserData, name: string, amount: number): Promise<FeedBuilder> {
		amount = Math.floor(Math.max(amount, 0));
		var stock = (await this.Search(name))[0];
		var res = await stock.Buy(user, amount);
		return await user.GetComponent(DilucUser).AddBuyData(res.asset).Feed();
	}

	private searchmaps: Map<string, Array<{ id: string, isForeign: boolean }>> = new Map();
	private stocks: Array<Domestic | Foreign> = [];
	public GetStock(id: string, foreign: boolean): BeyondStock {
		var struct = foreign ? Foreign : Domestic;
		var index = this.stocks.findIndex(e => e instanceof struct && e.CheckSearch(id));
		if (index !== -1) return this.stocks[index];
		else {
			var it = new struct(this.Keqing, [this, id]);
			this.stocks.push(it);
			return it;
		}
	}

	public async Search(name: string): Promise<Array<BeyondStock>> {
		var mapper = e => this.GetStock(e.id, e.isForeign);
		if (this.searchmaps.has(name)) return this.searchmaps.get(name).slice(0, 8).map(mapper);
		else {
			var searched = (await this.DoSearch(name)).result.d.map(e => { return { id: e.cd, isForeign: e.nation !== 'KOR' } });
			this.searchmaps.set(name, searched);
			return searched.map(mapper);
		}
	}

	public async DoSearch(index: string): Promise<StockSearchResultM> { return (await Axios.get<StockSearchResultM>(encodeURI(SEARCH.replace('{0}', index)), { responseType: 'json' })).data; }
	public async DoDomestic(id: string): Promise<StockOverHeadResultM> { return (await Axios.get<StockOverHeadResultM>(encodeURI(DOMESTIC.replace('{0}', id)), { responseType: 'json' })).data; }
	public async DoForeign(id: string): Promise<StockForeignResult> { return (await Axios.get<StockForeignResult>(encodeURI(FOREIGN.replace('{0}', id)), { responseType: 'json' })).data; }
}