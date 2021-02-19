import ForceType from "../../../../../Odin/Battle/ForceType";
import ItemI from "../../../ItemI";
import WeaponRaw from "../../../Items/Weapon/WeaponRaw";
import Rarity from "../../../Rarity";

export default <ItemI<WeaponRaw>>{
	struct: 'Weapon',
	item: {
		name: '궁니르',
		description: '직업모듈 개발용 모의아이템',
		rarity: Rarity.MYTH,
		occupation: 'Aesir',
		ehid: '룬',
		force: ForceType.MAGIC_EFFECT
	}
}