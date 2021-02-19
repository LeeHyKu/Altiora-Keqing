export default interface Packet<T> {
	id: string;
	data: T;
}