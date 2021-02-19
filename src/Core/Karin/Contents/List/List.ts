import { CustomButtonStyle } from "node-kakao";
import Button from "../../Items/Button";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";

export default interface List {
	HD?: ListHeader;
	BUT?: CustomButtonStyle;
	BUL?: Button[];
	ITL: ListItem[];
}