import ItemRaw from "./ItemRaw";
import ItemRawM from "./ItemRawM";

export default interface ItemI<T extends ItemRaw> {
	struct: string;
	item: ItemRawM<T>;
}