import { Chat, CustomType } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";
import DilucUser from "../Component/DilucUser";
import Beyond from "../Exchange/Beyond/Beyond";

export default class DilucBeyondCommand extends Command {
	readonly command = '주식';
	readonly aliases = ['현실주식', '현주', '다이루크'];

	readonly preview = '현실 주식 명령어';
	readonly previewIndex = '현실의 주식을 가상으로 사고팝니다\r\n각 주식마다 구매할 수 있는 재고가 정해져있습니다';
	readonly information = [
		{ arg: '검색 <주식이름 혹은 주식ID>', info: '주식을 검색합니다' },
		{ arg: '구매 <주식이름 혹은 주식ID> <숫자>', info: '주식을 구매합니다' },
		{ arg: '판매 <주식이름 혹은 주식ID> <숫자>', info: '주식을 판매합니다' },
		{ arg: '보유', info: '보유중인 주식을 전부 확인합니다' },
	];

	async Prefix(chat: Chat, user: UserData, channel: ChannelData) {
		await this.Karin.Reject(`'${channel.Prefix}h 주식'으로 주식 명령어에 대한 정보를 확인해주세요`, '도움말 확인').SendChat(chat);
	}
	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '검색':
			case '정보':
			case '종목':
				var results = await this.Citius.GetSingleton(Beyond).Search(args.slice(1).join(' ').replace(/_/g, ' '));
				var car = this.Karin.Carousel<Feed>(CustomType.FEED, '주식검색결과');
				for (var s of results) car.add(await s.Feed());
				await car.SendChat(chat);
				break;
			case '구매':
			case '매수':
				await (await this.Citius.GetSingleton(Beyond).Buy(user, args[1].replace(/_/g, ' '), +args[2] || 1)).SendChat(chat);
				break;
			case '판매':
			case '매도':
				await (await user.GetComponent(DilucUser).Sell(args[1].replace(/_/g, ' '), +args[2] || 1)).SendChat(chat);
				break;
			case '보유':
			case '잔고':
				await (await user.GetComponent(DilucUser).InventoryFeed()).SendChat(chat);
				break;
		}
	}
}