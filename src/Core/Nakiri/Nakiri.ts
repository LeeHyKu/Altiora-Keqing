import { Chat, ChatType, ChatUser, ReplyChat } from "node-kakao";
import Keqing from "../Keqing";
import KeqingBase from "../KeqingBase";
import NakiriResult from "./NakiriResult";
import NakiriStatus from "./NakiriStatus";

export default class Nakiri extends KeqingBase {
	constructor(keqing: Keqing, private timeout: number) { super(keqing); }

	public QKarin(description: string, title?: string, tail?: string) { return this.Karin.Feed('입력', tail).Text({ T: title || '입력', D: description }).TextFull(true); }
	public CKarin(description: string, standard: boolean = false, title?: string, tail?: string) { return this.QKarin(`${description} (${standard ? 'Y/n' : 'y/N'})`, title, tail); }

	public async Reply(user: ChatUser, timeout?: number): Promise<NakiriResult<ReplyChat>> {
		var chat = await this.GetChat(user, timeout);
		if (chat.status !== NakiriStatus.CONFIRM) return { status: chat.status };
		else if (chat.result.Type !== ChatType.Reply) return { status: NakiriStatus.INVAILD };
		else return { status: NakiriStatus.CONFIRM, result: chat.result as ReplyChat };
	}

	public async Confirm(user: ChatUser, standard: boolean = false, timeout?: number): Promise<NakiriResult<boolean>> {
		const STANDARD_CONFIRM = ['y', 'yes', '응', '예', 'ㅇ', 'ㅇㅇ', '좋아', 'ㅇㅋ'];
		const STANDARD_DENY = ['n', 'no', '아니', 'ㄴ', 'ㄴㄴ', '싫어'];
		var text = await this.Text(user, timeout);

		if (text.status !== NakiriStatus.CONFIRM) return { status: text.status, result: standard };
		else return {
			status: NakiriStatus.CONFIRM,
			result: standard ?
				!STANDARD_DENY.some(e => e.toLowerCase() === text.result.toLowerCase()) :
				STANDARD_CONFIRM.some(e => e.toLowerCase() === text.result.toLowerCase())
		};
	}
	public async Number(user: ChatUser, timeout?: number): Promise<NakiriResult<number>> {
		var text = await this.Text(user, timeout);
		if (text.status !== NakiriStatus.CONFIRM) return { status: text.status };
		else if (+text.result === NaN) return { status: NakiriStatus.INVAILD };
		else return { status: NakiriStatus.CONFIRM, result: +text.result };
	}
	public async Text(user: ChatUser, timeout?: number): Promise<NakiriResult<string>> {
		var chat = await this.GetChat(user, timeout);
		if (chat.status !== NakiriStatus.CONFIRM) return { status: chat.status };
		else if (![ChatType.Text, ChatType.Reply].some(e => chat.result.Type)) return { status: NakiriStatus.INVAILD };
		else return { status: NakiriStatus.CONFIRM, result: chat.result.Text };
	}

	public async GetChat(user: ChatUser, timeout?: number): Promise<NakiriResult<Chat>> {
		return new Promise<NakiriResult<Chat>>((s) => {
			user.once('message', chat => s({ status: NakiriStatus.CONFIRM, result: chat }));
			setTimeout(() => s({ status: NakiriStatus.TIMEOUT }), timeout || this.timeout);
		});
	}
}