import UserComponent from "../../../../Core/Citius/User/UserComponent";
import ChatsPerDay from "../ChatsPerDay";
import KaguraUserRaw from "./KaguraUserRaw";

export default class KaguraUser extends UserComponent<KaguraUserRaw> {
	private _chats: ChatsPerDay[];
	public get Chats() { return this._chats; }
	public get TodayChat() {
		var chat = this.Chats.find(e => e.date.toDateString() === new Date().toDateString());
		if (!chat) { chat = { date: this.Today, index: 0 }; this.Chats.unshift(chat); }
		return chat;
	}
	public get TodayIndex() { return this.TodayChat.index; }
	public get TotalIndex() { return this.Chats.map(e => e.index).reduce((p, n) => p + n); }
	public get WeekIndex() {
		var year = new Date().getFullYear();
		var week = this.Week;
		var filter = this.Chats.filter(e => e.date.getFullYear() === year && this.getWeek(e.date) === week).map(e => e.index);
		return (filter.length < 1 ? [0] : filter).reduce((p, n) => p + n);
	}
	public get MonthIndex() {
		var year = new Date().getFullYear();
		var month = new Date().getMonth();
		var filter = this.Chats.filter(e => e.date.getFullYear() === year && e.date.getMonth() === month).map(e => e.index);
		return (filter.length < 1 ? [0] : filter).reduce((p, n) => p + n);
	}

	public Issue() { this.TodayChat.index++; }

	protected Initialization(): KaguraUserRaw {
		return {
			chats: []
		};
	}
	protected Installation(raw: KaguraUserRaw) {
		this._chats = raw.chats;
	}
	public Raw(): KaguraUserRaw {
		return {
			chats: this._chats
		};
	}

	private get Today() { return new Date(new Date().toDateString()); }
	private get Week() {
		var date = new Date();
		var onejan = new Date(date.getFullYear(), 0, 1);
		return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
	}
	private getWeek(date: Date) {
		var onejan = new Date(date.getFullYear(), 0, 1);
		return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
	}
}