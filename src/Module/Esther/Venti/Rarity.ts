enum Rarity {
	NORMAL = 'nml',
	RARE = 'rar',
	UNIQUE = 'uni',
	EPIC = 'epc',
	LEGENDARY = 'ldr',
	MYTH = 'mth'
}
namespace Rarity {
	export const rarityKo = {
		nml: '일반',
		rar: '희귀',
		uni: '유니크',
		epc: '에픽',
		ldr: '전설',
		mth: '신화'
	};
	export const rarityIndex = {
		nml: 0,
		rar: 1,
		uni: 2,
		epc: 3,
		ldr: 4,
		mth: 5
	}
	export const rarityIndexR = [
		'nml',
		'rar',
		'uni',
		'epc',
		'ldr',
		'mth'
	]
}

export default Rarity;