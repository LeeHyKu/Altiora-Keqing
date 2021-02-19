import { URLFragment } from "node-kakao";
import ItemBuilder from "../Builders/ItemBuilder";
import Link from "./Link";

export default class LinkBuilder extends ItemBuilder<URLFragment> implements Link {
	LPC: string = '';
	LMO?: string;
	LCA?: string;
	LCI?: string;
	constructor(pc?: string, mobile?: string, android?: string, ios?: string) {
		super();
		if (pc) this.setPC(pc);
		if (mobile) this.setMobile(mobile);
		if (android) this.setAndroid(android);
		if (ios) this.setIos(ios);
	}
	setPC(url: string) { this.LPC = encodeURI(String(url)); return this; }
	setMobile(url: string) { this.LMO = encodeURI(String(url)); return this; }
	setAndroid(url: string) { this.LCA = encodeURI(String(url)); return this; }
	setIos(url: string) { this.LCI = encodeURI(String(url)); return this; }
	public Build() { var uf = new URLFragment(); uf.readRawContent(this); return uf; }
}