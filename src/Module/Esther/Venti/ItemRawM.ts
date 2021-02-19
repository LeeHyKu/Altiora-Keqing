import ItemRaw from "./ItemRaw";
import ItemRawDefault from "./ItemRawDefault";

type ItemRawM<T extends ItemRaw> = T & ItemRawDefault;
export default ItemRawM;