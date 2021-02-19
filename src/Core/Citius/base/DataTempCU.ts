import Keqing from "../../Keqing";
import SchemaCustom from "../SchemaCustom";
import DataTempI from "./DataTempI";

export default interface DataTempCU<Q extends any[] | [], S extends SchemaCustom, T extends DataTempI<Q, S>> { new(base: Keqing, data: any, ...args: any[]): T; }