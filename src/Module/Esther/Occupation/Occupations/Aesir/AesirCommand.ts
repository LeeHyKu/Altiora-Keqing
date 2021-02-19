import { Chat } from "node-kakao";
import ChannelData from "../../../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../../../Core/Citius/User/UserData";
import Command from "../../../../../Core/Fortius/Command/Command";
import OccupationOnly from "../../../Checker/OccupationOnly";
import Esther from "../../../Esther/Esther";
import Aesir from "./Aesir";

export default class AesirCommand extends Command {
	readonly command = '애실';
	readonly checkers = [new OccupationOnly(this.Keqing, Aesir)];

	readonly preview = '애실 전용 명령어';
	readonly information = [
		{ arg: '인피', info: '인피를 활성화/비활성화 합니다' },
	];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '인피': {
				let occ = user.GetComponent(Esther).OccupationT(Aesir);
				occ.InfO = !occ.InfO;
				await this.Karin.Confirm(`인피를 ${occ.InfO ? '사용합니다' : '사용하지 않습니다'}`, `인피 ${occ.InfO ? '활성화' : '비활성화'}`).SendChat(chat);
			}
				break;
		}
	}
}