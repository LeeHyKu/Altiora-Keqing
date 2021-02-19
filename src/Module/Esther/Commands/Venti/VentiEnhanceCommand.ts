import { Chat } from "node-kakao";
import ChannelData from "../../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../../Core/Citius/User/UserData";
import Command from "../../../../Core/Fortius/Command/Command";
import Inventory from "../../Inventory/Inventory";
import Enhancer from "../../Venti/Items/Enhancer/Enhancer";
import EnhanceStatus from "../../Venti/Items/Enhancer/EnhanceStatus";
import Gear from "../../Venti/Items/Gear/Gear";

export default class VentiEnhanceCommand extends Command {
	readonly command = '강화';

	readonly preview = '아이템을 강화합니다';
	readonly information = [
		{ arg: '<강화할 아이템 uid> <강화서 uid>', info: '아이템을 강화합니다.' }
	];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		if (args.length < 2) await this.Karin.Reject('강화할 아이템, 강화서의 uid를 지정해주세요', '타게팅 필요').SendChat(chat);
		else {
			var inventory = user.GetComponent(Inventory);
			var target = inventory.Focus(args[0], Gear);

			if (!target) await this.Karin.Reject('알 수 없는 장비입니다', '장비 없음').SendChat(chat);
			else if (!inventory.Focus(args[1], Enhancer)) await this.Karin.Reject('알 수 없는 강화서입니다', '강화서 없음').SendChat(chat);
			else {
				var enhancer = inventory.RemoveItem(args[1], Enhancer);
				switch (target.TryEnhance(enhancer)) {
					case EnhanceStatus.ALREADY_MAX:
						inventory.AddItem(enhancer);
						await this.Karin.Reject('이미 강화 10단을 달성하여 더이상 강화할 수 없습니다', '최대 강화수').SendChat(chat);
						break;
					case EnhanceStatus.INVAILD_Enhance:
						inventory.AddItem(enhancer);
						await this.Karin.Reject('이 강화서로 본 장비를 강화할 수 없습니다', '올바르지 않은 강화서').SendChat(chat);
						break;
					case EnhanceStatus.CANT_Enhance:
						inventory.AddItem(enhancer);
						await this.Karin.Reject('강화할 수 없는 아이템입니다', '강화할 수 없는 아이템').SendChat(chat);
						break;
					case EnhanceStatus.DUR:
						inventory.AddItem(enhancer);
						await this.Karin.Reject('강화내구도가 0이여서 강화할 수 없습니다', '강화내구도 없음').SendChat(chat);
						break;
					case EnhanceStatus.SUCCESS:
						await this.Karin.Confirm(`강화에 성공했습니다\r\n(${target.Enhance - 1}단 -> ${target.Enhance}단)`, '강화성공').SendChat(chat);
						break;
					case EnhanceStatus.FAILUER:
						await this.Karin.Confirm('강화에 실패했습니다', '강화실패').SendChat(chat);
						break;
					case EnhanceStatus.FAILUER_DESTROYED:
						await this.Karin.Confirm('강화에 실패하여 아이템이 파괴되었습니다', '강화실패파괴').SendChat(chat);
						break;
					default:
						await this.Karin.Reject('알 수 없는 상태입니다', '알 수 없는 상태').SendChat(chat);
						break;
				}
			}
		}
	}
}