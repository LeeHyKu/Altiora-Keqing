import { Chat, ChatMention } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import Erica from "../../Erica/Component/Erica";
import Inventory from "../../Esther/Inventory/Inventory";
import Zhongli from "../Zhongli";

export default class EnterpriseCommand extends Command {
	readonly command = '회사';

	readonly preview = '회사 명령어(직원용)';
	readonly information = [
		{ arg: '정보', info: '회사 정보를 확인합니다' },
		{ arg: '주식', info: '회사의 주식 정보를 확인합니다' },
		{ arg: '주주', info: '회사의 주주 목록을 확인합니다' },
		{ arg: '직원', info: '회사의 직원 목록을 확인합니다' },
		{ arg: '상점', info: '회사의 상점을 확인합니다' },
		{ arg: '등록 <uid> <가격>', info: '회사 상점에 자신의 아이템을 등록합니다' },
		{ arg: '레시피', info: '회사의 공유 레시피를 확인할 수 있습니다' },
		{ arg: '레시피 <id>', info: '회사에 자신의 레시피를 공유합니다. 한번 공유하면 철회할 수 없습니다' },
		{ arg: '설명 <설명>', info: '(사장 전용 명령어)회사의 설명을 수정합니다' },
		{ arg: '승급', info: '(사장 전용 명령어)회사의 등급을 올립니다' },
		{ arg: '고용 <@유저맨션>', info: '(사장 전용 명령어)해당 유저를 직원으로 고용합니다' },
		{ arg: '해고 <@유저맨션>', info: '(사장 전용 명령어)해당 유저를 해고합니다' },
		{ arg: '확장', info: '(사장 전용 명령어)회사의 최대 직원수를 확장합니다. 비용은 (최대직원수-10)^2 만원입니다' },
		{ arg: '증자 <숫자(퍼센트)>', info: '(사장 전용 명령어)회사의 상장주식을 증자합니다. 하루에 한번 최대 10%를 증자할 수 있습니다.' },
		{ arg: '퇴사', info: '(직원 전용 명령어)회사를 나갑니다' }
	];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		var ent = this.Citius.GetSingleton(Zhongli).GetJoined(user.ID);
		if (!ent) await this.Karin.Reject('소속되어 있는 회사가 없습니다', '회사정보없음').SendChat(chat);
		else {
			switch (args[0]) {
				case '정보':
					await (await ent.Info()).SendChat(chat);
					break;
				case '주식':
				case '주식정보':
					await (await ent.Stock.Feed()).SendChat(chat);
					break;
				case '주주':
					await (await ent.Holder.KarinList(3)).SendChat(chat);
					break;
				case '직원':
					await (await ent.UserList()).SendChat(chat);
					break;
				case '상점':
					await (await ent.Shop()).SendChat(chat);
					break;
				case '등록':
					if (args.length < 3) await this.Karin.Reject('아이템과 가격을 입력해주세요', '아이템,가격 입력필요').SendChat(chat);
					else if (!user.GetComponent(Inventory).Focus(args[1].replace(/_/g, ' '))) await this.Karin.Reject('알 수 없는 아이템입니다', '아이템 없음').SendChat(chat);
					else {
						ent.Sell(user.ID, user.GetComponent(Inventory).RemoveItem(args[1].replace(/_/g, ' ')), +args[2]);
						await this.Karin.Confirm('아이템을 회사 상점에 등록하였습니다', '등록완료').SendChat(chat);
					}
					break;
				case '레시피':
					if (args[1]) {
						var reci = user.GetComponent(Inventory).GetRecipeOwnOnly(args[1]);
						if (!reci) await this.Karin.Reject('알 수 없는 레시피입니다', '레시피 없음').SendChat(chat);
						else {
							ent.ShareRecipe(user.ID, reci);
							await this.Karin.Confirm('레시피를 공유하였습니다', '레시피공유').SendChat(chat);
						}
					}
					else await ent.RecipeList().SendChat(chat);
					break;
				case '설명':
					if (!ent.isBoss(user.ID)) await this.Karin.Reject('사장 전용 명령어입니다', '관리불가').SendChat(chat);
					else await this.Karin.Confirm('설명변경').Text({
						T: '설명변경',
						D: `회사 설명을 '${ent.Description = args.slice(1).join(' ')}'으로 변경했습니다`
					}).SendChat(chat);
					break;
				case '승급':
					//TODO
					break;
				case '고용':
					if (!ent.isBoss(user.ID)) await this.Karin.Reject('사장 전용 명령어입니다', '관리불가').SendChat(chat);
					else if (chat.getMentionContentList().length < 1) await this.Karin.Reject('유저 맨션이 필요합니다', '유저맨션필요').SendChat(chat);
					else if (!ent.Employable) await this.Karin.Reject('직원을 더이상 고용할 수 없습니다', '고용불가').SendChat(chat);
					else {
						var focus = chat.getMentionContentList()[0].UserId;
						var info = chat.Channel.getUserInfoId(focus);
						var data = await this.Citius.User.Find(focus, chat.Channel);
						if (this.Citius.GetSingleton(Zhongli).GetJoined(data.ID)) await this.Karin.Reject('해당 유저는 이미 가입한 회사가 있습니다', '이미 직원인 유저').SendChat(chat);
						else {
							await chat.replyText(new ChatMention(info));
							await this.Nakiri.CKarin(`${ent.Name}社에 직원 신청을 받았습니다`, false, '회사 가입').SendChat(chat);
							var res = await this.Nakiri.Confirm(info.User, false, 60000);
							if (!res.result) await this.Karin.Reject('거절하였습니다', '거절').SendChat(chat);
							else {
								ent.Enroll(data.ID);
								await this.Karin.Confirm('회사 초대를 승낙하였습니다', '승낙').SendChat(chat);
							}
						}
					}
					break;
				case '해고':
					if (!ent.isBoss(user.ID)) await this.Karin.Reject('사장 전용 명령어입니다', '관리불가').SendChat(chat);
					else if (chat.getMentionContentList().length < 1) await this.Karin.Reject('유저 맨션이 필요합니다', '유저맨션필요').SendChat(chat);
					else {
						var focus = chat.getMentionContentList()[0].UserId;
						var data = await this.Citius.User.Find(focus, chat.Channel);
						if (!ent.Joined(data.ID)) await this.Karin.Reject('직원이 아닙니다', '직원아님').SendChat(chat);
						else if (ent.isBoss(data.ID)) await this.Karin.Reject('사장은 해고할 수 없습니다', '해고불가').SendChat(chat);
						else {
							ent.Resign(data.ID);
							await this.Karin.Confirm('유저를 해고했습니다', '해고').SendChat(chat);
						}
					}
					break;
				case '확장':
					var cost = (ent.MaxEmploy-10 ** 2) * 1000;
					if (user.GetComponent(Erica).Money < cost) await this.Karin.Reject(`돈이 부족합니다\r\n(가격: ${cost}, 현재 ${user.GetComponent(Erica).Money}원)`, '돈부족').SendChat(chat);
					else {
						user.GetComponent(Erica).Money -= cost;
						var ex = ent.Extend();
						this.Karin.Confirm(`회사의 최대직원수를 ${ex}명으로 확장했습니다\r\n(${cost}원 사용)`, '확장완료').SendChat(chat);
					}
					break;
				case '증자':
					if (!ent.isBoss(user.ID)) await this.Karin.Reject('사장 전용 명령어입니다', '관리불가').SendChat(chat);
					else if (isNaN(+args[1])) await this.Karin.Reject('숫자를 입력해주세요', '숫자입력').SendChat(chat);
					else if (!ent.Stock.CanStockIncrease) await this.Karin.Reject('이미 오늘 증자를 했습니다. 내일 시도해주세요', '증자불가').SendChat(chat);
					else {
						if (!(await ent.Stock.Offering(+args[1]))) await this.Karin.Reject('증자를 할 수 없습니다', '증자실패');
						else await (await ent.Stock.Feed()).SendChat(chat);
					}
					break;
				case '퇴사':
					if (ent.isBoss(user.ID)) await this.Karin.Reject('사장은 회사를 나갈 수 없습니다', '퇴사불가').SendChat(chat);
					else {
						await this.Nakiri.CKarin(`${ent.Name}社를 퇴사합니다. 계속하시겠습니까?`, false, '퇴사확인').SendChat(chat);
						var res = await this.Nakiri.Confirm(chat.Sender, false);
						if (!res.result) await this.Karin.Reject('취소하였습니다', '취소').SendChat(chat);
						else {
							ent.Resign(user.ID);
							await this.Karin.Confirm(`${ent.Name}社를 퇴사했습니다`, '퇴사').SendChat(chat);
						}
					}
					break;
			}
		}
	}
}