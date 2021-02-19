import { CustomButtonStyle, CustomListContent, CustomType } from "node-kakao";
import ContentBuilder from "../../Builders/ContentBuilder";
import Button from "../../Items/Button";
import TailerEx from "../../Tail/TailerEx";
import List from "./List";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";

export default class ListBuilder extends ContentBuilder<CustomListContent> implements List {
	public readonly CType = CustomType.LIST;

	HD?: ListHeader;
	BUT?: CustomButtonStyle;
	BUL: Button[] = [];
	ITL: ListItem[] = [];

	constructor(tail: TailerEx, head?: ListHeader, listitem?: ListItem[], button?: Button[], buttonstyle?: CustomButtonStyle) {
		super(tail);

		if (head) this.Head(head);
		if (listitem) this.Item(...listitem);
		if (button) this.Button(...button);
		if (buttonstyle) this.ButtonStyle(buttonstyle);
	}

	Head(head: ListHeader) { this.HD = head; return this; }
	Item(...items: ListItem[]) { this.ITL.push(...items); return this; }
	Button(...buttons: Button[]) { this.BUL.push(...buttons); return this; }
	ButtonStyle(style: CustomButtonStyle) { this.BUT = style; return this; }
	get Length() { return this.ITL.length; }

	Build(): CustomListContent { var li = new CustomListContent(); li.readRawContent(this); return li; }
}