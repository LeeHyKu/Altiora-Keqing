import { ChatChannel, CustomImageCropStyle } from "node-kakao";
import UserComponent from "../../../Core/Citius/User/UserComponent";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Attandance from "../Ranker/Attandance/AttandanceRanker";
import EricaRaw from "./EricaRaw";
import Level from "./Level";

export default class Erica extends UserComponent<EricaRaw>{
	private _money: number;
	private _exp: number;
	private _achieved: number;
	private _alarm: boolean;

	private _attandance?: Date;

	public get Money() { return +this._money.toFixed(3); }
	public set Money(num) { this._money = isNaN(num) ? this._money : num; }

	public get Exp() { return this._exp; }
	public get Level(): Level {
		var lv = Math.floor(Math.sqrt(this._exp / 10));
		return {
			totalExp: +this._exp.toFixed(2),
			level: lv + 1,
			restExp: +(this._exp - (lv ** 2 * 10)).toFixed(2),
			entireExp: +(((lv + 1) ** 2 * 10) - (lv ** 2 * 10)).toFixed(2)
		};
	}

	public get AchievedLevel() { return this._achieved; }

	public ToggleAlarm() { this._alarm = !this._alarm; return this._alarm; }
	public get Alarm() { return this._alarm; }

	public get Attandance() { return this._attandance || new Date(0); }

	public async Attend(channel: ChatChannel): Promise<FeedBuilder> {
		var atd = this.Citius.GetSingleton(Attandance);
		await atd.Get();
		if (this.Attandance.toDateString() === new Date().toDateString()) {
			//이미 출석한 경우
			var rank = await atd.MyIndex(this.Data.ID, channel);
			return this.Karin.Feed('출석').Profile(await this.Data.GetProfile()).Text({ T: '이미 출석하였습니다', D: `내부 ${rank.local}등 | 전체 ${rank.global}등(${rank.globalAll}명 출석)\r\n${this.Attandance.toLocaleTimeString()}.${this.Attandance.getMilliseconds()}` }).TextFull(true);
		}
		else {
			//출석하지 않은 경우
			this._attandance = new Date();
			await atd.DoAttandnance(this.Data);
			var rank = await atd.MyIndex(this.Data.ID, channel);

			var money = 30000 + Math.max(70000 - (100 * (rank.global - 1)), 0);
			var exp = 50 + Math.max(350 - (5 * (rank.global - 1)), 0);

			this.Money += money;
			this.IssueExp(exp, channel);

			return this.Karin.Feed('출석').Profile(await this.Data.GetProfile()).Text({ T: `${rank.local}등 (전체 ${rank.global}등)`, D: `보상: ${money}원 | ${exp}xp` }).TextFull(true);
		}
	}
	public IssueExp(exp: number, channel: ChatChannel) {
		this._exp += Math.max(exp, 0);
		var now = this.Level.level;
		if (now && now > this._achieved) {
			var cache = this._achieved;
			this._achieved = now;
			var lvupR = 0;
			for (let index = 0; index < now - cache; index++) { lvupR += 1000 + ((now - index) * 1000); }
			this.Money += lvupR;

			if (this._alarm) {
				setTimeout(async () => {
					var info = await this.Data.GetUserInfo();
					await this.Karin.Feed('레벨업')
						.Profile({ TD: { T: info.Nickname }, TH: { THU: info.ProfileImageURL, H: 200, W: 200, SC: CustomImageCropStyle.CENTER_CROP } })
						.TextFull(true)
						.Text({ T: `Lv.${cache} -> Lv.${now}`, D: `보상: ${lvupR}원\r\n알림 끄기: !프로필 알림` })
						.SendChannel(channel);
				}, 200);
			}
		}
	}
	public async Profile() {
		var info = await this.Data.GetUserInfo();
		var lv = this.Level;
		return this.Karin.Feed('유저정보')
			.Profile({ TD: { T: info.Nickname }, TH: { THU: info.ProfileImageURL, H: 200, W: 200, SC: CustomImageCropStyle.CENTER_CROP } })
			.TextFull(true)
			.Text({
				T: `Lv.${lv.level} (${lv.restExp}/${lv.entireExp};${lv.totalExp})`,
				D: `돈: ${this.Money}원\r\n출석: ${this.Attandance.toLocaleDateString() == new Date().toLocaleDateString() ? `${this.Attandance.toLocaleTimeString()}.${this.Attandance.getMilliseconds()}` : '미출석'}\r\n알림: ${this.Alarm ? '' : '비'}활성화`
			});
	}

	protected Initialization(): EricaRaw {
		return {
			money: 100000,
			exp: 1,
			achieved: 1,
			alarm: true
		}
	}
	protected Installation(raw: EricaRaw) {
		this._money = raw.money;
		this._exp = raw.exp;
		this._achieved = raw.achieved;
		this._alarm = raw.alarm;
		if (raw.attandance) this._attandance = raw.attandance;
	}
	public Raw(): EricaRaw {
		var raw: EricaRaw = {
			money: this._money,
			exp: this._exp,
			achieved: this._achieved,
			alarm: this._alarm
		};
		if (this._attandance) raw['attandance'] = this._attandance;

		return raw;
	}
}