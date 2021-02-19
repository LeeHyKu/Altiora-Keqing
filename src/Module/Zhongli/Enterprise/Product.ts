import { ObjectId } from "mongodb";
import ItemIS from "../../Esther/Venti/ItemIS";

export default interface Product {
	product: ItemIS,
	hash: string, //아이템 해시
	tid: string, //거래코드
	price: number,
	amount: number,
	author: ObjectId
}