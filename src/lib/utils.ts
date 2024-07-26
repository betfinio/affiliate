import {TreeMember} from "betfinio_app/lib/types";
import {ZeroAddress} from "@betfinio/abi";

export const getSide = (id: bigint, parent: bigint): 'left' | 'right' | null => {
	if (id === 0n) return null;
	let tmp = id;
	while (tmp !== 0n) {
		if (parent * 2n + 1n === tmp) return 'left';
		if (parent * 2n + 2n === tmp) return 'right';
		if (tmp % 2n === 0n) tmp = (tmp - 2n) / 2n;
		else tmp = (tmp - 1n) / 2n;
	}
	return null;
}

export const getLevel = (id: bigint, parent: bigint): number => {
	if (id === 0n) return 0;
	let tmp = id;
	let lvl = 1;
	while (tmp !== 0n) {
		if (parent * 2n + 1n === tmp) return lvl;
		if (parent * 2n + 2n === tmp) return lvl;
		if (tmp % 2n === 0n) tmp = (tmp - 2n) / 2n;
		else tmp = (tmp - 1n) / 2n;
		lvl++;
	}
	return lvl;
}


export const defaultTreeMember: TreeMember = {
	member: ZeroAddress,
	inviter: ZeroAddress,
	parent: ZeroAddress,
	left: ZeroAddress,
	right: ZeroAddress,
	isMatching: false,
	isInviting: false,
	volumeLeft: 0n,
	volumeRight: 0n,
	betsLeft: 0n,
	betsRight: 0n,
	matchedLeft: 0n,
	matchedRight: 0n,
	countLeft: 0n,
	countRight: 0n,
	count: 0,
	volume: 0n,
	bets: 0n,
}