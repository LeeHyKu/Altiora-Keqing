import { CustomType } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Keqing from "../../../Core/Keqing";
import KeqingBase from "../../../Core/KeqingBase";
import GomokuError from "../GomokuError";
import GomokuCharacters from "./GomokuCharacters";
import GomokuLaunchStatus from "./GomokuLaunchStatus";
import GomokuPlayer from "./GomokuPlayer";
import GomokuVector from "./GomokuVector";

const SIZE = 12;

export default class GomokuGame extends KeqingBase {
	private _gid: string;
	public get Gid() { return this._gid; }
	public get ChannelData() { return this._channel; }
	public get Channel() { return this.ChannelData.Channel; }
	constructor(keqing: Keqing, private _channel: ChannelData, black: UserData, white: UserData) {
		super(keqing);
		if (black.HasTempU(GomokuGame) || white.HasTempU(GomokuGame)) throw new GomokuError('게임을 플레이중인 유저가 있습니다');
		else {
			this._gid = this.GenerateUid(10);
			var ath = `GOMOKU:${this.Gid}`;
			_channel.Use(ath);
			black.Use(ath);
			white.Use(ath);
			this._black = new GomokuPlayer(this.Keqing, black, this, GomokuCharacters.BLACK);
			this._white = new GomokuPlayer(this.Keqing, white, this, GomokuCharacters.WHITE);
		}
	}

	private _black: GomokuPlayer;
	private _white: GomokuPlayer;
	public get Black() { return this._black; }
	public get White() { return this._white; }

	private turn: number = 0;
	public get Turn() { return this.turn; }
	public get Now() { return this.turn % 2 ? this.White : this.Black; }

	private _ender: NodeJS.Timeout;
	public get Ender() { return this._ender; }

	public async Input(x: number, y: number): Promise<GomokuLaunchStatus> {
		var vector = new GomokuVector(x, y, SIZE);
		if (this.VectorHas(vector)) return GomokuLaunchStatus.Already_Launched;
		else {
			this.Now.AddVector(vector);
			if (this.Now.CheckWin()) {
				await this.Now.SetWin();
				return GomokuLaunchStatus.Win;
			}
			else {
				this.turn++;
				return GomokuLaunchStatus.Confirm;
			}
		}
	}
	public VectorHas(vec: GomokuVector) { return this.Black.HasVector(vec) || this.White.HasVector(vec); }

	public Print() {
		var board = [
			[
				GomokuCharacters.TOP_LEFT,
				...GomokuCharacters.TOP_CENTER.repeat(SIZE - 2),
				GomokuCharacters.TOP_RIGHT,
				GomokuCharacters.Vertical[0]
			],
			...(new Array(SIZE - 2).fill('').map((n, index) => {
				return [
					GomokuCharacters.CENTER_LEFT,
					...GomokuCharacters.CENTER_CENTER.repeat(SIZE - 2),
					GomokuCharacters.CENTER_RIGHT,
					GomokuCharacters.Vertical[index + 1]
				];
			})),
			[
				GomokuCharacters.BOTTOM_LEFT,
				...GomokuCharacters.BOTTOM_CENTER.repeat(SIZE - 2),
				GomokuCharacters.BOTTOM_RIGHT,
				GomokuCharacters.Vertical[SIZE - 1]
			]
		];
		for (var black of this.Black.Vectors) board[black.Y][black.X] = this.Black.Icon;
		for (var white of this.White.Vectors) board[white.Y][white.X] = this.White.Icon;
		return [...board, GomokuCharacters.Horizontal.slice(0, SIZE)].map(e => e.join(' ')).join('\r\n');
	}
	public async Feed() {
		var info = await this.Now.User.GetUserInfo();
		return this.Karin.Feed('오목판').TextFull(true).Text({
			T: `차례: ${info.Nickname}(${this.turn % 2 ? '백' : '흑'})`,
			D: this.Print()
		});
	}

	private _started: boolean = false;
	private _ended: boolean = false;
	public get Started() { return this._started; }
	public get Ended() { return this._ended; }
	public async Start() {
		try {
			this.Black.Start();
			this.White.Start();
			this._ender = setTimeout(async () => {
				if (this.Started && !this.Ended) {
					await this.Karin.Reject('게임이 너무 오래 지속되어 자동 종료되었습니다', '자동종료').SendChannel(this.Channel);
					this.End();
				}
			}, 1800000)
			this._started = true;
		}
		catch (e) {
			await this.Karin.Carousel<FeedBuilder>(CustomType.FEED, '오류발생').add(
				this.Karin.Reject('알 수 없는 오류로 인해 게임이 강제 종료되었습니다', '오류로 인한 강제종료'),
				this.Karin.Error(e)
			).SendChannel(this.Channel);
			this.Qurare.Error(e);
			this.End();
		}
	}
	public End() {
		this.Black.End();
		this.White.End();
		if (this.Ender) clearTimeout(this.Ender);
		this._ended = true;
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