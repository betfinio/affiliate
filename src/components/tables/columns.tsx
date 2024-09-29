import { ETHSCAN } from '@/src/global.ts';
import type { Claim } from '@/src/lib/types.ts';
import { truncateEthAddress } from '@betfinio/abi';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { BetValue } from 'betfinio_app/BetValue';
import type { TFunction } from 'i18next';
import { DateTime } from 'luxon';

const columnHelper = createColumnHelper<Claim>();

export const getColumns = (t: TFunction<'affiliate', 'tables'>): ColumnDef<Claim, never>[] => {
	return [
		columnHelper.accessor('timestamp', {
			header: t('timestamp'),
			cell: (props) => <div>{DateTime.fromSeconds(props.getValue()).toFormat('DD T')}</div>,
		}),
		columnHelper.accessor('amount', {
			header: t('amount'),
			cell: (props) => (
				<div>
					<BetValue value={props.getValue()} withIcon />
				</div>
			),
		}),
		columnHelper.accessor('transactionHash', {
			header: t('transaction'),
			cell: (props) => (
				<a href={`${ETHSCAN}/tx/${props.getValue()}`} target={'_blank'} rel={'noreferrer'}>
					{truncateEthAddress(props.getValue())}
				</a>
			),
		}),
	];
};
