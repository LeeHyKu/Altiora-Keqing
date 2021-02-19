enum EnterpriseRank {
	Corporation = 'corp',
	QuasiCorp = 'qasi',
	Midsize = 'mids',
	Tight = 'tigt',
	Startup = 'strt'
}
namespace EnterpriseRank {
	export const Kr = {
		corp: '대기업',
		qasi: '준대기업',
		mids: '중견기업',
		tigt: '중소기업',
		strt: '스타트업'
	};
	export const CL = {
		strt: 0,
		tigt: 1,
		mids: 2,
		qasi: 3,
		corp: 4
	};
	export const CLR = [
		EnterpriseRank.Startup,
		EnterpriseRank.Tight,
		EnterpriseRank.Midsize,
		EnterpriseRank.QuasiCorp,
		EnterpriseRank.Corporation
	];
	export const Cost = {
		tigt: 3000000,
		mids: 6000000,
		qasi: 12000000,
		corp: 24000000
	};
}
export default EnterpriseRank;