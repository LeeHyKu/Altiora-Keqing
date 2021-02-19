import { CustomType } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";
import Keqing from "../../../Core/Keqing";
import KeqingBase from "../../../Core/KeqingBase";
import BattleMember from "./BattleMember";

export default abstract class Battle extends KeqingBase {
	private gid: string;
	public get Data() { return this._channel; }
	public get Channel() { return this.Data.Channel; }
	constructor(keqing: Keqing, private _channel: ChannelData) {
		super(keqing);
		this.gid = `Battle:${this.GenerateUid(10)}`;
		_channel.Use(this.gid);
	}
	private _started: boolean = false;
	private _ended: boolean = false;
	private _looper: NodeJS.Timeout;
	private _ender: NodeJS.Timeout;
	public get Started() { return this._started; }
	public get Ended() { return this._ended; }
	public get Looper() { return this._looper; }
	public get Ender() { return this._ender; }

	public Start() {
		this._started = true;
		this._looper = setInterval(async () => await this.OnUpdate(), 1000);
		this._ender = setTimeout(async () => {
			if (!this.Ended) {
				await this.Karin.Feed('전투자동종료').TextFull(true).Text({
					T: '전투자동종료안내',
					D: `전투가 너무 오래 지속되어 게임이 자동으로 종료되었습니다`
				}).SendChannel(this.Channel);
				this.Off();
			}
		}, 1800000);

		for (var member of this.getAllMember()) member.Start();
	}
	public Off() {
		this._ended = true;
		this.Data.Used(this.gid);
		this.getAllMember().forEach(e => e.Destroy());
		if (this.Looper) clearInterval(this.Looper);
		if (this.Ender) clearTimeout(this.Ender);
	}
	public async OnUpdate() {
		try {
			for (var member of this.getAllMember()) member.Breath();
			await this.Update();
		}
		catch (e) {
			this.Off();
			this.Qurare.Caution(`전투중 오류발생 : ${this.constructor.name} - 자동 종료됨`);
			this.Qurare.Error(e);
			this.Karin.Carousel<Feed>(CustomType.FEED, '오류안내').add(
				this.Karin.Feed('').TextFull(true).Text({
					T: `전투 자동종료`,
					D: `알 수 없는 오류가 발생하여 전투가 자동으로 종료되었습니다.`
				}),
				this.Karin.Error(e)
			).SendChannel(this.Channel);
		}
	}

	public abstract Update(): any | Promise<any>;
	public abstract getOpponent(you: BattleMember, focus?: string): BattleMember;
	protected abstract OnStart();
	protected abstract getAllMember(): BattleMember[];

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