import { Collection } from "mongodb";
import Keqing from "../../../Core/Keqing";
import KeqingBase from "../../../Core/KeqingBase";

export default class StockAvailable extends KeqingBase {
	private _collection: Collection<StockAvailableR>;
	private get Collection() { return this._collection; }
	constructor(keqing: Keqing) {
		super(keqing);
		this._collection = keqing.Citius.GetTable('DilucAvilable');
	}

	public async GetLimit(struct: string, name: string) { return (await this.Get(struct, name))?.available; }
	public async SetLimit(struct: string, name: string, limit: number) { this.Update({ struct: struct, name: name, available: limit }); }

	private async Get(struct: string, name: string) { return await this.Collection.findOne({ struct: struct, name: name }); }
	private async Update(r: StockAvailableR) { await this.Collection.updateOne({ struct: r.struct, name: r.name }, { $set: r }, { upsert: true }); }
}

interface StockAvailableR {
	struct: string;
	name: string;
	available: number;
}