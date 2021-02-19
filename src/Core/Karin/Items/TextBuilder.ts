import { TextDescFragment } from "node-kakao";
import ItemBuilder from "../Builders/ItemBuilder";
import Text from "./Text";

export class TextBuilder extends ItemBuilder<TextDescFragment> implements Text {
	T: string = '';
	D?: string;
	constructor(T?: string, D?: string) {
		super();
		if (T) this.setTitle(T);
		if (D) this.setInfo(D);
	}
	setTitle(title: string) { this.T = String(title); return this; }
	setInfo(info: string) { this.D = String(info); return this; }
	public Build() { var tf = new TextDescFragment(); tf.readRawContent(this); return tf; }
}