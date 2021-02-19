import { ObjectId } from "mongodb";
import FeedBuilder from "../../../../../Core/Karin/Contents/Feed/FeedBuilder";
import Item from "../../Item";
import ItemCS from "../../ItemCS";
import ContractRaw from "./ContractRaw";

export default class Contract extends Item<ContractRaw>{
	private _content: string;
	private _contractor: ObjectId;
	private _assignee?: ObjectId;
	public get Content() { return this._content; }
	public get Contractor() { return this._contractor; }
	public get Assignee() { return this._assignee; }

	protected Installation(raw: ContractRaw) {
		this._content = raw.content;
		this._contractor = raw.contractor;
		if (raw.assignee) this._assignee = raw.assignee;
	}
	protected Export(): ContractRaw {
		return {
			content: this.Content,
			contractor: this.Contractor,
			assignee: this.Assignee
		};
	}
	protected Structor(): ItemCS { return Contract; }
	protected getName(): string { return `${this.Name} (유저생성)` }
	protected getInfo(): string { return '표준계약서\r\n※경고: 효력은 보장되지 않음'; }

	public Activate(assignee: ObjectId) {
		if (this._assignee) return false;
		else { this._assignee = assignee; return true; }
	}
	public async Info(): Promise<FeedBuilder> {
		if (!this.Assignee) return this.Karin.Feed('추가정보').TextFull(true).Text({
			T: `${this.Name}(미계약)`,
			D: `${this.Content}\r\n※경고:본 내용은 유저가 입력한 내용이며, 법적인 효력이 없고, 내용을 이행해야하는 의무는 보장되지 않습니다.\r\n다만, 내용 위반시 피해자는 관리자에게 해당 유저의 채팅봇 사용제재를 요청할 수 있습니다.`
		});
		else {
			var c = await (await this.Citius.User.FindByID(this.Contractor)).GetUserInfo();
			var a = await (await this.Citius.User.FindByID(this.Assignee)).GetUserInfo();
			return this.Karin.Feed('추가정보').TextFull(true).Text({
				T: `${this.Name}(활성화)`,
				D: `계약자:${c.Nickname}\r\n피계약자:${a.Nickname}\r\n${this.Content}\r\n※경고:본 내용은 유저가 입력한 내용이며, 법적인 효력이 없고, 내용을 이행해야하는 의무는 보장되지 않습니다.\r\n다만, 내용 위반시 피해자는 관리자에게 해당 유저의 채팅봇 사용제재를 요청할 수 있습니다.`
			});
		}
	}

	protected HashOpt(): string { return `${this._content}:${this._contractor.toHexString()}:${this._assignee?.toHexString()}`; }
}