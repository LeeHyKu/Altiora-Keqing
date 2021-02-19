import Link from "../Items/Link";

export default interface Tailer {
	SID: string, //SERVICE ID; CUSTOM
	DID: string, //DEV ID; CUSTOM
	SNM: string, //TAILER TEXT; DEFAULT
	SIC: string, //TAILER IMAGE; DEFAULT
	SL?: Link, //OPTIONAL
	VA: string, //DEFAULT: 6.0.0
	VI: string, //DEFAULT: 5.9.8
	VW: string, //DEFAULT: 2.5.1
	VM: string, //DEFAULT: 2.2.0
}