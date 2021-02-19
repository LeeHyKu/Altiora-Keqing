interface StatItem {
	HP?: number;
	AP?: number;
	AGI?: number;

	ATK?: number;
	CRI?: number;
	DEF?: number;
	REG?: number;

	HIT?: number;

	FAT?: number;
	PAN?: number;
}
namespace StatItem {
	export const StatKr = {
		HP: '체력',
		AP: '행동력',
		AGI: '민첩',

		ATK: '공격력',
		CRI: '치명타',
		DEF: '방어력',
		REG: '마법저항',

		HIT: '명중률',

		FAT: '피로도',
		PAN: '관통력'
	};
	export function Merge(pre: StatItem, next: StatItem): StatItem {
		var r: StatItem = {};
		for (var key of <Array<keyof StatItem>>['HP', 'AP', 'AGI', 'ATK', 'DEF', 'CRI', 'DEF', 'REG', 'FAT', 'PAN']) r[key] = (pre[key] || 0) + (next[key] || 0);
		r['HIT'] = Math.min(pre.HIT || 100, next.HIT || 100);
		return r;
	}
}
export default StatItem;