import DataTempI from "../../../Core/Citius/base/DataTempI";
import UserData from "../../../Core/Citius/User/UserData";
import UserQuery from "../../../Core/Citius/User/UserQuery";
import UserSchema from "../../../Core/Citius/User/UserSchema";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Keqing from "../../../Core/Keqing";
import Esther from "../../Esther/Esther/Esther";
import Battle from "./Battle";
import BattleMember from "./BattleMember";
import ForceType from "./ForceType";
import PvPBattle from "./PvP/PvPBattle";

export default class BattleTemp extends BattleMember<Battle> implements DataTempI<UserQuery, UserSchema> {
	constructor(keqing: Keqing, _battle: Battle, private _data: UserData) {
		super(keqing, _battle);
		_data.AttachTempU(this);
	}
	protected get Data() { return this._data; }
	public get UserData() { return this.Data; }

	public Stats() { return this.Data.GetComponent(Esther).TotalStat; }
	public async DoAttack(focus?: string): Promise<FeedBuilder> {
		if (!this.Started) return this.Karin.Reject('아직 전투가 시작되지 않았습니다', '시작상태 아님');
		else {
			var opponent = this.Battle.getOpponent(this, focus);
			var stat = this.Stats();
			if (!opponent) return this.Karin.Reject('지정한 상대를 알 수 없습니다', '알수없는 상대');
			else if (this.AP < 0) return this.Karin.Reject('행동할 수 없습니다', '행동불가!');
			else {
				this.AP -= stat.FAT;
				var index = this.AttackIndex();
				var act = await opponent.Damage(this, index.damage, index.force, index.panet);
				var pro = await this.Data.GetUserInfo();
				if (!this.Ended) return this.Karin.Feed('공세결과').Profile({
					TD: { T: pro.Nickname },
					TH: {
						THU: pro.ProfileImageURL,
						H: 200, W: 200
					}
				}).TextFull(true).Text({
					T: '공격!',
					D: `${act} 데미지 | 행동력 소모 ${stat.FAT}\r\n(행동력: ${this.AP} | 상대 체력: ${opponent.HP})`
				});
				else return null;
			}
		}
	}
	protected async OnDamage(attacker: BattleMember, actdamage: number, force: ForceType) {
		if (!(attacker instanceof BattleTemp) && !this.Ended) {
			var info = await this.Data.GetUserInfo();
			await this.Karin.Feed('방어결과').Profile({
				TD: { T: info.Nickname },
				TH: {
					THU: info.ProfileImageURL,
					H: 200, W: 200
				}
			}).TextFull(true).Text({
				T: '데미지!',
				D: `${actdamage} 피해\r\n(현재 체력: ${this.HP})`
			}).SendChannel(this.Battle.Channel);
		}
	}

	public async Feed(): Promise<FeedBuilder> {
		var stats = this.Stats();
		return this.Karin.Feed('전투정보').Profile(await this.Data.GetProfile()).TextFull(true).Text({
			T: `HP: ${this.HP}/${+stats.HP.toFixed(3)}\r\nAP: ${this.AP}/${+stats.AP.toFixed(3)}`,
			D: `피로도: ${stats.FAT}`
		});
	}

	protected OnLose(attacker: BattleMember) { }
	public async Win() {
		switch (true) {
			case this.Battle instanceof PvPBattle:
				break;
		}

		var info = await this.Data.GetUserInfo();
		await this.Karin.Feed('승리').Profile({
			TD: { T: info.Nickname },
			TH: { THU: info.ProfileImageURL, H: 200, W: 200 }
		}).Text({
			T: `${info.Nickname}님이 승리하였습니다`,
			D: `임시텍스트 임시텍스트 임시텍스트 임시텍스트 임시텍스트 임시텍스트 임시텍스트 임시텍스트 임시텍스트 임시텍스트 임시텍스트 임시텍스트`
		}).SendChannel(this.Battle.Channel);
	}
	protected OnDestroy() { this.Data.DelTempU(BattleTemp); }
	protected OnUpdate() { }
	protected AttackType(): ForceType { return this.Data.GetComponent(Esther).Force; }
	protected AttackCorrection(damage: number, panet: number, force: ForceType): { damage: number; panet: number; force: ForceType; } {
		return { damage: damage, panet: panet, force: ForceType.PHYSIC_CUT }
	}
	protected DamageCorrection(attacker: BattleMember, num: number, force: ForceType, penet: number): number {
		return 0;
	}
}