import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Keqing from "../../../Core/Keqing";
import KeqingBase from "../../../Core/KeqingBase";
import Stats from "../../Esther/Stats/Stats";
import Battle from "./Battle";
import ForceType from "./ForceType";

export default abstract class BattleMember<T extends Battle = Battle> extends KeqingBase {
	constructor(keqing: Keqing, private _battle: T) {
		super(keqing);
	}

	public Start() {
		var stat = this.Stats();
		this._hp = stat.HP;
		this._ap = stat.AP;
	}
	public Destroy() {
		this.OnDestroy();
	}

	public get Battle() { return this._battle; }
	public get Started() { return this.Battle.Started; }
	public get Ended() { return this.Battle.Ended; }

	private _hp: number;
	private _ap: number;
	public get HP() { return +this._hp.toFixed(3); }
	public set HP(num: number) { this._hp = Math.min(num, this.Stats().HP); }
	public get AP() { return +this._ap.toFixed(3); }
	public set AP(num: number) { this._ap = Math.min(num, this.Stats().AP); }

	public Heal(num: number) { this.HP += num; }
	public Cheer(num: number) { this.AP += num; }

	public async Breath() { this.Cheer(this.Stats().AGI); await this.OnUpdate(); }

	public async Damage(attacker: BattleMember<T>, damage: number, force: ForceType = ForceType.PHYSIC_CUT, penet: number = 0): Promise<number> {
		var stat = this.Stats();
		switch (force) {
			case ForceType.PHYSIC_CUT:
				damage *= 1.1;
				damage -= stat.DEF - penet;
				break;
			case ForceType.PHYSIC_PENETRATE:
				damage *= 0.7;
				damage -= stat.DEF - (penet * 2);
				break;
			case ForceType.MAGIC_PHYSIC:
				damage -= (stat.DEF - penet) + stat.REG;
				break;
			case ForceType.MAGIC_EFFECT:
				damage -= stat.REG;
				break;
		}
		damage -= this.DamageCorrection(attacker, damage, force, penet);
		damage = Math.max(damage, 0.1);
		if ((this.HP -= damage) <= 0) await this.SetLose(attacker);
		this.OnDamage(attacker, damage, force);
		return +damage.toFixed(3);
	}
	public AttackIndex(): { damage: number, panet: number, force: ForceType } {
		var stat = this.Stats();
		var corr = this.AttackCorrection(stat.ATK, stat.PAN, this.AttackType());
		var randin = +`1${'0'.repeat(Math.max(Math.log10(corr.damage) - 3, 0))}`;
		return {
			damage: corr.damage + Math.max(+((Math.random() * (18 * randin)) - (9 * randin)).toFixed(3), -stat.ATK + 1),
			panet: corr.panet,
			force: corr.force
		};
	}
	public async SetLose(attacker: BattleMember<T>) {
		await this.OnLose(attacker);
		await attacker.Win();
		this.Battle.Off();
	}

	public abstract Win(): any | Promise<any>;
	public abstract Stats(): Stats;
	protected abstract OnLose(attacker: BattleMember<T>): any | Promise<any>;
	protected abstract OnDestroy(): any | Promise<any>;
	protected abstract OnUpdate(): any | Promise<any>;
	protected abstract OnDamage(attacker: BattleMember<T>, actdamage: number, force: ForceType): any | Promise<any>;
	protected abstract AttackType(): ForceType;
	protected abstract AttackCorrection(damage: number, panet: number, force: ForceType): { damage: number, panet: number, force: ForceType };
	protected abstract DamageCorrection(attacker: BattleMember<T>, num: number, force: ForceType, penet: number): number;

	public abstract Feed(): FeedBuilder | Promise<FeedBuilder>;
}