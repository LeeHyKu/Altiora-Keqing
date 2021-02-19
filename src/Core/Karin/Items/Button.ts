import { CustomButtonDisplayType } from "node-kakao";
import Link from "./Link";

export default interface Button {
	BU: {
		T?: string,
		SR?: CustomButtonDisplayType,
		HL?: boolean
	},
	L?: Link
}