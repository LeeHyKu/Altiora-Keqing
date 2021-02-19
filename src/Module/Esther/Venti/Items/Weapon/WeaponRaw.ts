import ForceType from "../../../../Odin/Battle/ForceType";
import ItemRaw from "../../ItemRaw";

export default interface WeaponRaw extends ItemRaw {
	force: ForceType;
}