import Keqing from "../../Keqing";
import KeqingBase from "../../KeqingBase";
import SchemaCustom from "../SchemaCustom";
import DataI from "./DataI";
import DataTempI from "./DataTempI";

export default class DataTemp<Q extends any[] | [], S extends SchemaCustom, D extends DataI<Q, S>> extends KeqingBase implements DataTempI<Q, S> {
	protected get Data() { return this._data; }
	constructor(base: Keqing, private _data: D) { super(base); }
}