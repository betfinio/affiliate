import {useAccount} from "wagmi";
import {FC, useRef, useState} from "react";
import cx from "clsx";
import {useTranslation} from "react-i18next";
import {ZeroAddress} from "@betfinio/abi";
import {useInviteCondition, useMember} from "@/src/lib/query";
import {getStakingUrl} from "betfinio_app/lib";
import MemberInput from "@/src/components/MemberInput.tsx";
import {BetValue} from "betfinio_app/BetValue";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "betfinio_app/tabs";
import {Button} from "betfinio_app/button";
import {Link2Icon} from "lucide-react";

const GenerateInvitation: FC<{ parent?: string, hideCsv?: boolean }> = ({parent: sParent, hideCsv = false}) => {
	const {t} = useTranslation('', {keyPrefix: "affiliate.generate"})
	const {t: errors} = useTranslation('', {keyPrefix: "errors"})
	const {address: account = ZeroAddress} = useAccount()
	const {data: member, isFetched: memberIsFetched} = useMember(account)
	const [address, setAddress] = useState('')
	const [generating, setGenerating] = useState(false)
	const [parent, setParent] = useState<string>(sParent || "");
	
	const handleLink = async () => {
		const code = account! + (parent || account!)
		await navigator.clipboard.writeText(window.origin + "/?code=" + code)
	}
	const inputRef = useRef<HTMLInputElement | null>(null);
	
	const handleUploadClick = () => {
		inputRef.current?.click();
	};
	
	const handleFileChange = () => {
		console.log('uploaded')
	}
	
	const handleGenerate = () => {
		console.log('generate')
	}
	
	return (<div className={'grow w-full flex items-end'}>
			<div className={cx('w-full  relative', {'blur-md animate-pulse': !memberIsFetched})}>
				{member && !member.is.inviting && <StakeRequired/>}
				<div className={cx('rounded-lg border md:border-2 h-full border-yellow-400 p-3 md:p-7 md:pt-5 pb-5 ', member && !member.is.inviting && "blur-md")}>
					<div className={'flex justify-between items-start'}>
						<div className={' font-semibold'}>
							<div className={'text-sm'}>{t('title')}</div>
						</div>
						<input
							type="file"
							ref={inputRef}
							onChange={handleFileChange}
							style={{display: 'none'}}
						/>
					</div>
					<Tabs defaultValue={'manual'}>
						<TabsList>
							<TabsTrigger value={'auto'}>Auto position</TabsTrigger>
							<TabsTrigger value={'manual'}>Manual position</TabsTrigger>
						</TabsList>
						<TabsContent value={'manual'}>
							<MemberInput/>
						</TabsContent>
					</Tabs>
					<div className={' mt-2 md:mt-3 gap-3 font-semibold text-sm grid grid-cols-5 pb-2 relative'}>
						<input value={address} onChange={(e) => setAddress(e.target.value)}
						       placeholder={"New member address: 0x..."}
						       className={'px-2 md:px-4 py-2 border bg-primary h-[40px] rounded-lg border-gray-400 flex justify-center items-center col-span-5 sm:col-span-3'}/>
						<div className={'col-span-5 sm:col-span-2 grid grid-cols-2 gap-2 '}>
							<Button onClick={handleGenerate} disabled={generating}
							        className={'grid-cols-1 px-6 py-3 flex justify-center items-center '}>
								{t('generate')}
							</Button>
							<Button variant={'outline'} onClick={handleLink} className={'grid-cols-1 px-0 gap-2 flex justify-center items-center  whitespace-nowrap'}>
								<Link2Icon  className={'w-3 h-3'}/>
								{t('create')}
							</Button>
						</div>
					</div>
					<div onClick={handleUploadClick}
					     className={cx('text-xs mt-1 text-white rounded-lg h-[8px] cursor-pointer', hideCsv && "!hidden")}>
						<span className={'text-yellow-400'}>+</span> Upload invitation CSV
					</div>
				</div>
			</div>
		</div>
	
	);
};

const StakeRequired = () => {
	const {data = 0n} = useInviteCondition();
	return <div className={cx("absolute font-medium flex flex-col items-center w-full z-[6] gap-2 justify-center h-full")}>
		<div className={'font-semibold flex flex-row gap-1'}>Stake at least <BetValue value={data} withIcon/> to invite others.</div>
		<a href={getStakingUrl()} className={'text-white bg-green-500 px-4 py-2 rounded-lg w-[100px] text-center'}>Stake</a>
	</div>
}


export default GenerateInvitation;