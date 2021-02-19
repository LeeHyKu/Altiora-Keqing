import { Chat } from "node-kakao";
import ChannelData from "../../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../../Core/Citius/User/UserData";
import RequireMention from "../../../../Core/Fortius/Command/Checkers/RequireMention";
import Command from "../../../../Core/Fortius/Command/Command";
import Inventory from "../../Inventory/Inventory";

export default class InventoryHandoverCommand extends Command {
	readonly command = '양도';
	readonly checkers = [RequireMention];

	readonly preview = '아이템을 양도합니다.';
	readonly information = [
		{ arg: '<uid> <@유저맨션>', info: '아이템을 유저에게 양도합니다' }
	];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		var inventory = user.GetComponent(Inventory);
		var item = inventory.Focus(args[0]);
		if (!item) await this.Karin.Reject('알 수 없는 아이템입니다', '아이템 없음').SendChat(chat);
		else {
			var target = (await this.Citius.User.Find(chat.getMentionContentList()[0].UserId, chat.Channel));
			target.GetComponent(Inventory).AddItem(inventory.RemoveItem(item.Uid).Give(target));
			await this.Karin.Confirm(`아이템 ${item.Name}을 해당 유저에게 전달하였습니다.`, '전달완료').SendChat(chat);
		}
	}
}