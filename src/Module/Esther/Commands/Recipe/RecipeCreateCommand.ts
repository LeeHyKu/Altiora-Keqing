import { Chat } from "node-kakao";
import ChannelData from "../../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../../Core/Citius/User/UserData";
import Command from "../../../../Core/Fortius/Command/Command";
import Erica from "../../../Erica/Component/Erica";
import Inventory from "../../Inventory/Inventory";
import Efni from "../../Venti/Items/Efni/Efni";
import RecipeBuilder from "../../Venti/Uppskrift/Recipe/RecipeBuilder";

export default class RecipeCreateCommand extends Command {
	readonly command = '설계';

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		try {
			switch (args[0]) {
				case '이름':
					user.GetTemp(RecipeBuilder).Name(args.slice(1, args.length).join(' '));
					await this.Karin.Confirm('이름을 설정하였습니다', '이름설정완료').SendChat(chat);
					break;
				case '설명':
					user.GetTemp(RecipeBuilder).Desc(args.slice(1, args.length).join(' '));
					await this.Karin.Confirm('설명을 설정하였습니다', '설명설정완료').SendChat(chat);
					break;
				case '내구도':
					var dur = +args[1];
					if (!dur) await this.Karin.Reject('숫자를 입력해주세요', '숫자입력필요').SendChat(chat);
					else {
						user.GetTemp(RecipeBuilder).Duration(dur);
						await this.Karin.Confirm('내구도를 설정하였습니다', '내구도설정완료').SendChat(chat);
					}
					break;
				case '아이템종류':
					//if (!args[1]) 
					user.GetTemp(RecipeBuilder).ItemType(args.slice(1, args.length).join(' '));
					await this.Karin.Confirm('아이템 종류를 설정하였습니다', '종류설정완료').SendChat(chat);
					break;
				case '레시피':
					var item = user.GetComponent(Inventory).FocusMatid(args[1], Efni);
					if (!item) await this.Karin.Reject('재료를 찾을 수 없습니다', '재료 찾을 수 없음');
					else {
						user.GetTemp(RecipeBuilder).Recipe(item);
						await this.Karin.Confirm('재료를 추가하였습니다', '재료추가완료').SendChat(chat);
					}
					break;
				case '완성':
					var reci = user.GetTemp(RecipeBuilder).Go();
					var cost = reci.PatentCost;
					if (user.GetComponent(Erica).Money < cost) await this.Karin.Reject(`돈이 부족합니다(비용:${cost}원)`, '돈부족')
					else {
						await this.Nakiri.CKarin(`본 레시피를 출원하기 위해 ${cost}원이 필요합니다. 계속하시겠습니까?`, false, '비용확인').SendChat(chat);
						var confirm = !!(await this.Nakiri.Confirm(chat.Sender, false, 10000)).result;
						if (!confirm) await this.Karin.Reject('취소하였습니다', '취소').SendChat(chat);
						else {
							user.GetComponent(Inventory).AddRecipe(reci);
							user.GetComponent(Erica).Money -= cost;
							await this.Karin.Confirm(`레시피 ${reci.Name}을 출원하였습니다.`, '레시피 출원완료').SendChat(chat);
						}
					}
					break;
				case '상태':
					if (user.HasTemp(RecipeBuilder)) await user.GetTemp(RecipeBuilder).Status().SendChat(chat);
					break;
			}
		}
		catch (e) {
			await this.Karin.Error(e).SendChat(chat);
		}
	}
}