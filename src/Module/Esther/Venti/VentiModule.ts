import KeqingAttachment from "../../../Core/KeqingAttachment";
import ItemModule from "./Items/ItemModule";
import Venti from "./Venti";

export default <KeqingAttachment>{
	afterIgnition: async keqing => {
		keqing.Citius.GetSingleton(Venti).Attach(...ItemModule);
	}
}