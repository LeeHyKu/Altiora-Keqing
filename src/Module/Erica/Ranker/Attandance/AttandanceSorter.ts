import { FilterQuery } from "mongodb";
import { SchemaMarge } from "../../../../Core/Citius/Types";
import UserData from "../../../../Core/Citius/User/UserData";
import UserSchema from "../../../../Core/Citius/User/UserSchema";
import UserSorter from "../../../../Core/Citius/User/UserSorter";
import Erica from "../../Component/Erica";

export default class AttandanceSorter extends UserSorter {
	protected BaseFilter(): FilterQuery<SchemaMarge<UserSchema>> { return { "component.Erica.attandance": { $gte: this.Today() } }; }
	protected LocalFilter(): (e: UserData) => boolean { return (e: UserData) => e.GetComponent(Erica).Attandance.toDateString() === this.Today().toDateString(); }
	protected Sort(): (pre: SchemaMarge<UserSchema>, next: SchemaMarge<UserSchema>) => number { return (pre, next) => pre.component['Erica']['attandance'].getTime() - next.component['Erica']['attandance'].getTime(); }

	private Today() { return new Date(new Date().toDateString()); }
}