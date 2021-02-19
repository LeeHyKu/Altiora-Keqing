import Item from "../../Item";
import ItemCS from "../../ItemCS";
import MaterialRaw from "./MaterialRaw";
import MaterialRawM from "./MaterialRawM";

export default class Material<T = {}> extends Item<MaterialRawM<T>>{
	private _matid: string;
	public get Matid() { return this._matid; }

	protected Installation(raw: MaterialRawM<T>) {
		this._matid = raw.matid;

		this.OnInital(raw);
	}
	protected Export(): MaterialRawM<T> {
		return Object.assign(this.OnExport(), {
			matid: this._matid
		});
	}

	protected Structor(): ItemCS { return Material; }
	protected OnInital(arg: T) { }
	protected OnExport(): T { return <T>{}; }

	protected HashOpt() { return `${this._matid}`; }
}