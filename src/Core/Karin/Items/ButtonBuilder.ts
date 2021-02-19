import { ButtonFragment, CustomButtonDisplayType } from "node-kakao";
import ItemBuilder from "../Builders/ItemBuilder";
import Button from "./Button";
import Link from "./Link";

export default class ButtonBuilder extends ItemBuilder<ButtonFragment> implements Button {
	BU: { T?: string; SR?: CustomButtonDisplayType; HL?: boolean; } = {};
	L?: Link;
	constructor(title: string, highlight?: boolean, display?: CustomButtonDisplayType, link?: Link) {
		super();
		this.setTitle(title);
		if (highlight) this.setHighlight(highlight);
		if (display) this.setDisplay(display);
		if (link) this.setLink(link);
	}
	setTitle(title: string) { this.BU.T = String(title); return this; }
	setHighlight(bool: boolean) { this.BU.HL = !!bool; return this; }
	setDisplay(type: CustomButtonDisplayType) { this.BU.SR = type; return this; }
	setLink(link: string | Link, mobile?: string, android?: string, ios?: string) { this.L = (link instanceof String) ? { LPC: encodeURI(String(link)), LMO: encodeURI(String(mobile || link)), LCA: encodeURI(String(android || link)), LCI: encodeURI(String(ios || link)) } : link as Link; return this; }
	public Build() { var btf = new ButtonFragment(); btf.readRawContent(this); return btf; }
}