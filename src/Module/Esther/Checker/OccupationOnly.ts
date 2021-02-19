import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Checkable from "../../../Core/Fortius/Command/Checkable";
import Checker from "../../../Core/Fortius/Command/Checker";
import Keqing from "../../../Core/Keqing";
import Esther from "../Esther/Esther";
import OccupationCS from "../Occupation/OccupationCS";

export default class OccupationOnly extends Checker {
	constructor(base: Keqing, private struct: OccupationCS) { super(base); }

	public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData, checkable: Checkable): boolean {
		return user.GetComponent(Esther).OccupationIs(this.struct);
    }
	public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData, checkable: Checkable) {
		await this.Karin.Reject(`지정된 직업만이 사용할 수 있는 전용 명령어입니다.\r\nOCID: ${this.struct.name}`, '특정직업전용').SendChat(chat);
    }
}