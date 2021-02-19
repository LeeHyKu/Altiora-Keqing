import { CustomType } from "node-kakao";
import UserData from "../../../Core/Citius/User/UserData";
import UserTemp from "../../../Core/Citius/User/UserTemp";
import CarouselBuilder from "../../../Core/Karin/Contents/Carousel/CarouselBuilder";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Keqing from "../../../Core/Keqing";
import Erica from "../../Erica/Component/Erica";
import Wordmap from "../Wordmap";
import ShiritoriActionStatus from "./ShiritoriActionStatus";
import ShiritoriGame from "./ShiritoriGame";
import ShiritoriSetting from "./ShiritoriSetting";

export default class ShiritoriGamer extends UserTemp {
	private gid: string;
	constructor(keqing: Keqing, user: UserData, private _game: ShiritoriGame) {
		super(keqing, user);
		this.gid = this.GenerateUid(5);
		user.Use(`SHI:${this.gid}`);
	}

	public get Game() { return this._game; }
	public get Data() { return super.Data; }

	private deftime: number;
	private deflife: number;
	private time: number;
	private life: number;

	public get Time() { return this.time; }
	public TakeTime() { return --this.time > 0; }
	public ResetTime() { this.time = this.deftime; }

	public get Life() { return this.life; }
	public DamageLife() { this.life--; return this.life > 0; }
	public Heal() { this.life = Math.min(this.life + 1, this.deflife); }

	public Install(setting: ShiritoriSetting) {
		this.deftime = setting.timelimit;
		this.deflife = setting.lifeCount;
		this.ResetTime();
		this.life = this.deflife;
	}

	public async Action(str: string): Promise<FeedBuilder | CarouselBuilder<Feed>> {
		if (!this.Game.Started) return this.Karin.Reject('게임이 아직 시작되지 않았습니다', '시작되지 않음');
		else if (this.Game.NowTurn.Data.ID.toHexString() !== this.Data.ID.toHexString()) return this.Karin.Reject('다른 유저의 차례입니다', '차례 아님');
		else {
			switch (this.Game.Action(str)) {
				case ShiritoriActionStatus.ALREADY_USED:
					return this.Karin.Reject(`이미 사용한 단어입니다\r\n${this.Game.Next ? `'${this.Game.Next}'로 시작하는` : '아무'} 단어를 입력해주세요`, '사용한 단어');
				case ShiritoriActionStatus.DECISIVE_BENNED:
					return this.Karin.Reject(`한방단어 금지 상태입니다\r\n${this.Game.Next ? `'${this.Game.Next}'로 시작하는` : '아무'} 단어를 입력해주세요`, '한방단어 금지');
				case ShiritoriActionStatus.INVAILD_START:
					return this.Karin.Reject(`${this.Game.Next ? `'${this.Game.Next}'로 시작하는` : '아무'} 단어를 입력해주세요`, '알맞지 않은 단어');
				case ShiritoriActionStatus.TOOSHORT:
					return this.Karin.Reject(`너무 짧은 단어입니다\r\n${this.Game.Next ? `'${this.Game.Next}'로 시작하는` : '아무'} 단어를 입력해주세요`, '너무 짧은 단어');
				case ShiritoriActionStatus.UNKNOWN_WORD:
					return this.Karin.Reject(`알 수 없는 단어입니다\r\n${this.Game.Next ? `'${this.Game.Next}'로 시작하는` : '아무'} 단어를 입력해주세요`, '알 수 없는 단어');
				case ShiritoriActionStatus.VAILD:
					var mean = this.Citius.GetSingleton(Wordmap).getWordMean(str);
					return this.Karin.Carousel<Feed>(CustomType.FEED, '끝말잇기').add(
						await this.Game.NowTurnFeed(),
						this.Karin.Feed('').TextFull(true).Text({
							T: str,
							D: mean
						})
					);
			}
		}
	}

	public Extinct() {
		this.Data.Used(`SHI:${this.gid}`);
		this.Data.DelTempU(ShiritoriGamer);
	}
	public async SetWin() {
		var money = (
			(this.Game.TurnAccure * 50) +
			(this.Game.Round * 500) +
			this.Game.PlayTime
		);
		var exp = Math.floor(this.Game.TurnAccure / 10);


		var info = await this.Data.GetUserInfo();
		await this.Karin.Feed('승리').Image({
			THU: info.OriginalProfileImageURL,
			H: 1000,
			W: 1000
		}).TextFull(true).Profile({
			TD: { T: info.Nickname },
			TH: { THU: info.ProfileImageURL, H: 200, W: 200 }
		}).Text({
			T: `${info.Nickname}님 승리`,
			D: `${money}원 | ${exp}xp`
		}).SendChannel(this.Game.Channel);
		this.Data.GetComponent(Erica).Money += money;
		this.Data.GetComponent(Erica).IssueExp(exp, this.Game.Channel);
		this.Game.Off();
	}

	private GenerateUid(length: number) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
}