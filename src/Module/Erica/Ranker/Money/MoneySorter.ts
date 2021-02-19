import { FilterQuery } from "mongodb";
import { SchemaMarge } from "../../../../Core/Citius/Types";
import UserData from "../../../../Core/Citius/User/UserData";
import UserSchema from "../../../../Core/Citius/User/UserSchema";
import UserSorter from "../../../../Core/Citius/User/UserSorter";
import Erica from "../../Component/Erica";

export default class MoneySorter extends UserSorter {
	protected BaseFilter(): FilterQuery<SchemaMarge<UserSchema>> { return { "component.Erica.money": { $gte: 0 } }; }
	protected LocalFilter(): (e: UserData) => boolean { return e => e.GetComponent(Erica).Money > 0; }
	protected Sort(): (pre: SchemaMarge<UserSchema>, next: SchemaMarge<UserSchema>) => number { return (pre, next) => next.component['Erica']['money'] - pre.component['Erica']['money']; }
}