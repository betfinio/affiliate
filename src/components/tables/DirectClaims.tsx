import { getColumns } from '@/src/components/tables/columns.tsx';
import { useDirectClaims } from '@/src/lib/query';
import { ZeroAddress } from '@betfinio/abi';
import { DataTable } from 'betfinio_app/DataTable';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

const DirectClaims = () => {
	const { t } = useTranslation('affiliate', { keyPrefix: 'tables' });
	const { address = ZeroAddress } = useAccount();
	const { data: claims = [], isLoading } = useDirectClaims(address);
	return <DataTable columns={getColumns(t)} data={claims} isLoading={isLoading} />;
};

export default DirectClaims;
