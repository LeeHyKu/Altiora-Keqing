import { Collection, ObjectId } from "mongodb";
import SchemaCustom from "../SchemaCustom";
import { SchemaMarge } from "../Types";
import DataC from "./DataC";
import DataI from "./DataI";

export default interface TableI<Q extends any[] | [], S extends SchemaCustom> {
	Collection: Collection<SchemaMarge<S>>;
	Structor: DataC<Q, S, any>;
	Cache: DataI<Q, S>[];

	Find(...query: Q): Promise<DataI<Q, S>>;
	FindByID(id: ObjectId): Promise<DataI<Q, S> | null>;
	Save(procid: string): Promise<void>;
	ForceSaveAll();
}