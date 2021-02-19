import { Chat, ChatChannel } from "node-kakao";

export default abstract class ChatCacher<T, D, M> {
	private _priority: T[] = [];
	private _cache: T[] = [];
	private _low: T[] = [];
	public Attach(...args: T[]) { this._cache.push(...args); }
	public Merge(): null | D | M {
		var raw = [...this._priority, ...this._cache, ...this._low];
		if (raw.length == 0) return null;
		else if (raw.length == 1) return this.Direct(raw[0]);
		else this.Reduce(raw);
	}
	protected abstract Direct(raw: T): D;
	protected abstract Reduce(raw: T[]): M;
	public abstract SendChannel(channel: ChatChannel): Promise<Chat>;
}