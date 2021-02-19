enum KaguraTier {
	Iron = 'iro', //0회
	Bronze = 'bro', //97.67%
	Silver = 'sil', //81.94%
	Gold = 'gol', //47.93%
	Platinum = 'pla', //16.1%
	Diamond = 'dia', //2.87%
	Master = 'mas', //0.5%
	Challenger = 'cha' //0.06%
}
namespace KaguraTier {
	const TierIndex = {
		iro: 0,
		bro: 0.0233,
		sil: 0.1806,
		gol: 0.5207,
		pla: 0.839,
		dia: 0.9713,
		mas: 0.995,
		cha: 0.9994
	}
	export function getTierIndex(max: number) {
		return {
			cha: max * TierIndex.cha,
			mas: max * TierIndex.mas,
			dia: max * TierIndex.dia,
			pla: max * TierIndex.pla,
			gol: max * TierIndex.gol,
			sil: max * TierIndex.sil,
			bro: max * TierIndex.bro,
			iro: 0,
		}
	}
}
export default KaguraTier;