import { ObjectId } from "mongodb";
import { CustomType } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import ChannelTemp from "../../../Core/Citius/Channel/ChannelTemp";
import UserData from "../../../Core/Citius/User/UserData";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Keqing from "../../../Core/Keqing";
import Wordmap from "../Wordmap";
import ShiritoriActionStatus from "./ShiritoriActionStatus";
import ShiritoriGamer from "./ShiritoriGamer";
import ShiritoriSetting from "./ShiritoriSetting";

export default class ShiritoriGame extends ChannelTemp {
	private gid: string;

	private destroyer: NodeJS.Timeout;
	public get Destroyer() { return this.destroyer; }

	constructor(keqing: Keqing, data: ChannelData) {
		super(keqing, data);
		this.gid = this.GenerateUid(5);
		data.Use(this.gid);

		this.destroyer = setTimeout(() => { if (!this.Started && !this.Ended) this.Off(); }, 300000);
	}
	public get Channel() { return this.Data.Channel; }
	public get Started() { return this.started; }
	public get Ended() { return this.ended; }
	private started: boolean = false;
	private ended: boolean = false;

	public async ShowAndStartWait(): Promise<boolean> {
		return new Promise<boolean>(async (s) => {
			await this.Karin.Feed('시작안내').Text({
				T: '3초후 시작합니다',
				D: `';<단어>'로 입력해주세요`
			}).SendChannel(this.Channel);
			setTimeout(async () => {
				var res = this.Start();
				if (res) await (await this.NowTurnFeed()).SendChannel(this.Channel);
				else await this.Karin.Reject('알 수 없는 이유로 게임을 시작하는데 실패했습니다', '시작 실패').SendChannel(this.Channel);
				s(res);
			}, 3000);
		});
	}
	public Start() {
		if (this.gamers.length < 2) return false;
		else {
			this.looper = setInterval(() => this.Update(), 1000);
			this.gamers = this.gamers.sort(() => Math.random() - 0.5);
			this.gamers.forEach(e => e.Install(this.settings));
			this.started = true;
			return true;
		}
	}
	public Off() {
		this.Data.DelTempU(ShiritoriGame);
		this.Data.Used(this.gid);
		if (this.Looper) clearInterval(this.Looper);
		if (this.Destroyer) clearTimeout(this.Destroyer);
		this.gamers.forEach(e => e.Extinct());
		this.ended = true;
	}
	protected async Update() {
		try {
			this.playtime++;
			if (!this.NowTurn.TakeTime()) {
				var feed: FeedBuilder;
				var turn = this.NowTurn;
				if (!turn.Data.JoinedChannel(this.Channel)) throw new Error('유저가 방에 없는것 같습니다');
				else {
					turn.ResetTime();
					if (turn.DamageLife()) {
						var info = await turn.Data.GetUserInfo();
						feed = this.Karin.Feed('').TextFull(true).Text({
							T: '데미지!',
							D: `${info.Nickname}의 라이프 1 감소\r\n현재 ${turn.Life}라이프`
						});
					}
					else {
						await this.ExitPlayer(turn.Data);
						if (this.Ended) return;
						else {
							var info = await turn.Data.GetUserInfo();
							feed = this.Karin.Feed('').TextFull(true).Text({
								T: '탈락!',
								D: `${info.Nickname}님이 탈락하였습니다`
							});
						}
					}

					this.NextRound();
					this.Karin.Carousel<Feed>(CustomType.FEED, '재시작').add(
						await this.NowTurnFeed(),
						feed
					).SendChannel(this.Channel);
				}
			} else if (this.NowTurn.Time === 5) {
				var info = await this.NowTurn.Data.GetUserInfo();
				this.Karin.Feed('시간안내').Profile({
					TD: { T: info.Nickname },
					TH: { THU: info.ProfileImageURL, H: 200, W: 200 }
				}).Text({
					T: `현재차례: ${info.Nickname}`,
					D: `5초 남았습니다!`
				}).SendChannel(this.Channel);
			}
		}
		catch (e) {
			this.Off();
			this.Qurare.Caution(`끝말잇기 게임중 오류발생 : 자동 종료됨`);
			this.Qurare.Error(e);
			this.Karin.Carousel<Feed>(CustomType.FEED, '오류안내').add(
				this.Karin.Feed('').TextFull(true).Text({
					T: `게임 자동종료`,
					D: `알 수 없는 오류가 발생하여 게임이 자동으로 종료되었습니다.`
				}),
				this.Karin.Error(e)
			).SendChannel(this.Channel);
		}
	}

	public Action(str: string) {
		var map = this.Citius.GetSingleton(Wordmap);
		switch (true) {
			case this.used.includes(str):
				return ShiritoriActionStatus.ALREADY_USED;
			case str.length < 2:
				return ShiritoriActionStatus.TOOSHORT;
			case !this.AllowDecisive && map.isDecisive(str):
				return ShiritoriActionStatus.DECISIVE_BENNED;
			case this.next && this.next !== map.getFirstChar(str):
				return ShiritoriActionStatus.INVAILD_START;
			case !map.isWord(str):
				return ShiritoriActionStatus.UNKNOWN_WORD;
			default:
				this.used.push(str);
				this.next = map.getNextChar(map.getLastChar(str));
				this.NextTern();
				return ShiritoriActionStatus.VAILD;
		}
	}
	private NextTern() {
		this.NowTurn.ResetTime();
		this.turn++;
		this.turnAccure++;
	}
	private NextRound() {
		this.round++;
		this.turn = 0;
		this.next = null;
		this.used = [];
	}

	private gamers: ShiritoriGamer[] = [];
	public isHost(id: ObjectId) { return this.gamers[0]?.Data?.ID?.toHexString?.() === id.toHexString(); }

	private looper: NodeJS.Timeout;
	public get Looper() { return this.looper; }

	private used: string[] = [];
	private next: string;
	private turn: number = 0;

	private turnAccure: number = 0;
	private round: number = 1;
	private playtime: number = 0;

	private settings: ShiritoriSetting = {
		allowDecisive: false,
		lifeCount: 2,
		timelimit: 15
	};
	public get AllowDecisive() { return this.settings.allowDecisive; }
	public ToggleDecisive() { return this.settings.allowDecisive = !this.settings.allowDecisive; }
	public get LifeCount() { return this.settings.lifeCount; }
	public set LifeCount(num: number) { this.settings.lifeCount = Math.max(Math.min(num || this.LifeCount, 5), 1); }
	public get TimeLimit() { return this.settings.timelimit; }
	public set TimeLimit(num: number) { this.settings.timelimit = Math.max(Math.min(num || this.TimeLimit, 30), 11); }

	public get GamerNumber() { return this.gamers.length; }

	public get Next() { return this.next; }
	public get Turn() { return this.turn; }
	public get TurnAccure() { return this.turnAccure; }
	public get Round() { return this.round; }
	public get PlayTime() { return this.playtime; }
	public get NowTurn() { return this.gamers[this.turn % this.gamers.length]; }

	public AddPlayer(user: UserData): boolean {
		if (this.gamers.some(e => e.Data.ID.toHexString() === user.ID.toHexString())) return false;
		else if (user.HasTempU(ShiritoriGamer)) return false;
		else if (this.Started) return false;
		else {
			var gamer = new ShiritoriGamer(this.Keqing, user, this);
			this.gamers.push(gamer);
			user.AttachTempU(gamer);
			return true;
		}
	}
	public async ExitPlayer(user: UserData): Promise<boolean> {
		if (!this.gamers.some(e => e.Data.ID.toHexString() === user.ID.toHexString())) return false;
		else {
			var gamer = this.gamers.splice(this.gamers.findIndex(e => e.Data.ID.toHexString() === user.ID.toHexString()), 1)[0];
			gamer.Extinct();
			if (this.Started && this.gamers.length < 2) await this.gamers[0]?.SetWin?.();
			else if (this.gamers.length < 1) this.Off();
			return true;
		}
	}

	public Feed(): FeedBuilder {
		return this.Karin.Feed('방 정보').TextFull(true).Text({
			T: `${this.Channel.getDisplayName()}방의 끝말잇기 정보`,
			D: `${this.gamers.length}명 참여 | 한방단어 ${this.AllowDecisive ? '허용됨' : '금지됨'}\r\n기본 라이프 ${this.LifeCount} | 기본 타이머 ${this.TimeLimit}초${this.started ? `\r\n${this.Round}라운드 | ${this.turn}번째 턴` : ''}`
		});
	}
	public async NowTurnFeed(): Promise<FeedBuilder> {
		var info = await this.NowTurn.Data.GetUserInfo();
		return this.Karin.Feed('현재차례').Profile({
			TD: { T: info.Nickname },
			TH: { THU: info.ProfileImageURL, H: 200, W: 200 }
		}
		).TextFull(true).Text({
			T: `다음차례: ${info.Nickname}`,
			D: `${this.Next ? `'${this.Next}'(으)로 시작하는` : '아무'} 단어를 입력해주세요`
		});
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