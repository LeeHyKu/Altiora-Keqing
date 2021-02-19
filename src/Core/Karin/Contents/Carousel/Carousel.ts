import Commerce from "../Commerce/Commerce";
import Feed from "../Feed/Feed";
import List from "../List/List";
import CarouselCoverI from "./CarouselCoverI";
import ContentType from "./ContentType";

export default interface Carousel<T extends Feed | List | Commerce> {
	CTP: ContentType<T>;
	CIL: T[];
	CHD?: CarouselCoverI;
	CTA?: CarouselCoverI;
}