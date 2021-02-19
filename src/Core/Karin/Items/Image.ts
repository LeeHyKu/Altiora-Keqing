import { CustomImageCropStyle } from "node-kakao";

export default interface Image {
	THU: string,
	W: number,
	H: number,
	SC?: CustomImageCropStyle,
	LI?: boolean,
	PT?: number
}