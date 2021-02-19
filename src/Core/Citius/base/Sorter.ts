import { FilterQuery } from "mongodb";
import SchemaCustom from "../SchemaCustom";
import { SchemaMarge } from "../Types";
import Data from "./Data";
import Table from "./Table";
import TableI from "./TableI";

export default abstract class Sorter<Q extends any[] | [], S extends SchemaCustom, D extends Data<Q, S, T>, T extends TableI<Q, S> = Table<Q, S, D>>{
	protected get Table() { return this._table; }
	constructor(private _table: T) { }

	protected abstract BaseFilter(): FilterQuery<SchemaMarge<S>>;
	protected abstract LocalFilter(): (e: D) => boolean;
	protected abstract Sort(): (pre: SchemaMarge<S>, next: SchemaMarge<S>) => number;

	public async Run(): Promise<SchemaMarge<S>[]> {
		var dbs = await this.Table.Collection.find(this.BaseFilter()).toArray();
		var loc = this.Table.Cache.filter(this.LocalFilter());

		var marge: SchemaMarge<S>[] = [];
		for (var db of dbs) {
			var si = loc.findIndex(e => e.ID.toHexString() === db._id.toHexString());
			if (si !== -1) marge.push(loc.splice(si, 1)[0].Raw());
			else marge.push(db);
		}
		marge.push(...loc.map(e => e.Raw()));
		return marge.sort(this.Sort());
	}
}