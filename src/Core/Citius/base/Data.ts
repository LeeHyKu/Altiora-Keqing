import { ObjectId } from "mongodb";
import Keqing from "../../Keqing";
import KeqingBase from "../../KeqingBase";
import SchemaDefault from "../Schema";
import SchemaCustom from "../SchemaCustom";
import { SchemaMarge } from "../Types";
import ComponentC from "./ComponentC";
import ComponentI from "./ComponentI";
import DataI from "./DataI";
import DataTempC from "./DataTempC";
import DataTempCU from "./DataTempCU";
import DataTempI from "./DataTempI";
import TableI from "./TableI";

export default abstract class Data<Q extends any[] | [], S extends SchemaCustom, T extends TableI<Q, S>> extends KeqingBase implements DataI<Q, S> {
	public get Table(): T { return this._table; }
	public abstract Check(...query: Q): boolean;

	private _id: ObjectId;
	public get ID() { return this._id; }

	private _procId: string = this.GenerateUid(5);
	public get ProcID() { return this._procId; }
	private GenerateUid(length: number) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	private ctRaw: SchemaDefault['component'];
	private ctInitalized: { [name: string]: ComponentI<Q, S> } = {};
	public GetComponent<T extends ComponentI<Q, S>>(structor: ComponentC<Q,S,T>): T {
		if (this.ctInitalized[structor.name]) return <T>(this.ctInitalized[structor.name]);
		else if (this.ctRaw[structor.name]) return <T>(this.ctInitalized[structor.name] = new structor(this.Keqing, this, this.ctRaw[structor.name]));
		else return <T>(this.ctInitalized[structor.name] = new structor(this.Keqing, this));
	}
	protected GetComponentRaws() {
		var ctin = {};
		for (var key in this.ctInitalized) ctin[key] = this.ctInitalized[key].Raw();
		return Object.assign(this.ctRaw, ctin); //TODO: unsafe, MUST TEST
	}

	private cools: Map<string, Date> = new Map();
	public SetCool(cool: string, milisec: number) { this.cools.set(cool.toLowerCase(), new Date(Date.now() + milisec)); }
	public CheckCool(cool: string) { return !this.cools.has(cool.toLowerCase()) || Date.now() >= this.cools.get(cool.toLowerCase()).getTime(); }
	public HasCool() { return Array.from(this.cools.keys()).some(e => !this.CheckCool(e)); }

	private tags: string[];
	protected get Tags() { return this.tags; }
	public ToggleTag(tag: string) { var index = this.tags.findIndex(e => e.toLowerCase() === tag.toLowerCase()); if (index !== -1) { this.tags.splice(index, 1); return false; } else { this.tags.push(tag); return true; } }
	public HasTag(tag: string) { return this.tags.some(e => e.toLowerCase() === tag.toLowerCase()); }

	private temps: DataTempI<Q, S>[] = [];
	public GetTemp<T extends DataTempI<Q, S>>(type: DataTempC<Q, S, T>) { var temp = this.temps.find(e => e instanceof type) as T; if (!temp) { var c = new type(this.Keqing, this); this.temps.push(c); return c; } else return temp; }
	public DelTemp<T extends DataTempI<Q, S>>(type: DataTempC<Q, S, T>) { var i = this.temps.findIndex(e => e instanceof type); if (i !== -1) return this.temps.splice(i, 1)[0] as T; else return null; }
	public HasTemp<T extends DataTempI<Q, S>>(type: DataTempC<Q, S, T>) { return this.temps.some(e => e instanceof type); }
	public HasAnyTemp() { return this.temps.length > 0; }

	private tempunsafe: DataTempI<Q, S>[] = [];
	public GetTempU<T extends DataTempI<Q, S>>(type: DataTempCU<Q, S, T>) { return this.tempunsafe.find(e => e instanceof type) as T; }
	public HasTempU<T extends DataTempI<Q, S>>(type: DataTempCU<Q, S, T>) { return this.tempunsafe.some(e => e instanceof type); }
	public AttachTempU(temp: DataTempI<Q, S>): boolean { if (this.HasTempU(<any>temp.constructor)) return false; else { this.tempunsafe.push(temp); return true; } }
	public DelTempU<T extends DataTempI<Q, S>>(type: DataTempCU<Q, S, T>) { var i = this.tempunsafe.findIndex(e => e instanceof type); if (i !== -1) return this.tempunsafe.splice(i, 1)[0] as T; else return null; }
	public HasAnyTempU() { return this.tempunsafe.length > 0; }

	private using: string[] = [];
	public Use(at: string) {
		if (this.using.includes(at)) return false;
		else { this.using.push(at); return true; }
	}
	public Used(at: string) {
		if (this.using.includes(at)) {
			this.using.splice(this.using.indexOf(at), 1);
			this.CheckSave();
			return true;
		}
		else return false;
	}

	private _attachment: Array<(id: ObjectId) => any> = [];
	private _saving = false;
	public get isSaving() { return this._saving; }
	public IssueSave() { this._saving = true; }
	public IssueSaveComp() { this._attachment.forEach(e => e(this.ID)); }
	public AttachSaveComp(action: (id: ObjectId) => any) { if (this.isSaving) { this._attachment.push(action); return true; } else return false; }

	public CheckSave() {
		if (this.using.length < 1 && !this.HasCool() && !this.HasAnyTemp() && !this.HasAnyTempU()) {
			this.Table.Save(this.ProcID);
			return true;
		} else return false;
	}

	constructor(base: Keqing, private _table: T, raw: Q | SchemaMarge<S>) {
		super(base);

		if (Array.isArray(raw)) {
			this._id = new ObjectId();
			this.tags = [];
			this.ctRaw = {};
			this.Installation(this.Initialization(...<Q>raw));
		}
		else {
			this._id = (<SchemaMarge<S>>raw)._id;
			this.tags = (<SchemaMarge<S>>raw).tags;
			this.ctRaw = (<SchemaMarge<S>>raw).component;
			this.Installation(<SchemaMarge<S>>raw);
		}
	}

	protected abstract Initialization(...query: Q): S;
	protected abstract Installation(raw: S);
	protected abstract ToRaw(): S;
	public Raw(): SchemaMarge<S> {
		return Object.assign(this.ToRaw(), {
			_id: this._id,
			tags: this.tags,
			component: this.GetComponentRaws()
		});
	}
}