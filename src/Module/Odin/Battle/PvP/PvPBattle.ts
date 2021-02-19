import ChannelData from "../../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../../Core/Citius/User/UserData";
import Keqing from "../../../../Core/Keqing";
import Battle from "../Battle";
import BattleMember from "../BattleMember";
import BattleTemp from "../BattleTemp";

export default class PvPBattle extends Battle {
	constructor(keqing: Keqing, channel: ChannelData, chell: UserData, oppon: UserData) {
		super(keqing, channel);
		this.chell = new BattleTemp(keqing, this, chell);
		this.oppon = new BattleTemp(keqing, this, oppon);
	}
	private chell: BattleTemp;
	private oppon: BattleTemp;

	protected OnStart() { return; }
	public async Update() { return; }
	public getOpponent(you: BattleTemp, focus?: string): BattleTemp { return you.UserData.ID.toHexString() === this.chell.UserData.ID.toHexString() ? this.oppon : this.chell; }
	protected getAllMember(): BattleMember[] {
		return [this.chell, this.oppon];
	}
}