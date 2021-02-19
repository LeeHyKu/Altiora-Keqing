import Stats from "./Stats";

interface StatOccupation {
	HPc?: number;
	APc?: number;
	AGIc?: number;

	ATKc?: number;
	CRIc?: number;
	DEFc?: number;
	REGc?: number;

	HITc?: number;

	FATc?: number;
	PANc?: number;
}
namespace StatOccupation {
	export function Excute(stat: Stats, occ: StatOccupation): Stats {
		var st: Stats = { HP: 0, AP: 0, AGI: 0, ATK: 0, CRI: 0, DEF: 0, REG: 0, HIT: 100, FAT: 0, PAN: 0 };
		for (var key in stat) { st[key] = stat[key] * (occ[`${key}c`] || 1); }
		return st;
	}
}
export default StatOccupation;