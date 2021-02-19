import { CustomFragment } from "node-kakao";

export default abstract class ItemBuilder<T extends CustomFragment> {
	public abstract Build(): T;
}