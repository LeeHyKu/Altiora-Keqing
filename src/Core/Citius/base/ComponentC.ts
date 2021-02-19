import Keqing from "../../Keqing";
import SchemaCustom from "../SchemaCustom";
import ComponentI from "./ComponentI";
import DataI from "./DataI";

export default interface ComponentC<Q extends any[] | [], S extends SchemaCustom, T extends ComponentI<Q, S>> { new(base: Keqing, up: DataI<Q, S>, raw?: any): T; }