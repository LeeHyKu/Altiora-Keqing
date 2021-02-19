import ItemI from "../../../ItemI";
import EfniRaw from "../../../Items/Efni/EfniRaw";
import MaterialRawM from "../../../Items/Material/MaterialRawM";
import Rarity from "../../../Rarity";

export default <ItemI<MaterialRawM<EfniRaw>>>{
	struct: 'Efni',
	item: {
		name: '생선의 숨결',
		level: 10,
		rarity: Rarity.MYTH,
		matid: 'fibr',
		stat: {
			CRI: 12,
			HP: 123,
			AP: 1,
		},
		occupation: 'Aesir',
	}
}