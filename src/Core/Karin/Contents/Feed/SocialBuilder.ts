import { SocialFragment } from "node-kakao";
import ItemBuilder from "../../Builders/ItemBuilder";
import Social from "./Social";

export default class SocialBuilder extends ItemBuilder<SocialFragment> implements Social {
	LK?: number;
	CM?: number;
	SH?: number;
	VC?: number;
	SB?: number;
	constructor(like?: number, comment?: number, share?: number, view?: number, subscriber?: number) {
		super();
		if (like) this.Like(like);
		if (comment) this.Comment(comment);
		if (share) this.Share(share);
		if (view) this.View(view);
		if (subscriber) this.Subscriber(subscriber);
	}
	Like(am: number) { this.LK = am; return this; }
	Comment(am: number) { this.CM = am; return this; }
	Share(am: number) { this.SH = am; return this; }
	View(am: number) { this.VC = am; return this; }
	Subscriber(am: number) { this.SB = am; return this; }

	public Build() { var sf = new SocialFragment(); sf.readRawContent(this); return sf; }
}