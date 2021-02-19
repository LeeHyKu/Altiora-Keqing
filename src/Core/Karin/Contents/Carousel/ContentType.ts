import { CustomType } from "node-kakao";
import Commerce from "../Commerce/Commerce";
import Feed from "../Feed/Feed";
import List from "../List/List";

type ContentType<T extends Feed | List | Commerce> =
	T extends Feed ? CustomType.FEED :
	T extends List ? CustomType.LIST :
	T extends Commerce ? CustomType.COMMERCE : CustomType.FEED;
export default ContentType;