import ForceType from "../../../../Odin/Battle/ForceType";
import ItemRaw from "../../ItemRaw";
import Gear from "../Gear/Gear";
import WeaponRawM from "./WeaponRawM";

export default class Weapon<T extends ItemRaw = {}> extends Gear<WeaponRawM<T>> {
	private _force: ForceType;
	public get ForceType() { return this._force; }

	protected OnWeapExport(): T { return <T>{}; }
	protected OnWeapInital(arg: T) { }

	protected OnExport(): WeaponRawM<T> { return Object.assign(this.OnWeapExport(), { force: this.ForceType }); }
	protected OnInitalize(arg: WeaponRawM<T>) { this._force = arg.force; this.OnWeapInital(arg); }
	protected Structor() { return Weapon; }
}