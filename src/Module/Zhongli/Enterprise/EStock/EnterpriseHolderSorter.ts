import { FilterQuery } from "mongodb";
import { SchemaMarge } from "../../../../Core/Citius/Types";
import UserData from "../../../../Core/Citius/User/UserData";
import UserSchema from "../../../../Core/Citius/User/UserSchema";
import UserSorter from "../../../../Core/Citius/User/UserSorter";
import UserTable from "../../../../Core/Citius/User/UserTable";
import DilucUser from "../../../Dilruc/Component/DilucUser";

export default class EnterpriseHolderSorter extends UserSorter {
	constructor(table: UserTable, private _id: string) { super(table); }
	public get Id() { return this._id; }

	protected BaseFilter(): FilterQuery<SchemaMarge<UserSchema>> { return { "component.DilucUser.assets": { $elemMatch: { struct: 'EnterpriseAsset', id: this.Id, amount: { $gt: 0 } } } }; }
	protected LocalFilter(): (e: UserData) => boolean { return e => e.GetComponent(DilucUser).Has(this.Id, 'EnterpriseAsset'); }
	protected Sort(): (pre: SchemaMarge<UserSchema>, next: SchemaMarge<UserSchema>) => number {
		var filt = e => e.struct === 'EnterpriseAsset' && e.id === this.Id;
		var mapper = e => e.amount;
		var reducer = (p, n) => p + n;
		return (pre, next) => (
			next.component['DilucUser']['assets'].filter(filt).map(mapper).reduce(reducer) -
			pre.component['DilucUser']['assets'].filter(filt).map(mapper).reduce(reducer)
		);
	}
}