import { CustomImageCropStyle, ImageFragment } from "node-kakao";
import ItemBuilder from "../Builders/ItemBuilder";
import Image from "./Image";

export default class ImageBuilder extends ItemBuilder<ImageFragment> implements Image {
	THU: string;
	W: number;
	H: number;
	SC?: CustomImageCropStyle;
	LI?: boolean;
	PT?: number;
	constructor(url?: string, width?: number, height?: number, cropstyle?: CustomImageCropStyle, isLive?: boolean, playtime?: number) {
		super();
		if (url) this.setUrl(url);
		if (width) this.setWidth(width);
		if (height) this.setHeight(height);
		if (cropstyle) this.setStyle(cropstyle);
		if (isLive) this.setLive(isLive);
		if (playtime) this.setPlayTime(playtime);
	}
	setUrl(url: string) { this.THU = encodeURI(String(url)); return this; }
	setSize(W: number, H: number) { this.setWidth(W); this.setHeight(H); return this; }
	setWidth(W: number) { this.W = Number(W); return this; }
	setHeight(H: number) { this.H = Number(H); return this; }
	setStyle(style: CustomImageCropStyle) { this.SC = style; return this; }
	setLive(bool: boolean) { this.LI = !!bool; return this; }
	setPlayTime(time: number) { this.PT = Number(time); return this; }
	public Build(): ImageFragment { var igf = new ImageFragment(); igf.readRawContent(this); return igf; }
}