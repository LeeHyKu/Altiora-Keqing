import { CustomButtonStyle, CustomFeedContent, CustomType } from "node-kakao";
import ContentBuilder from "../../Builders/ContentBuilder";
import Button from "../../Items/Button";
import Image from "../../Items/Image";
import Link from "../../Items/Link";
import Profile from "../../Items/Profile";
import Text from "../../Items/Text";
import TailerEx from "../../Tail/TailerEx";
import Feed from "./Feed";
import Social from "./Social";

export default class FeedBuilder extends ContentBuilder<CustomFeedContent> implements Feed {
	public readonly CType = CustomType.FEED;

	TI: { TD: Text, L?: Link, FT?: boolean } = { TD: null };
	BUT: CustomButtonStyle;
	BUL?: Button[] = [];
	THC?: number;
	THL?: { TH: Image }[] = [];
	SO?: Social;
	PR?: Profile;
	L?: Link;

	constructor(tail: TailerEx, text?: Text, textlink?: Link, fulltext?: boolean, buttonstyle?: CustomButtonStyle, buttons?: Button[], thumbextra?: number, images?: Image[], social?: Social, profile?: Profile, link?: Link) {
		super(tail);
		if (text) this.Text(text);
		if (textlink) this.TextLink(textlink);
		if (fulltext) this.TextFull(fulltext);
		if (buttonstyle) this.ButtonStyle(buttonstyle);
		if (buttons) this.Button(...buttons);
		if (thumbextra) this.ThumbnailCount(thumbextra);
		if (images) this.Image(...images);
		if (profile) this.Profile(profile);
		if (social) this.Social(social);
		if (link) this.Link(link);
	}

	Text(text: Text) { this.TI.TD = text; return this; }
	TextLink(link: Link) { this.TI.L = link; return this; }
	TextFull(bool: boolean) { this.TI.FT = bool; return this; }
	ButtonStyle(style: CustomButtonStyle) { this.BUT = style; return this; }
	Button(...buttons: Button[]) { this.BUL.push(...buttons); return this; }
	ThumbnailCount(num: number) { this.THC = num; return this; }
	Image(...images: Image[]) { this.THL.push(...images.map(e => { return { TH: e } })); return this; }
	Social(soc: Social) { this.SO = soc; return this; }
	Profile(pr: Profile) { this.PR = pr; return this; }
	Link(link: Link) { this.L = link; return this; }

	Build() {
		var feed = new CustomFeedContent();
		feed.readRawContent(this);
		return feed;
	}
}