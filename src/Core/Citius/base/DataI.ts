import { ObjectId } from "mongodb";
import SchemaCustom from "../SchemaCustom";
import { SchemaMarge } from "../Types";
import ComponentC from "./ComponentC";
import ComponentI from "./ComponentI";
import DataTempC from "./DataTempC";
import DataTempI from "./DataTempI";
import TableI from "./TableI";

export default interface DataI<Q extends any[] | [], S extends SchemaCustom> {
	Table: TableI<Q, S>;
	Check(...query: Q): boolean;
	ID: ObjectId;
	ProcID: string;

	GetComponent<T extends ComponentI<Q, S>>(structor: ComponentC<Q, S, T>): T;

	SetCool(cool: string, milisec: number);
	CheckCool(cool: string): boolean;
	HasCool(): boolean;

	ToggleTag(tag: string): boolean;
	HasTag(tag: string): boolean;

	GetTemp<T extends DataTempI<Q, S>>(type: DataTempC<Q, S, T>): T;
	DelTemp<T extends DataTempI<Q, S>>(type: DataTempC<Q, S, T>): T;
	HasAnyTemp(): boolean;

	Use(at: string): boolean;
	Used(at: string): boolean;

	isSaving: boolean;
	IssueSave();
	IssueSaveComp();
	AttachSaveComp(action: (id: ObjectId) => any): boolean;

	CheckSave(): boolean;

	Raw(): SchemaMarge<S>;
}