import UserData from "../../../Core/Citius/User/UserData";
import KeqingBase from "../../../Core/KeqingBase";
import Item from "./Item";
import ItemC from "./ItemC";
import ItemCS from "./ItemCS";
import ItemIS from "./ItemIS";
import ItemRaw from "./ItemRaw";
import ItemRawM from "./ItemRawM";
import DamagedItem from "./Items/DamagedItem";

export default class Venti extends KeqingBase {
	private structs: ItemCS[] = [];
	public Attach(...structs: ItemCS[]) { this.structs.push(...structs); }
	public Create<R extends ItemRaw, T extends Item<R>>(struct: ItemC<R, T>, user: UserData, raw: ItemRawM<R>) {
		var stru = this.structs.find(e => e.name === struct.name);
		if (!stru) { stru = struct; this.structs.push(stru); }
		return <T>(new stru(this.Keqing, user, raw));
	}
	public CreateByName(user: UserData, raw: ItemIS) {
		try {
			var stru = this.structs.find(e => e.name === raw.struct);
			if (!stru) return new DamagedItem(this.Keqing, user, raw.item);
			else return new stru(this.Keqing, user, raw.item);
		}
		catch (e) {
			this.Qurare.Error(e);
			return new DamagedItem(this.Keqing, user, raw.item);
		}
	}
}