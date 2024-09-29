import DirectClaims from '@/src/components/tables/DirectClaims.tsx';
import MatchingClaims from '@/src/components/tables/MatchingClaims.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'betfinio_app/tabs';
import { useTranslation } from 'react-i18next';

const ClaimTables = () => {
	const { t } = useTranslation('affiliate', { keyPrefix: 'tables' });
	return (
		<Tabs defaultValue={'direct'}>
			<TabsList>
				<TabsTrigger value={'direct'}>{t('tabs.direct')}</TabsTrigger>
				<TabsTrigger value={'matching'}>{t('tabs.matching')}</TabsTrigger>
			</TabsList>
			<TabsContent value={'direct'}>
				<DirectClaims />
			</TabsContent>
			<TabsContent value={'matching'}>
				<MatchingClaims />
			</TabsContent>
		</Tabs>
	);
};

export default ClaimTables;
