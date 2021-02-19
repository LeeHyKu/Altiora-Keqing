import { ProfileFragment } from "node-kakao";
import ItemBuilder from "../Builders/ItemBuilder";
import Image from "./Image";
import Link from "./Link";
import Profile from "./Profile";
import Text from "./Text";

export default class ProfileBuilder extends ItemBuilder<ProfileFragment> implements Profile {
	TD?: Text;
	L?: Link;
	BG?: Image;
	TH?: Image;
	constructor(text?: Text, image?: Image, back?: Image, link?: Link) {
		super();
		if (text) this.Title(text);
		if (image) this.Image(image);
		if (back) this.Background(back);
		if (link) this.Link(link);
	}

	Title(text: Text) { this.TD = text; return this; }
	Link(link: Link) { this.L = link; return this; }
	Background(back: Image) { this.BG = back; return this; }
	Image(img: Image) { this.TH = img; return this; }

	public Build() { var pf = new ProfileFragment(); pf.readRawContent(this); return pf; }
}