import SchemaCustom from "../SchemaCustom";
import DataI from "./DataI";

export default interface ComponentI<Q extends any[] | [], S extends SchemaCustom> {
	Data: DataI<Q,S>;

	Raw(): any;
}