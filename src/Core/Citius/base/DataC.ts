import DataI from "./DataI";
import Keqing from "../../Keqing";
import TableI from "./TableI";
import { SchemaMarge } from "../Types";
import SchemaCustom from "../SchemaCustom";

export default interface DataC<Q extends any[] | [], S extends SchemaCustom, T extends DataI<Q, S>> { new(base: Keqing, _data: TableI<Q, S>, raw?: Q | SchemaMarge<S>): T; }