import NakiriStatus from "./NakiriStatus";

export default interface NakiriResult<T> {
	status: NakiriStatus;
	result?: T;
}