import { Socket } from "socket.io";
import Keqing from "../Keqing";
import KeqingBase from "../KeqingBase";
import LamyAction from "./LamyAction";
import LamyAuth from "./LamyAuth";
import Packet from "./Packet";

export default class LamyConnection extends KeqingBase {
	private destroy: boolean = false;
	public get Destroy() { return this.destroy; }

	public get Socket() { return this._socket; }
	constructor(keqing: Keqing, private auth: LamyAuth, private _socket: Socket, private events: LamyAction<any>[]) {
		super(keqing);
		for (var event of events) _socket.on(event.eventname, async (arg: Packet<any>) => {
			try { _socket.emit(event.eventname, { id: arg.id, data: await event.Action(arg.data, this) }); }
			catch (e) { this.Qurare.Error(e); }
		});
		_socket.on('disconnect', async () => await this.OnDisconnect());
	}

	public async OnDisconnect() {
		this.Qurare.Focus('Lamy Disconnected');
		this.destroy = true;
	}
}