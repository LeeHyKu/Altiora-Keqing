import UserData from "../../../../Core/Citius/User/UserData";
import Keqing from "../../../../Core/Keqing";
import Item from "../Item";
import ItemCS from "../ItemCS";
import ItemRawM from "../ItemRawM";
import Rarity from "../Rarity";

export default class DamagedItem extends Item<any>{
	private content: any;
	public get Content() { return this.content; }

	constructor(keqing: Keqing, data: UserData, raw: ItemRawM<any>) {
		super(keqing, data, Object.assign({
			uid: '',
			name: '손상된 아이템',
			description: '손상되어 알 수 없는 아이템입니다',
			rarity: Rarity.NORMAL
		}, raw));
	}

	protected Installation(raw: any) { this.content = raw; }
	protected Export() { return this.content; }
	protected Structor(): ItemCS { return DamagedItem; }

	protected getTitle(): string { return `오류 아이템\r\n(${this.Uid})`; }
	protected getInfo(): string { return '데이터가 손상되어 알아볼 수 없는 아이템입니다. 관리자에게 문의 바랍니다.'; }

	protected HashOpt(): string { return JSON.stringify(this.content); }
}