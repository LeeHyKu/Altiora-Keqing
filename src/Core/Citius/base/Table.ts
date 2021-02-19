import { Collection, Condition, FilterQuery, ObjectId } from "mongodb";
import Keqing from "../../Keqing";
import KeqingBase from "../../KeqingBase";
import SchemaCustom from "../SchemaCustom";
import { SchemaMarge } from "../Types";
import DataC from "./DataC";
import DataI from "./DataI";
import TableI from "./TableI";

export default abstract class Table<Q extends any[] | [], S extends SchemaCustom, D extends DataI<Q, S>> extends KeqingBase implements TableI<Q, S> {
	public get Collection(): Collection<SchemaMarge<S>> { return this._collection; }
	public get Structor() { return this._structor; }

	constructor(base: Keqing, private _collection: Collection<SchemaMarge<S>>, private _structor: DataC<Q, S, D>) { super(base); }

	private cache: Array<D> = [];
	public get Cache() { return this.cache; }
	public async Find(...queries: Q): Promise<D> {
		var query = await this.DoQuery(e => e.Check(...queries), this.Query(...queries));
		if (query) return query;
		else return this.AddCache(queries);
	}
	public async FindByID(id: ObjectId): Promise<D | null> { return await this.DoQuery(e => e.ID.toHexString() === id.toHexString(), <any>{ _id: id }); } //unknown typescript error
	private async DoQuery(onCache: (element: D) => boolean, onDatabase: FilterQuery<SchemaMarge<S>>): Promise<D | null> {
		var cacheIndex = this.cache.findIndex(onCache);
		if (cacheIndex != -1) {
			if (this.cache[cacheIndex].isSaving) return new Promise<D>((s) => { this.cache[cacheIndex].AttachSaveComp(async (id) => s(await this.FindByID(id))); });
			else return this.cache[cacheIndex];
		}
		else {
			var frombase = await this.Collection.findOne(onDatabase);
			if (frombase) return this.AddCache(frombase);
			else return null;
		}
	}
	private AddCache(arg: Q | SchemaMarge<S>) { var struct = new this.Structor(this.Keqing, this, arg); this.cache.push(struct); return struct; }

	protected abstract Query(...query: Q): FilterQuery<SchemaMarge<S>>;
	public CheckAll() { this.cache.forEach(e => e.CheckSave()); }
	public async Save(procid: string) {
		var cache = this.cache.find(e => e.ProcID === procid);
		if (!cache) return;
		else {
			try {
				cache.IssueSave();
				await this.Collection.replaceOne(<any>{ _id: cache.ID }, cache.Raw(), { upsert: true }); //unknown typescript error
			}
			catch (e) {
				this.Qurare.Error(e);
			}
			finally {
				var index = this.cache.findIndex(e => e.ProcID === procid);
				if (index !== -1) {
					this.cache.splice(index, 1);
					cache.IssueSaveComp();
				}
			}
		}
	}
	public ForceSaveAll() { this.cache.forEach(e => this.Save(e.ProcID)); }
}