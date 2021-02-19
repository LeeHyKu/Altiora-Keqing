interface Stats {
	HP: number;
	AP: number;
	AGI: number;

	ATK: number;
	CRI: number;
	DEF: number;
	REG: number;

	HIT: number;

	FAT: number;
	PAN: number;
}
namespace Stats {
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
	export function Merge(pre: Stats, next: Stats) {
		var st = { HP: 0, AP: 0, AGI: 0, ATK: 0, CRI: 0, DEF: 0, REG: 0, HIT: 100, FAT: 0, PAN: 0 };
		for (var key of <Array<keyof Stats>>['HP', 'AP', 'AGI', 'ATK', 'CRI', 'DEF', 'REG', 'FAT', 'PAN']) st[key] = +((pre[key] || 0) + (next[key] || 0)).toFixed(3);
		st['HIT'] = Math.min(pre.HIT || 100, next.HIT || 100);
		return st;
	}
}
export default Stats;