import { Chat } from "node-kakao";
import ChannelData from "../../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../../Core/Citius/User/UserData";
import Command from "../../../../Core/Fortius/Command/Command";
import Inventory from "../../Inventory/Inventory";

export default class InventoryCommand extends Command {
	readonly command = '인벤토리';
	readonly aliases = ['인벤', 'inven', 'inv'];

	async Prefix(chat: Chat, user: UserData, channel: ChannelData) {
		await user.GetComponent(Inventory).Karins.SendChat(chat);
	}
}