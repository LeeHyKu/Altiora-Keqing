import { CustomButtonStyle } from "node-kakao";
import Button from "../../Items/Button";
import Image from "../../Items/Image";
import Link from "../../Items/Link";
import Profile from "../../Items/Profile";
import Text from "../../Items/Text";
import Social from "./Social";

export default interface Feed {
	TI: { TD: Text, L?: Link, FT?: boolean };
	BUT: CustomButtonStyle;
	BUL?: Button[];
	THC?: number;
	THL?: { TH: Image }[];
	SO?: Social;
	PR?: Profile;
	L?: Link;
}