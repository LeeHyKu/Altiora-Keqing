import UserData from "../../../Core/Citius/User/UserData";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Keqing from "../../../Core/Keqing";
import KeqingBase from "../../../Core/KeqingBase";
import Battle from "../../Odin/Battle/Battle";
import BattleTemp from "../../Odin/Battle/BattleTemp";
import StatOccupation from "../Stats/StatOccupation";
import OccupationStatus from "./OccupationStatus";
import OccupationStatusM from "./OccupationStatusM";

export default abstract class Occupation<T extends OccupationStatus> extends KeqingBase {
	constructor(keqing: Keqing, private _user: UserData, raw?: T) {
		super(keqing);
		this.Installation(raw || this.Create());
	}
	protected get User() { return this._user; }
	protected abstract UserStatString(): string;

	protected abstract Create(): T;
	protected abstract Installation(stats: T);
	protected abstract Export(): T;
	public Raw(): OccupationStatusM<T> { return Object.assign(this.Export(), { occupation: this.constructor.name }); }

	public abstract Default(): T;
	public Reduce(pre: T, next: T): OccupationStatusM<T> { return Object.assign(this.OnReduce(pre, next), { occupation: this.constructor.name }); }
	protected abstract OnReduce(pre: T, next: T): T;

	public abstract Scale(): StatOccupation;

	/*
	 * TODO
	 * Action on Attack
	 *  input: battle, atkType, atk
	 *  returns: atk bonus
	 */
	//public abstract Attack(battle: BattleTemp<any>)
	/*
	 * TODO
	 * Action on Damage
	 *  input: battle, damageType, dmg
	 *  returns: damage R
	 */
	/*
	 * TODO
	 * Action on Heal
	 *  input: battle, heal
	 *  returns: heal bonus
	 */

	protected readonly name: string;
	protected readonly description?: string;
	public get Name() { return this.name || this.constructor.name; }
	public get Description() { return this.description || '설명없음'; }

	public Feed(): FeedBuilder {
		return this.Karin.Feed('직업정보').TextFull(true).Text({
			T: this.Name,
			D: `OCID: ${this.constructor.name}\r\n${this.Description}`
		});
	}
	public Stats(): FeedBuilder {
		return this.Karin.Feed('직업정보').TextFull(true).Text({
			T: this.Name,
			D: `${this.Description}\r\n--스텟--\r\n${this.UserStatString()}`
		});
	}
}