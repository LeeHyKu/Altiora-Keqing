import UserData from "../../../Core/Citius/User/UserData";
import Keqing from "../../../Core/Keqing";
import Item from "./Item";
import ItemRawM from "./ItemRawM";

export default interface ItemCS { new(keqing: Keqing, user: UserData, raw: ItemRawM<any>): Item<any>; }