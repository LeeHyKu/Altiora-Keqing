import Gravity from "../Qurare/Gravity";
import QurareMember from "../Qurare/QurareMember";

export default interface LamyBroadcasts {
	[packet: string]: any;

	logs: { gravity: Gravity, time: string, logstr: string };
}