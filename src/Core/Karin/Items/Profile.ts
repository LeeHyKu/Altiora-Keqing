import Image from "./Image";
import Link from "./Link";
import Text from "./Text";

export default interface Profile {
	TD?: Text;
	L?: Link;
	BG?: Image; //not used
	TH?: Image;
}