export default class GomokuVector {
	private _x: number;
	private _y: number;
	public get X() { return this._x; }
	public get Y() { return this._y; }
	public get Max() { return this._max; }
	constructor(x: number, y: number, private _max: number) {
		this._x = Math.max(Math.min(x || 0, this.Max - 1), 0);
		this._y = Math.max(Math.min(y || 0, this.Max - 1), 0);
	}
	public Eqauls(x: number, y: number) { return this.X === x && this.Y === y; }

	public Checkmate(): GomokuVector[][] {
		return [
			new Array(this._max).fill(null).map((n, index) => new GomokuVector(index, this.Y, this.Max)), //가로
			new Array(this._max).fill(null).map((n, index) => new GomokuVector(this.X, index, this.Max)), //세로
			new Array(this._max).fill(null).map((n, index) => { return { x: this.X + this.Y - index, y: index } }).filter(e => e.x >= 0 && e.x < this.Max && e.y >= 0 && e.y < this.Max).map(e => new GomokuVector(e.x, e.y, this.Max)), //대각선(오른쪽 위 -> 왼쪽 아래)
			new Array(this._max).fill(null).map(this.X > this.Y ? (n, i) => { return { x: this.X - this.Y + i, y: i } } : (n, i) => { return { x: i, y: this.Y - this.X + i } }).filter(e => e.x >= 0 && e.x < this._max && e.y >= 0 && e.y < this._max).map(e => new GomokuVector(e.x, e.y, this.Max)) //대각선(왼쪽 위 -> 오른쪽 아래)
		].filter(e => e.length >= 5);
	}
}