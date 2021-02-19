import { CustomType } from "node-kakao";
import UserData from "../../../Core/Citius/User/UserData";
import CarouselBuilder from "../../../Core/Karin/Contents/Carousel/CarouselBuilder";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";
import KeqingBase from "../../../Core/KeqingBase";
import HermesShifter from "./HermesShifter";
import Occupation from "./Occupation";
import OccupationCS from "./OccupationCS";
import UnknownOccupation from "./Occupations/UnknownOccupation";
import OccupationStatusM from "./OccupationStatusM";

export default class Hermes extends KeqingBase {
	private pations: OccupationCS[] = [];
	public Attach(...pations: OccupationCS[]) { this.pations.push(...pations); }

	private shifters: HermesShifter[] = [];
	public AttachShifter(...shifter: HermesShifter[]) { this.shifters.push(...shifter); }
	//todo: execute shifter
	public ShifterCarousel(): CarouselBuilder<Feed> {
		return this.Karin.Carousel<Feed>(CustomType.FEED, '전직정보').add(...this.shifters.map(e => this.Karin.Feed('').TextFull(true).Text({
			T: e.name || '오류: 직업이름없음',
			D: `전직 아이템:${e.name || e.matid || '오류: 전직아이템없음'}`
		})));
	}

	public CreateByName(user: UserData, data: OccupationStatusM<any>): Occupation<any> {
		try {
			var pation = this.pations.find(e => e.name === data.occupation);
			if (!pation) return new UnknownOccupation(this.Keqing, user, data);
			else return new pation(this.Keqing, user, data);
		}
		catch (e) {
			this.Qurare.Error(e);
			return new UnknownOccupation(this.Keqing, user, data);
		}
	}
}