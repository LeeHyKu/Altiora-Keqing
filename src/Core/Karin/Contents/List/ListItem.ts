import Image from "../../Items/Image";
import Link from "../../Items/Link";
import Text from "../../Items/Text";

export default interface ListItem {
	TD?: Text;
	L?: Link;
	TH?: Image;
}