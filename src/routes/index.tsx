import {createFileRoute, Link} from '@tanstack/react-router'
import {useTranslation} from "react-i18next";
import InfoCards from "@/src/components/InfoCards.tsx";
import EarningOverview from "@/src/components/EarningOverview.tsx";
import GenerateInvitation from "@/src/components/GenerateInvitation.tsx";


const Index = () => {
	const {t} = useTranslation('', {keyPrefix: 'affiliate'})
	return <div className={'w-full h-full p-2 md:p-3 lg:p-4 gap-2 md:gap-3 flex flex-col lg:gap-4'}>
		<InfoCards/>
		<div className={'lg:grid lg:grid-cols-10 gap-6'}>
			<div className={'col-span-6 lg:col-span-6 flex flex-col gap-2 md:gap-3 lg:gap-4'}>
				<EarningOverview/>
				<GenerateInvitation/>
			</div>
			<div className={'lg:col-span-4 flex-grow flex flex-col gap-5 mt-10 lg:mt-0'}>
				{/*<PieChartInfo/>*/}
				{/*<AffiliateConditions/>*/}
			</div>
		</div>
		<div className={'min-h-[500px]'}>hey</div>
		{/*{address !== undefined && <div className={'mt-6'}>*/}
		{/*	<VolumeInfo/>*/}
		{/*	<div className={'flex my-4 flex-row items-center justify-center gap-2 pt-2'}>*/}
		{/*		<Link to={'/linear'} className={'border border-yellow-400 rounded-lg px-4 py-2 text-yellow-400'}>Linear tree</Link>*/}
		{/*		<Link to={'/binary'} className={'border border-yellow-400 rounded-lg px-4 py-2 text-yellow-400'}>Binary tree</Link>*/}
		{/*	</div>*/}
		{/*	<AffiliateClaimTable/>*/}
		{/*</div>}*/}
	</div>
}


export const Route = createFileRoute('/')({
	component: Index,
	errorComponent: () => {
		return <div>error</div>
	}
})