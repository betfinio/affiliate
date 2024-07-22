import {Address} from "viem";

export interface MemberWithUsername {
	member: Address,
	username?: string
}