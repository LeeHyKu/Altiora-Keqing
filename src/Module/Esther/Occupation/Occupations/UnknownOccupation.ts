import StatOccupation from "../../Stats/StatOccupation";
import Occupation from "../Occupation";

export default class UnknownOccupation extends Occupation<any> {
	readonly name = '손상됨:직업';
	readonly description = '손상된 직업데이터입니다.\r\n자동복구될 수 있습니다.';

	private _status: any;
	public get Status() { return this._status; }
	protected UserStatString(): string { return '오류:알 수 없는 스텟'; }

	protected Create() { return {}; }
	protected Installation(stats: any) { this._status = stats; }
	protected Export() { return {}; }
	public Raw() { return this.Status; }

	public Default() { return {}; }

	protected OnReduce(pre: any, next: any) { return {}; }

	public Scale(): StatOccupation { return {}; }
}