import { ListItemFragment } from "node-kakao";
import ItemBuilder from "../../Builders/ItemBuilder";
import Image from "../../Items/Image";
import Link from "../../Items/Link";
import Text from "../../Items/Text";
import ListItem from "./ListItem";

export default class ListItemBuilder extends ItemBuilder<ListItemFragment> implements ListItem {
	TD: Text;
	L?: Link;
	TH?: Image;

	constructor(text?: Text, link?: Link, image?: Image) {
		super();
		if (text) this.Text(text);
		if (link) this.Link(link);
		if (image) this.Image(image);
	}

	Text(text: Text) { this.TD = text; return this; }
	Link(link: Link) { this.L = link; return this; }
	Image(image: Image) { this.TH = image; return this; }

	Build() { var li = new ListItemFragment(); li.readRawContent(this); return li; }
}