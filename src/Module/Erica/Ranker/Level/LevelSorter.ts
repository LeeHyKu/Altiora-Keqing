import { FilterQuery } from "mongodb";
import { SchemaMarge } from "../../../../Core/Citius/Types";
import UserData from "../../../../Core/Citius/User/UserData";
import UserSchema from "../../../../Core/Citius/User/UserSchema";
import UserSorter from "../../../../Core/Citius/User/UserSorter";
import Erica from "../../Component/Erica";

export default class LevelSorter extends UserSorter {
	protected BaseFilter(): FilterQuery<SchemaMarge<UserSchema>> { return { "component.Erica.exp": { $gt: 0 } }; }
	protected LocalFilter(): (e: UserData) => boolean { return e => !!e.GetComponent(Erica).Exp; }
	protected Sort(): (pre: SchemaMarge<UserSchema>, next: SchemaMarge<UserSchema>) => number { return (pre, next) => next.component['Erica']['exp'] - pre.component['Erica']['exp']; }
}