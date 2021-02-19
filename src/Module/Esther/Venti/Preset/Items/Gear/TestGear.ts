import ItemI from "../../../ItemI";
import GearRaw from "../../../Items/Gear/GearRaw";
import Rarity from "../../../Rarity";

export default <ItemI<GearRaw>>{
	struct: 'Gear',
	item: {
		name: '테스트장비',
		description: '테스트장비설명',
		rarity: Rarity.MYTH,
		level: 1,
		occupation: '직업',
		maxdurability: 10,
		ehid: '테스트강화서',
		bonus: {
			ATK: 10,
			CRI: 10,
			HIT: 10
		},
	}
};