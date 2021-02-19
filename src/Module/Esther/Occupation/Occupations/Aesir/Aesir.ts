import StatOccupation from "../../../Stats/StatOccupation";
import Occupation from "../../Occupation";
import AesirStat from "./AesirStat";

export default class Aesir extends Occupation<AesirStat>{
	protected name = 'Æsir';
	protected description = 'We are Legend; Ready on Action; The First, the Finest; Quad Clusters, None Faster';

	private infO: boolean;
	public get InfO() { return this.infO; }
	public set InfO(bool) { this.infO = bool; }

	protected UserStatString(): string { return `Infinity O : ${this.InfO ? '활성화' : '비활성화'}\r\n모든 스텟을 무한으로 만들어주고, 절대 지치지 않습니다`; }
	protected Create(): AesirStat {
		return { infO: true };
	}
	protected Installation(stats: AesirStat) {
		this.infO = stats.infO;
	}
	protected Export(): AesirStat {
		return {
			infO: this.infO
		}
	}
	public Default(): AesirStat { return { infO: true } }
	protected OnReduce(pre: AesirStat, next: AesirStat): AesirStat {
		return {
			infO: pre.infO && next.infO
		};
	}

	public Scale(): StatOccupation {
		return this.infO ? {
			HPc: Infinity,
			APc: Infinity,
			AGIc: Infinity,

			ATKc: Infinity,
			CRIc: Infinity,
			DEFc: Infinity,
			REGc: Infinity,

			HITc: Infinity,

			FATc: -Infinity,
			PANc: Infinity
		} : {};
	}
}