import { Chat, ChatMention } from "node-kakao";
import ChannelData from "../../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../../Core/Citius/User/UserData";
import Command from "../../../../Core/Fortius/Command/Command";
import NakiriStatus from "../../../../Core/Nakiri/NakiriStatus";
import Erica from "../../../Erica/Component/Erica";
import Inventory from "../../Inventory/Inventory";
import Contract from "../../Venti/Items/Contract/Contract";
import Rarity from "../../Venti/Rarity";
import Venti from "../../Venti/Venti";

export default class VentiContractCommand extends Command {
	readonly command = '계약';

	readonly preview = '계약서를 작성합니다'
	readonly previewIndex = '※경고:계약은 법적인 효력이 없고, 내용을 이행해야하는 의무는 보장되지 않습니다.\r\n다만, 내용 위반시 피해자는 관리자에게 해당 유저의 채팅봇 사용제재를 요청할 수 있습니다.';
	readonly information = [
		{ info: "계약서를 작성합니다. 중간에 '취소'를 입력하면 입력이 취소됩니다. 수수료가 부과됩니다." },
		{ arg: '<uid>', info: '계약서의 내용을 확인합니다' },
		{ arg: '<uid> <@유저맨션>', info: '계약을 채결합니다' }
	];

	async Prefix(chat: Chat, user: UserData, channel: ChannelData) {
		if (user.GetComponent(Erica).Money < 3000) { await this.Karin.Reject('돈이 부족합니다', '돈부족').SendChat(chat); }
		else user.GetComponent(Erica).Money -= 3000;

		await this.Nakiri.CKarin(`계약서 생성 마법사를 시작합니다\r\n경고: 계약서에 일체 '부적절한' 내용을 입력하는것을 금지합니다.\r\n적발시 해당 사용자의 채팅봇 데이터 초기화 및 영구 사용금지 처리됨을 알려드립니다\r\n계속하시겠습니까?`, false, '계약서 생성 마법사').SendChat(chat);
		if (!(await this.Nakiri.Confirm(chat.Sender, false, 10000)).result) { await this.Karin.Reject('취소하였습니다', '취소').SendChat(chat); }

		await this.Nakiri.QKarin(`제목을 입력해주세요\r\n경고: 계약서에 일체 '부적절한' 내용을 입력하는것을 금지합니다.\r\n적발시 해당 사용자의 채팅봇 데이터 초기화 및 영구 사용금지 처리됨을 알려드립니다`, '제목입력').SendChat(chat);
		var title = await this.Nakiri.Text(chat.Sender, 30000);
		if (title.status !== NakiriStatus.CONFIRM || title.result == '취소') { await this.Karin.Reject('작성을 취소하였습니다', '취소').SendChat(chat); return; }
		else if (title.result.length > 17) { await this.Karin.Reject('제목이 너무 길어 생성할 수 없습니다. 17자 이내로 줄여주세요', '제목길이').SendChat(chat); return; }
		await this.Nakiri.QKarin(`내용을 입력해주세요\r\n경고: 계약서에 일체 '부적절한' 내용을 입력하는것을 금지합니다.\r\n적발시 해당 사용자의 채팅봇 데이터 초기화 및 영구 사용금지 처리됨을 알려드립니다`, '내용입력').SendChat(chat);
		var content = await this.Nakiri.Text(chat.Sender, 300000);
		if (content.status !== NakiriStatus.CONFIRM || content.result == '취소') { await this.Karin.Reject('작성을 취소하였습니다', '취소').SendChat(chat); return; }
		else if (content.result.length > 200) { await this.Karin.Reject('내용이 너무 길어 생성할 수 없습니다. 200자 이내로 줄여주세요', '내용길이').SendChat(chat); return; }

		user.GetComponent(Inventory).AddItem(this.Citius.GetSingleton(Venti).Create(Contract, user, { name: title.result.replace(/\n/g, ''), description: '표준계약서', rarity: Rarity.NORMAL, content: content.result.replace(/\n/g, ''), contractor: user.ID }));
		await this.Karin.Confirm(`작성을 완료하였습니다\r\n경고: 계약서에 '부적절한' 내용을 입력하는것을 금지하며, 적발시 해당 사용자의 채팅봇 데이터 초기화 및 영구 사용금지 처리됨을 알려드립니다.\r\n 만약 부적절한 내용을 입력하였을 경우, '인벤토리' 명령어를 사용하지 마시고, 채팅봇 관리자에게 연락하시기 바랍니다.`, '작성완료').SendChat(chat);
	}
	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		if (args[0]) {
			var item = user.GetComponent(Inventory).Focus(args[0], Contract);
			if (!item) await this.Karin.Reject('알 수 없는 아이템입니다', '아이템 없음').SendChat(chat);
			else {
				if (chat.getMentionContentList().length > 0) {
					if (item.Assignee) await this.Karin.Reject('이미 활성화된 아이템입니다', '사용된 아이템').SendChat(chat);
					else {
						var info = chat.Channel.getUserInfoId(chat.getMentionContentList()[0].UserId);
						await chat.replyText(new ChatMention(info));
						await this.Karin.Feed('동의').Text({ T: `${item.Name} 동의`, D: `${item.Content}\r\n※경고:본 내용은 유저가 입력한 내용입니다.\r\n(y/N)` }).TextFull(true).SendChat(chat);
						var confirm = await this.Nakiri.Confirm(info.User, false, 300000);
						if (confirm.status !== NakiriStatus.CONFIRM || !confirm.result) await this.Karin.Reject('거부하였습니다', '거부').SendChat(chat);
						else {
							item.Activate((await this.Citius.User.Find(info.Id, chat.Channel)).ID);
							await this.Karin.Confirm(`${item.Name}(이)가 채결되었습니다.`, '채결').SendChat(chat);
						}
					}
				}
				else await (await item.Info()).SendChat(chat); 
			}
		}
		else await this.Prefix(chat, user, channel);
	}
}