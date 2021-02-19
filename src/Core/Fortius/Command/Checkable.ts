import { Chat } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import KeqingBase from "../../KeqingBase";
import Checker from "./Checker";
import RequireTerm from "./Checkers/RequireTerm";
import CheckerSimpleCS from "./CheckerSimpleCS";
import EssentialCheckers from "./EssentialCheckers";
import HelperCheckers from "./HelperCheckers";

export default class Checkable extends KeqingBase {
	public readonly cooltime?: number;
	public readonly critical?: boolean;
	protected readonly term: boolean = true;
	protected readonly checkers?: Array<Checker | CheckerSimpleCS>;

	private _checkers: Array<Checker>;
	public get Checkers(): Array<Checker> {
		if (this._checkers) return this._checkers;
		else {
			var checkers: Checker[] = [...EssentialCheckers.map(e => e instanceof Checker ? e : new e(this.Keqing))];
			if (this.term) checkers.push(new RequireTerm(this.Keqing));
			if (this.checkers) checkers.push(...this.checkers.map(e => e instanceof Checker ? e : new e(this.Keqing)));
			return this._checkers = checkers;
		}
	}

	public async Check(chat: Chat, user: UserData, channel: ChannelData) {
		for (var checker of this.Checkers) if (!(await checker.Check(this.constructor.name, chat, user, channel, this))) return checker;
		return null;
	}
	public async CheckHelper(chat: Chat, user: UserData, channel: ChannelData) {
		for (var checker of this.Checkers.filter(e => HelperCheckers.some(c => e instanceof c))) if (!(await checker.Check(this.constructor.name, chat, user, channel, this))) return checker;
	}
}