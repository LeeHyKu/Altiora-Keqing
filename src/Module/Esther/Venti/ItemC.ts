import UserData from "../../../Core/Citius/User/UserData";
import Keqing from "../../../Core/Keqing";
import Item from "./Item";
import ItemRaw from "./ItemRaw";
import ItemRawM from "./ItemRawM";

export default interface ItemC<T extends ItemRaw, C extends Item<T>> { new(keqing: Keqing, user: UserData, raw: ItemRawM<T>): C; }