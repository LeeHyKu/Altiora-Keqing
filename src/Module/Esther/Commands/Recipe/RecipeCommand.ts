import { Chat } from "node-kakao";
import ChannelData from "../../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../../Core/Citius/User/UserData";
import Command from "../../../../Core/Fortius/Command/Command";
import Inventory from "../../Inventory/Inventory";
import RecipeStatus from "../../Venti/Uppskrift/Recipe/RecipeStatus";

export default class RecipeCommand extends Command {
	readonly command = '레시피';

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '목록':
				await user.GetComponent(Inventory).RecipeKarin.SendChat(chat);
				break;
			case '재료':
				await user.GetComponent(Inventory).GetRecipe(args[1])?.Recipes?.()?.SendChat?.(chat);
				break;
			case '제작':
				var res = user.GetComponent(Inventory).UseRecipe(args[1]);
				if (!res) await this.Karin.Reject('레시피가 없습니다', '알 수 없는 레시피').SendChat(chat);
				else if (res.status !== RecipeStatus.Confirm) await this.Karin.Reject('조합에 실패했습니다', '조합실패').SendChat(chat);
				else if (res.result) await res.result.Feed().SendChat(chat);
				break;
		}
	}
}