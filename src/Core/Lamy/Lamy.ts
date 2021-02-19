import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";
import { Collection } from "mongodb";
import KeqingBase from "../KeqingBase";
import LamyAccount from "./LamyAccount";
import LamyConnection from "./LamyConnection";
import LamyAction from "./LamyAction";
import bodyParser = require("body-parser");
import { createHash } from "crypto";
import LamyAuth from "./LamyAuth";
import LamyBroadcasts from "./LamyBroadcasts";

const port = '6974';

export default class Lamy extends KeqingBase {
	private http: http.Server;
	private io: socketio.Server;
	public get Http() { return this.http; }
	public get Io() { return this.io; }

	private events: LamyAction<any>[] = [];
	public Attach(...events: LamyAction<any>[]) { this.events.push(...events); }
	private auths: LamyAuth[] = [];
	private conns: LamyConnection[] = [];
	public get Connections() { return this.conns.filter(e => !e.Destroy); }
	public async Broadcast<T extends keyof LamyBroadcasts & string>(name: T, arg: LamyBroadcasts[T]) { for (var conn of this.Connections) { conn.Socket.emit(name, arg); } }

	public async Ignition() {
		this.collection = this.Citius.GetTable('LamyAccount');

		this.http = http.createServer(express()
			.set('port', port)
			.use((req, res, next) => {
				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Credentials', 'true');
				res.header(
					"Access-Control-Allow-Headers",
					"Origin, X-Requested-With, Content-Type, Accept, Authorization"
				);
				if (req.method === 'OPTIONS') {
					res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
					return res.status(200).json({});
				}
				next();
			})
			.use(bodyParser.json())
			.post('/login', async (req, res) => {
				try {
					console.log('/login');

					var info = await this.GetInfo(req.body['id'], req.body['pw']);
					if (!info) {
						res.send('');
						res.status(403);
					}
					else {
						var auth: LamyAuth = { oid: info._id, email: info.userid, token: this.Makeid(10) };
						this.auths.push(auth);
						res.send(auth.token);
						res.status(200);
					}
				}
				catch (e) {
					res.send('');
					res.status(500);
				}
			})
			.post('/logout', (req, res) => {
				try {
					res.send({});
					res.status(200);
				}
				catch (e) {
					res.send(e);
					res.status(500);
				}
			})
		);
		this.io = new socketio.Server(this.http).on('connection', async (socket: socketio.Socket) => await this.OnConnection(socket));

		this.http.listen(port);
	}

	public async OnConnection(socket: socketio.Socket) {
		this.Qurare.Focus('Lamy Connection');
		try {
			var token = await this.EmitAwait<string>(socket, 'auth', null, 5000);

			if (!this.auths.some(e => e.token === token)) socket.disconnect();
			else this.conns.push(new LamyConnection(this.Keqing, this.auths.splice(this.auths.findIndex(e => e.token === token), 1)[0], socket, this.events));
		}
		catch { socket.disconnect(); }
	}

	private EmitAwait<T>(socket: socketio.Socket, pname: string, arg: any, timeout: number): Promise<T> {
		return new Promise<T>((s, r) => {
			socket.once(pname, s);
			socket.emit(pname, arg);
			setTimeout(r, timeout);
		});
	}
	private Makeid(length: number) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	private collection: Collection<LamyAccount>;
	private async GetInfo(id: string, password: string) { return await this.collection.findOne({ userid: id, password: createHash('sha256').update(password).digest('base64') }); }
}