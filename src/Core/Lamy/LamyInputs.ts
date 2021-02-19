export default interface LamyInputs {
	[packet: string]: { inbound: any, outbound: any };

	channels: { inbound: any, outbound: {  }[] };
}