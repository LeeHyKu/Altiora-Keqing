import StatItem from "../../../Stats/StatItem";

interface EnhanceScale {
	HPbs?: number;
	APbs?: number;
	AGIbs?: number;

	ATKbs?: number;
	CRIbs?: number;
	DEFbs?: number;
	REGbs?: number;

	HITbs?: number;

	PANbs?: number;
}
namespace EnhanceScale {
	export function Merge(it: StatItem, en: EnhanceScale): StatItem {
		return {
			HP: (it.HP || 0) * (en.HPbs || 0),
			AP: (it.AP || 0) * (en.APbs || 0),
			AGI: (it.AGI || 0) * (en.APbs || 0),

			ATK: (it.ATK || 0) * (en.ATKbs || 0),
			CRI: (it.CRI || 0) * (en.CRIbs || 0),
			DEF: (it.DEF || 0) * (en.DEFbs || 0),
			REG: (it.REG || 0) * (en.REGbs || 0),

			HIT: (it.HIT || 0) * (en.HITbs || 0),

			FAT: 0,
			PAN: (it.PAN || 0) * (en.PANbs || 0),
		};
	}
}
export default EnhanceScale;