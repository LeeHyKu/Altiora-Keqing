import Keqing from "../../Keqing";
import KeqingBase from "../../KeqingBase";
import Event from "./Event";
import EventC from "./EventC";
import Kevents from "./Kevents";

export default abstract class EventHandler<T extends keyof Kevents & string> extends KeqingBase {
	constructor(base: Keqing, _eventname: T) { super(base); this.Client.on(_eventname, (...args: Kevents[T]) => this.Execute(args)); }

	private _events: Event<T>[] = [];
	public Attach(...events: Event<T>[]) { this._events.push(...events); }
	public AttachRaw(...events: EventC<T, Event<T>>[]) { this._events.push(...events.map(e => new e(this.Keqing))); }

	public async Execute(args: Kevents[T]) {
		for (var event of this._events) {
			try { await event.Execute(...args); }
			catch (e) { this.Qurare.Error(e); }
		}
	}
}