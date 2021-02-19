import UserData from "../../../Core/Citius/User/UserData";
import UserTemp from "../../../Core/Citius/User/UserTemp";
import CarouselBuilder from "../../../Core/Karin/Contents/Carousel/CarouselBuilder";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Keqing from "../../../Core/Keqing";
import GomokuCharacters from "./GomokuCharacters";
import GomokuGame from "./GomokuGame";
import GomokuLaunchStatus from "./GomokuLaunchStatus";
import GomokuVector from "./GomokuVector";

export default class GomokuPlayer extends UserTemp {
	private _gid: string;
	public get Gid() { return this._gid; }
	public get User() { return this.Data; }
	public get Game() { return this._game; }
	public get Icon() { return this._icon; }
	constructor(keqing: Keqing, user: UserData, private _game: GomokuGame, private _icon: string) {
		super(keqing, user);
		this._gid = this.GenerateUid(5);
		user.Use(`GOMOKUPLAYER:${this._gid}`);
	}

	public Start() { this.Data.AttachTempU(this); }
	public End() {
		this.Data.Used(this.Gid);
		this.Data.DelTempU(GomokuPlayer);
	}

	private vectors: GomokuVector[] = [];
	public get Vectors() { return this.vectors; }
	public AddVector(vec: GomokuVector) { this.Vectors.push(vec); }
	public HasVector(vec: GomokuVector) { return this.Vectors.some(e => e.Eqauls(vec.X, vec.Y)); }
	public CheckWin(): boolean {
		for (var vec of this.Vectors) 
			for (var checks of vec.Checkmate()) {
				var count = 0;
				for (var check of checks) {
					if (this.HasVector(check)) {
						count++;
						if(count >= 5)
							return true;
					}
					else count = 0;
				}
			}
		return false;
	}

	public async Input(char: string): Promise<FeedBuilder | CarouselBuilder<Feed>> {
		if (this.Game.Now.Gid !== this.Gid) return this.Karin.Reject('차례가 아닙니다', '차례 아님');
		else {
			var x = GomokuCharacters.HorizontalNumber(char[0]);
			var y = GomokuCharacters.VecticalNumber(char[1]);
			switch (await this.Game.Input(x, y)) {
				case GomokuLaunchStatus.Already_Launched:
					return this.Karin.Reject('이미 착수하여 돌을 놓을 수 없는 자리입니다', '이미 착수한 좌표');
				case GomokuLaunchStatus.Confirm:
					return await this.Game.Feed();
				case GomokuLaunchStatus.Win:
					return null;
			}
		}
	}
	public async SetWin() {
		var info = await this.User.GetUserInfo();
		await this.Karin.Feed('승리').Profile(await this.User.GetProfile()).TextFull(true).Text({
			T: `${info.Nickname}님이 승리했습니다`,
			D: `실내로 통하는 모든 출입구를 봉쇄하십시오.
모든 전등을 끄십시오
어떠한 창문도 절대 열어선 안됩니다
상황이 종료될 때 까지는 창문이나 문에서 노크소리가 들리더라도 응답하지 마십시오
소리를 내서는 안됩니다 집 밖의 누구와도 소통을 시도하지 마십시오
집 밖에서 소리가 난다 하더라도 그게 무엇인지 알아보려고 하지 마십시오
집 밖에서 불빛이 보이더라도 살펴보러 가면 안 됩니다
만일 신원 미상의 사람이 집 안에서 목격되거나 시야 가장자리에서 보이는 경우에는 그게 무엇인지 알아보려 하지 마십시오
천장을 쳐다보지 마십시오
가족 중 누군가가 실종되더라도 찾지 마십시오
만약 귀하께서 두려움을 느낀다면 같이 바라봅시다`
		}).Profile(await this.User.GetProfile()).SendChannel(this.Game.Channel);
		this.Game.End();
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