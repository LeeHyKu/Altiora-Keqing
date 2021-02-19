import { CustomButtonStyle } from "node-kakao";
import Button from "../../Items/Button";
import Image from "../../Items/Image";
import Profile from "../../Items/Profile";
import Text from "../../Items/Text";
import CommercePrice from "./CommercePrice";

export default interface Commerce {
	TI: { TD?: Text };
	BUT?: CustomButtonStyle;
	BUL?: Button[];
	THC?: number;
	THL?: Image[];
	PR?: Profile;
	CMC?: CommercePrice;
}