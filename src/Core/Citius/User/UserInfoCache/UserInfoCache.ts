import KeqingBase from "../../../KeqingBase";
import UserInfoCacher from "./UserInfoCacher";

export default class UserInfoCache extends KeqingBase {
	private cachelist: Map<string, UserInfoCacher> = new Map();
	public async GetUserInfo(oid: string, uid: string, cid: string) {
		if (!this.cachelist.has(oid)) this.cachelist.set(oid, new UserInfoCacher(this.Keqing, uid, cid));
		return await this.cachelist.get(oid).Get();
	}
}