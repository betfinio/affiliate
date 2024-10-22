import type { Address } from 'viem';

export interface MemberWithUsername {
	member: Address;
	username?: string;
	isCustom?: boolean;
}

export interface TableMember {
	side: 'left' | 'right';
	level: number;
	category: 'inviting' | 'matching' | 'active' | 'inactive';
	activity: ('betting' | 'staking')[];
	id: bigint;
	inviter_id: bigint;
	member: Address;
	inviter: Address;
	betting: bigint;
	staking: bigint;
	staking_volume: bigint;
	betting_volume: bigint;
	total_volume: bigint;
	username: string | null;
	direct_count: bigint;
	binary_count: bigint;
}

export interface Claim {
	member: Address;
	amount: bigint;
	transactionHash: Address;
	timestamp: number;
}
