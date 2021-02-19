import ItemI from "../../../ItemI";
import EnhancerRaw from "../../../Items/Enhancer/EnhancerRaw";
import Rarity from "../../../Rarity";

export default <ItemI<EnhancerRaw>>{
	struct: 'Enhancer',
	item: {
		uid: '',
		name: '테스트강화서',
		description: '테스트강화서설명',
		rarity: Rarity.LEGENDARY,
		ehid: '룬',
		surt: [
			100,
			100,
			100,
			100,
			100,
			50,
			50,
			50,
			50,
			50
		],
		scale: {
			HPbs: 0.1,
			CRIbs: 0.1,
			HITbs: 0.2,
		}
	}
};