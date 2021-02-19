import { SchemaMarge } from "../../../../Core/Citius/Types";
import Ranker from "../../../../Core/Citius/User/Ranker/Ranker";
import RankerCache from "../../../../Core/Citius/User/Ranker/RankerCache";
import UserSchema from "../../../../Core/Citius/User/UserSchema";
import Keqing from "../../../../Core/Keqing";
import MoneyI from "./MoneyI";
import MoneySorter from "./MoneySorter";

export default class MoneyRanker extends Ranker<MoneyI, MoneySorter>{
	constructor(base: Keqing) { super(base, new MoneySorter(base.Citius.User)); }
	private _date: Date;

	protected Manufacture(raw: SchemaMarge<UserSchema>[]): RankerCache<MoneyI>[] {
		return raw.map(e => {
			var result: RankerCache<MoneyI> = { id: e._id, money: e.component['Erica']['money'] };
			if (e.channel) result['channel'] = e.channel;
			return result;
		})
	}

	protected Check(): boolean {
		return (Date.now() - this._date.getTime()) < 3600000
	}
	protected OnUpdate() {
		return this._date = new Date();
	}

	protected Title(): string { return '돈순위'; }
	protected Description(info: RankerCache<MoneyI>): string { return `${info.money}원`; }
}