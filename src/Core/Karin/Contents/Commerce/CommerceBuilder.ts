import { CustomButtonStyle, CustomCommerceContent, CustomType } from "node-kakao";
import ContentBuilder from "../../Builders/ContentBuilder";
import Button from "../../Items/Button";
import Image from "../../Items/Image";
import Profile from "../../Items/Profile";
import Text from "../../Items/Text";
import TailerEx from "../../Tail/TailerEx";
import Commerce from "./Commerce";
import CommercePrice from "./CommercePrice";

export default class CommerceBuilder extends ContentBuilder<CustomCommerceContent> implements Commerce {
	public readonly CType = CustomType.COMMERCE;

	TI: { TD?: Text; } = {};
	BUT: CustomButtonStyle = CustomButtonStyle.VERTICAL;
	BUL: Button[] = [];
	THC: number = 0;
	THL: Image[] = [];
	PR?: Profile;
	CMC?: CommercePrice;

	constructor(tail: TailerEx, text?: Text, style?: CustomButtonStyle, button?: Button[], count?: number, image?: Image[], profile?: Profile, price?: CommercePrice) {
		super(tail);

		if (text) this.Text(text);
		if (style) this.ButtonStyle(style);
		if (button) this.Button(...button);
		if (count) this.ThumbnailExtraCount(count);
		if (image) this.Thumbnail(...image);
		if (profile) this.Profile(profile);
		if (price) this.Price(price);
	}

	Text(text: Text) { this.TI.TD = text; return this; }
	ButtonStyle(style: CustomButtonStyle) { this.BUT = style; return this; }
	Button(...buttons: Button[]) { this.BUL.push(...buttons); return this; }
	ThumbnailExtraCount(num: number) { this.THC = num; return this; }
	Thumbnail(...images: Image[]) { this.THL.push(...images); return this; }
	Profile(profile: Profile) { this.PR = profile; return this; }
	Price(price: CommercePrice) { this.CMC = price; return this; }

	Build() { var cc = new CustomCommerceContent(); cc.readRawContent(this); return cc; }
}