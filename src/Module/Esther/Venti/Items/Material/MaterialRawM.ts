import ItemRaw from "../../ItemRaw";
import MaterialRaw from "./MaterialRaw";

type MaterialRawM<T extends ItemRaw> = T & MaterialRaw;
export default MaterialRawM;