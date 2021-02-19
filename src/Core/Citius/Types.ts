import { ObjectId } from "mongodb";
import SchemaDefault from "./Schema";
import SchemaCustom from "./SchemaCustom";

export type Bsonable = null | Date | string | number | boolean | ObjectId | { [name: string]: Bsonable };
export type BsonableA = Bsonable | Bsonable[] | { [name: string]: Bsonable | Bsonable[] };
export type SchemaMarge<T extends SchemaCustom> = SchemaDefault & T;