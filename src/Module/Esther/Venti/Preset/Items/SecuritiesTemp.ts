import ItemI from "../../ItemI";
import MaterialRaw from "../../Items/Material/MaterialRaw";
import Rarity from "../../Rarity";

export default <ItemI<MaterialRaw>>{
	struct: 'Material',
	item: {
		name: '스카디 재무부채권(임시)',
		description: '스카디봇을 운영하는 루민社에서 발급한 채권\r\n본 채권은 문화상품권 1000원과 교환할 수 있습니다\r\n안내: 본 채권은 임시아이템입니다. 추후 관리자에게 문의하면 교환이 가능한 아이템으로 변경할 수 있습니다',
		rarity: Rarity.MYTH,
		matid: '채권'
	}
};