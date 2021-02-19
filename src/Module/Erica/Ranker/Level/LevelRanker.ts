import { SchemaMarge } from "../../../../Core/Citius/Types";
import Ranker from "../../../../Core/Citius/User/Ranker/Ranker";
import RankerCache from "../../../../Core/Citius/User/Ranker/RankerCache";
import UserSchema from "../../../../Core/Citius/User/UserSchema";
import Keqing from "../../../../Core/Keqing";
import LevelI from "./LevelI";
import LevelSorter from "./LevelSorter";

export default class LevelRanker extends Ranker<LevelI, LevelSorter>{
	constructor(base: Keqing) { super(base, new LevelSorter(base.Citius.User)); }
	private _date: Date;

	protected Manufacture(raw: SchemaMarge<UserSchema>[]): RankerCache<LevelI>[] {
		return raw.map(e => {
			var result: RankerCache<LevelI> = { id: e._id, exp: e.component['Erica']['exp'] };
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

	protected Title(): string { return '레벨순위'; }
	protected Description(info: RankerCache<LevelI>): string {
		var lv = this.CalcExp(info.exp);
		return `Lv.${lv.level} (${lv.restExp}/${lv.entireExp};${lv.totalExp})`;
	}

	private CalcExp(exp: number) {
		var lv = Math.floor(Math.sqrt(exp / 10));
		return {
			totalExp: +exp.toFixed(2),
			level: +(lv + 1).toFixed(2),
			restExp: +(exp - (lv ** 2 * 10)).toFixed(2),
			entireExp: +(((lv + 1) ** 2 * 10) - (lv ** 2 * 10)).toFixed(2)
		};
	}
}