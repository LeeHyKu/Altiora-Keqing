import Keqing from "../../Keqing";
import ComponentI from "./ComponentI";
import KeqingBase from "../../KeqingBase";
import TableI from "./TableI";
import Table from "./Table";
import Data from "./Data";
import SchemaCustom from "../SchemaCustom";
import ComponentRaw from "../ComponentRaw";

export default abstract class Component<R extends ComponentRaw, Q extends any[] | [], S extends SchemaCustom, D extends Data<Q, S, T>, T extends TableI<Q, S> = Table<Q, S, D>> extends KeqingBase implements ComponentI<Q, S> {
	public get Data() { return this._data; }

	constructor(base: Keqing, private _data: D, raw?: R) {
		super(base);
		if (!raw) raw = this.Initialization();
		this.Installation(raw);
	}

	protected abstract Initialization(): R;
	protected abstract Installation(raw: R);
	public abstract Raw(): R;
}