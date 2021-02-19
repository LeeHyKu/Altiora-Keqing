import { Chat, ChatMention } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import DilucUser from "../../Dilruc/Component/DilucUser";
import Zhongli from "../Zhongli";

export default class ZhongliCommand extends Command {
	readonly command = '종려';

	readonly preview = '가상 주식,회사 명령어(외부인용)';
	readonly information = [
		{ arg: '검색 <이름>', info: '' },
		{ arg: '<주명> 상점', info: '해당 회사의 상점을 확인합니다' },
		{ arg: '<주명> 구매 <uid>', info: '해당 회사의 상점에서 아이템을 구매합니다' },
		{ arg: '<주명> 매수 <수량>', info: '주식을 구매합니다' },
		{ arg: '<주명> 매도 <수량>', info: '주식을 판매합니다' },
		{ arg: '<주명> 정보', info: '해당 회사의 정보를 확인합니다' },
		{ arg: '<주명> 주주', info: '해당 회사의 주주 목록을 확인합니다' },
		{ arg: '<주명> 주식', info: '해당 회사의 주식정보를 확인합니다' },
		{ arg: '<주명> 직원', info: '해당 회사의 직원 목록을 확인합니다' },
		{ arg: '<주명> 임명 <@유저맨션>', info: '(최대주주 전용)해당 회사의 CEO를 임명합니다. 직원중에서 선택할 수 있습니다' },
		{ arg: '<주명> 고용 <@유저맨션>', info: '(최대주주 전용)해당 회사에 직원을 고용합니다' },
	];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '검색':
				await (await this.Citius.GetSingleton(Zhongli).Search(args.slice(1).join(' '))).SendChat(chat);
				break;
			default:
				var ent = this.Citius.GetSingleton(Zhongli).GetByStName(args[0]);
				if (!ent) await this.Karin.Reject('찾으려는 회사의 주식명을 입력해주세요', '알 수 없는 회사').SendChat(chat);
				else {
					switch (args[1]) {
						case '매수':
							await (await user.GetComponent(DilucUser).AddBuyData((await ent.Stock.Buy(user, +args[2] || 1)).asset).Feed()).SendChat(chat);
							break;
						case '매도':
							await (await user.GetComponent(DilucUser).Sell(`EnterpriseAsset:${ent.StockName}`, +args[2] || 1)).SendChat(chat);
							break;
						case '주주':
							await (await ent.Holder.KarinList(3)).SendChat(chat);
							break;
						case '주식':
							await (await ent.Stock.Feed()).SendChat(chat);
							break;
						case '직원':
							await (await ent.UserList()).SendChat(chat);
							break;
						case '상점':
							await (await ent.Shop()).SendChat(chat);
							break;
						case '구매':
							if (!args[2]) await this.Karin.Reject('아이템을 입력해주세요', '아이템 입력필요').SendChat(chat);
							else await (await ent.Buy(user, args.slice(2).join(' '))).SendChat(chat);
							break;
						case '임명':
							if (!await ent.Holder.IsMajour(user.ID)) await this.Karin.Reject('해당 회사의 최대주주가 아닙니다', '대주주 아님').SendChat(chat);
							else {
								var focus = chat.getMentionContentList()[0].UserId;
								var info = chat.Channel.getUserInfoId(focus);
								var data = await this.Citius.User.Find(focus, chat.Channel);
								if (!ent.Joined(data.ID)) await this.Karin.Reject('직원이 아닙니다', '직원아님').SendChat(chat);
								else if (ent.isBoss(data.ID)) await this.Karin.Reject('이미 사장인 유저입니다', '임명불가').SendChat(chat);
								else {
									await chat.replyText(new ChatMention(info));
									await this.Nakiri.CKarin(`${ent.Name}社의 사장직을 제의받았습니다`, false, '사장임명').SendChat(chat);
									var res = await this.Nakiri.Confirm(info.User, false, 60000);
									if (!res.result) await this.Karin.Reject('거절하였습니다', '거절').SendChat(chat);
									else {
										ent.Handover(data.ID);
										await this.Karin.Confirm('사장직을 승낙하였습니다', '승낙').SendChat(chat);
									}
								}
							}
							break;
						case '고용':
							if (!await ent.Holder.IsMajour(user.ID)) await this.Karin.Reject('해당 회사의 최대주주가 아닙니다', '대주주 아님').SendChat(chat);
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
						case '정보':
						default:
							await (await ent.Info()).SendChat(chat);
							break;
					}
				}
				break;
		}
	}
}