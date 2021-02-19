import UserData from "../../../Core/Citius/User/UserData";
import UserTemp from "../../../Core/Citius/User/UserTemp";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Keqing from "../../../Core/Keqing";
import DilucUser from "../../Dilruc/Component/DilucUser";
import Diluc from "../../Dilruc/Diluc";
import Erica from "../../Erica/Component/Erica";
import Zhongli from "../Zhongli";
import Enterprise from "./Enterprise";
import EnterpriseRank from "./EnterpriseRank";

export default class EnterpriseBuilder extends UserTemp {
	private _timer: NodeJS.Timeout;
	constructor(keqing: Keqing, user: UserData) {
		super(keqing, user);
		this._timer = setTimeout(() => { if (this.Data.HasTemp(EnterpriseBuilder)) { this.Data.DelTemp(EnterpriseBuilder); this.Data.CheckSave(); } }, 1200000);
	}

	public get Boss() { return this.Data.ID; }

	private name: string;
	private stname: string;
	private description: string;

	public Name(name: string) {
		if (!name) throw new EnterpriseBuilderError('이름을 입력해주세요');
		else if (name.length > 30) throw new EnterpriseBuilderError('이름은 30자 이내로 입력해주세요');
		else if (this.Citius.GetSingleton(Zhongli).GetByName(name)) throw new EnterpriseBuilderError('이미 있는 회사명입니다.');
		else {
			this.name = name;
			return this;
		}
	}
	public Stname(name: string) {
		if (!name) throw new EnterpriseBuilderError('주식명을 입력해주세요');
		else if (name.length > 4) throw new EnterpriseBuilderError('주식명은 4글자 이내로 입력해주세요');
		else if (name.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '')) throw new EnterpriseBuilderError('주식명은 한글로 입력해주세요');
		else if (this.Citius.GetSingleton(Zhongli).GetByStName(name)) throw new EnterpriseBuilderError('이미 있는 주식명입니다.');
		else {
			this.stname = name;
			return this;
		}
	}
	public Description(desc: string) {
		if (!desc) throw new EnterpriseBuilderError('회사 설명을 입력해주세요');
		else if (desc.length > 200) throw new EnterpriseBuilderError('회사 설명은 200자 이내로 입력해주세요');
		else {
			this.description = desc;
			return this;
		}
	}

	public Status(): FeedBuilder {
		return this.Karin.Feed('생성정보').TextFull(true).Text({
			T: `${this.name || '회사명 미정'}\r\n(${this.stname || '주식명 미정'}, DSE)`,
			D: this.description || '설명없음'
		});
	}

	public async Build() {
		if (!this.name || !this.stname) throw new EnterpriseBuilderError('아직 완성되지 않았습니다');
		else if (this.Data.GetComponent(Erica).Money < 3000000) throw new EnterpriseBuilderError('돈이 부족합니다');
		else if (this.Citius.GetSingleton(Zhongli).GetJoined(this.Data.ID)) throw new EnterpriseBuilderError('회사를 나가주세요');
		else {
			this.Data.GetComponent(Erica).Money -= 3000000;
			var entp = this.CreateE();
			this.Citius.GetSingleton(Zhongli).AddEnterprise(entp);
			this.Data.GetComponent(DilucUser).AddBuyData(await entp.Stock.Assign(3500));
			this.Delete();
		}
	}
	public Delete() {
		this.Data.DelTemp(EnterpriseBuilder);
		clearTimeout(this._timer);
	}
	private CreateE() {
		return new Enterprise(this.Keqing, {
			_id: null,
			name: this.name,
			description: this.description || '',
			stname: this.stname,
			rank: EnterpriseRank.Startup,

			boss: this.Boss,
			employees: [],
			maxemploy: 10,

			sales: 0,
			products: [],
			recipes: [],

			stock: {
				cost: 500,
				costy: 500,
				stocks: 6000,
				costupd: new Date(),
				bonuschance: 1
			}
		});
	}
}

class EnterpriseBuilderError extends Error { }