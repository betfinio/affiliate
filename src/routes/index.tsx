import {createFileRoute, Link} from '@tanstack/react-router'
import InfoCards from "@/src/components/InfoCards.tsx";
import EarningOverview from "@/src/components/EarningOverview.tsx";
import GenerateInvitation from "@/src/components/GenerateInvitation.tsx";
import PieChartInfo from "@/src/components/PieChartInfo.tsx";
import Conditions from "@/src/components/Conditions.tsx";
import {useAccount} from "wagmi";
import VolumeInfo from "@/src/components/VolumeInfo.tsx";
import TablesWrapper from "@/src/components/TablesWrapper.tsx";


const Index = () => {
	const {address} = useAccount()
	return <div className={'w-full h-full p-2 md:p-3 lg:p-4 gap-2 md:gap-3 flex flex-col lg:gap-4'}>
		<InfoCards/>
		<div className={'lg:grid lg:grid-cols-10 gap-4'}>
			<div className={'col-span-6 lg:col-span-6 flex flex-col gap-2 md:gap-3 lg:gap-4'}>
				<EarningOverview/>
				<GenerateInvitation/>
			</div>
			<div className={'lg:col-span-4 flex-grow flex flex-col gap-2 md:gap-3 lg:gap-4 lg:mt-0'}>
				<PieChartInfo/>
				<Conditions/>
			</div>
		</div>
		{address && <div className={'mt-6'}>
			<VolumeInfo/>
			<TablesWrapper/>
		</div>}
	</div>
}


export const Route = createFileRoute('/')({
	component: Index,
})