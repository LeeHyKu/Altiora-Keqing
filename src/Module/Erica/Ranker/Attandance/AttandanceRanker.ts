import { SchemaMarge } from "../../../../Core/Citius/Types";
import Ranker from "../../../../Core/Citius/User/Ranker/Ranker";
import RankerCache from "../../../../Core/Citius/User/Ranker/RankerCache";
import UserData from "../../../../Core/Citius/User/UserData";
import UserSchema from "../../../../Core/Citius/User/UserSchema";
import Keqing from "../../../../Core/Keqing";
import Erica from "../../Component/Erica";
import AttandanceI from "./AttandanceI";
import AttandanceSorter from "./AttandanceSorter";

export default class AttandanceRanker extends Ranker<AttandanceI, AttandanceSorter>{
	constructor(base: Keqing) { super(base, new AttandanceSorter(base.Citius.User)); }
	private today: string;

	protected Manufacture(raw: SchemaMarge<UserSchema>[]): RankerCache<AttandanceI>[] {
		return raw.map(e => {
			var result: RankerCache<AttandanceI> = { id: e._id, attandanceAt: e.component['Erica']['attandance'] };
			if (e.channel) result['channel'] = e.channel;
			return result;
		})
	}
	protected Check(): boolean {
		return this.today === new Date().toDateString();
	}
	protected OnUpdate() {
		this.today = new Date().toDateString();
	}
	public async DoAttandnance(user: UserData) {
		await this.Get();
		var atd: RankerCache<AttandanceI> = { id: user.ID, attandanceAt: user.GetComponent(Erica).Attandance };
		if (!user.isSyncUser) atd['channel'] = user.LocalChannelId;
		this.Data.push(atd);
	}

	protected Title(): string { return '출석순위'; }
	protected Description(info: RankerCache<AttandanceI>): string { return `${info.attandanceAt.toLocaleTimeString()}.${info.attandanceAt.getMilliseconds()}`; }
}