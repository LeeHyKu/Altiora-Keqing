import ItemI from "../../../ItemI";
import EfniRaw from "../../../Items/Efni/EfniRaw";
import MaterialRawM from "../../../Items/Material/MaterialRawM";
import Rarity from "../../../Rarity";

export default <ItemI<MaterialRawM<EfniRaw>>>{
	struct: 'Efni',
	item: {
		name: '곰의 힘줄',
		level: 10,
		rarity: Rarity.MYTH,
		matid: 'btdon',
		stat: {
			DEF: 10,
			ATK: 100,
		},
		occupation: 'Aesir',
	}
}