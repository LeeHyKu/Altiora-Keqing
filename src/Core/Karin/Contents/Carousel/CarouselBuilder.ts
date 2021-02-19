import { CustomAttachment, CustomCarouselContent, CustomInfo, CustomType } from "node-kakao";
import ContentBuilder from "../../Builders/ContentBuilder";
import TailerEx from "../../Tail/TailerEx";
import Commerce from "../Commerce/Commerce";
import Feed from "../Feed/Feed";
import List from "../List/List";
import Carousel from "./Carousel";
import CarouselCoverI from "./CarouselCoverI";
import ContentType from "./ContentType";

export default class CarouselBuilder<T extends Feed | List | Commerce> extends ContentBuilder<CustomCarouselContent> implements Carousel<T> {
	public readonly CType = CustomType.CAROUSEL;

	CIL: T[] = [];
	CHD?: CarouselCoverI;
	CTA?: CarouselCoverI;

	constructor(tail: TailerEx, public CTP: ContentType<T>) { super(tail); }

	add(...args: T[]) { if (this.CIL.length + args.length <= 70) this.CIL.push(...args); return this; }
	Header(head: CarouselCoverI) { this.CHD = head; return this; }
	Tail(tail: CarouselCoverI) { this.CTA = tail; return this; }

	Build() { var cr = new CustomCarouselContent(); cr.readRawContent(this); return cr; }

	Complate(): CustomAttachment {
		var info = Object.assign(this.tail);
		info['TP'] = this.CType;
		delete info['SNM'];
		delete info['SIC'];
		var tail = new CustomInfo();
		tail.readRawContent(info);
		return new CustomAttachment(tail, this.Build());
	}
}