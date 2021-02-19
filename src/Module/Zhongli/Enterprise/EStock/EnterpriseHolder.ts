import { ObjectId } from "mongodb";
import { SchemaMarge } from "../../../../Core/Citius/Types";
import Ranker from "../../../../Core/Citius/User/Ranker/Ranker";
import RankerCache from "../../../../Core/Citius/User/Ranker/RankerCache";
import UserSchema from "../../../../Core/Citius/User/UserSchema";
import Keqing from "../../../../Core/Keqing";
import Enterprise from "../Enterprise";
import EnterpriseHolderIndex from "./EnterpriseHolderIndex";
import EnterpriseHolderSorter from "./EnterpriseHolderSorter";

export default class EnterpriseHolder extends Ranker<EnterpriseHolderIndex, EnterpriseHolderSorter> {
	constructor(keqing: Keqing, private enterprise: Enterprise) { super(keqing, new EnterpriseHolderSorter(keqing.Citius.User, enterprise.StockName)); }
	public get Enterprise() { return this.enterprise }

	protected Manufacture(raw: SchemaMarge<UserSchema>[]): RankerCache<EnterpriseHolderIndex>[] {
		var filt = e => e.struct === 'EnterpriseAsset' && e.id === this.Enterprise.StockName;
		var mapper = e => e.amount;
		var reducer = (p, n) => p + n;
		return raw.map(e => {
			var res: RankerCache<EnterpriseHolderIndex> = { id: e._id, amount: e.component['DilucUser']['assets'].filter(filt).map(mapper).reduce(reducer) };
			if (e.channel) res['channel'] = e.channel;
			return res;
		});
    }
	protected Title(): string {
		return `${this.Enterprise.StockName} 주주목록`;
    }
	protected Description(info: RankerCache<EnterpriseHolderIndex>): string {
		var stocks = this.Enterprise.Stock.StockListed;
		return `${info.amount}주 (${+((info.amount / stocks) * 100).toFixed(3)}%)`;
	}

	private last: Date;
	protected Check(): boolean {
		return Date.now() - this.last.getTime() <= 60000
    }
	protected OnUpdate() {
		this.last = new Date();
	}
	public async ForceUpdate() { return await this.DoUpdate(); }

	public async Reduce() { return (await this.Get()).map(e => e.amount).reduce((p, n) => p + n); }
	public async IsMajour(user: ObjectId) { return (await this.MyIndex(user)).global === 1; }
}