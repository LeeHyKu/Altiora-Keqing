import StatOccupation from "../../Stats/StatOccupation";
import Occupation from "../Occupation";

export default class Adventurer extends Occupation<{}>{
	protected name = '모험가';
	protected description = '직업을 정하지 않고 자유롭게 세상을 누비는 모험가입니다';

	protected UserStatString(): string { return '헤르메스의 가호: 체력을 10% 추가해주고, 쉽게 지치지 않습니다.'; }
	protected Create(): {} { return {}; }
	protected Installation(stats: {}) { }
	protected Export(): {} { return {}; }
	public Default(): {} { return {}; }
	protected OnReduce(pre: {}, next: {}): {} { return {}; }

	public Scale(): StatOccupation {
		return {
			HPc: 1.1,
			ATKc: 0.9,
			FATc: 0.8
		}
	}
}