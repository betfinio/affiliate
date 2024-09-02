import MemberInput from '@/src/components/MemberInput.tsx';
import MintModal from '@/src/components/MintModal.tsx';
import { useInviteCondition, useMember } from '@/src/lib/query';
import { BetValue } from 'betfinio_app/BetValue';
import { Button } from 'betfinio_app/button';
import { getAcademyUrl, getStakingUrl } from 'betfinio_app/lib';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'betfinio_app/tabs';
import { toast } from 'betfinio_app/use-toast';
import cx from 'clsx';
import { CircleHelp, Link2Icon } from 'lucide-react';
import { type FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

const GenerateInvitation: FC = () => {
	const { t } = useTranslation('', { keyPrefix: 'affiliate.generate' });
	const { address: account } = useAccount();
	const { data: member } = useMember(account);
	const [address, setAddress] = useState('');
	const [parent, setParent] = useState<Address>('' as Address);

	const [openModal, setOpenModal] = useState(false);

	const handleLink = async () => {
		const code = account + (parent || account);
		await navigator.clipboard.writeText(`${window.origin}/?code=${code}`);
		toast({
			title: 'Link copied',
			description: 'The invitation link has been copied to your clipboard',
			variant: 'default',
		});
	};
	const handleAcademyLink = async () => {
		const code = account + (parent || account);
		await navigator.clipboard.writeText(`${getAcademyUrl('/new')}/?code=${code}`);
		toast({
			title: 'Link copied',
			description: 'The invitation link has been copied to your clipboard',
			variant: 'default',
		});
	};
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleUploadClick = () => {
		inputRef.current?.click();
	};

	const handleFileChange = () => {
		console.log('uploaded');
		toast({
			title: 'Not supported',
			description: 'This feature is not yet supported',
			variant: 'soon',
		});
	};

	const handleGenerate = () => {
		setOpenModal(true);
	};
	const handleClose = () => {
		setOpenModal(false);
	};
	return (
		<div className={'grow w-full flex items-end'}>
			<div className={cx('w-full relative')}>
				{((member && !member.is.inviting) || !account) && <StakeRequired />}
				<a
					target="_blank"
					href={'https://betfin.gitbook.io/betfin-public/v/affiliate-manual/affiliate-explanation/binary-tree-and-matching-bonus'}
					rel="noreferrer"
				>
					<CircleHelp className={'absolute top-4 right-4 w-5 h-5'} />
				</a>
				<div className={cx('rounded-lg border md:border-2 h-full border-yellow-400 p-3 md:p-7 md:pt-5 pb-5 ', member && !member.is.inviting && 'blur-md')}>
					<div className={'flex justify-between items-start'}>
						<div className={' font-semibold'}>
							<div className={'text-sm'}>{t('title')}</div>
						</div>
						<input type="file" ref={inputRef} onChange={handleFileChange} style={{ display: 'none' }} />
					</div>
					<Tabs defaultValue={'auto'}>
						<TabsList>
							<TabsTrigger value={'auto'}>Auto position</TabsTrigger>
							<TabsTrigger value={'manual'}>Manual position</TabsTrigger>
						</TabsList>
						<TabsContent value={'manual'} className={'flex flex-col gap-2 mt-1'}>
							<div className={'text-xs'}>Address of new user:</div>
							<input
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								placeholder={'New member address: 0x...'}
								className={'px-2 md:px-4 py-2 border bg-primary h-[40px] rounded-lg border-gray-400 flex justify-center items-center col-span-5 xl:col-span-3'}
							/>
							<div className={'text-xs'}>Parent of new user in Binary tree:</div>
							<MemberInput value={parent} onChange={setParent} />
							<div className={'flex flex-row items-center justify-end gap-2 w-full'}>
								<Button onClick={handleGenerate} className={'px-4 py-3 flex justify-center items-center w-1/2'}>
									{t('generate')}
								</Button>
								<Button variant={'outline'} onClick={handleLink} className={'flex-grow px-4 gap-2 flex justify-center items-center whitespace-nowrap '}>
									<Link2Icon className={'w-3 h-3'} />
									{t('create')}
								</Button>
								<Button variant={'outline'} onClick={handleAcademyLink} className={'flex-grow px-4 gap-2 flex justify-center items-center whitespace-nowrap '}>
									<Link2Icon className={'w-3 h-3'} />
									{t('academy_link')}
								</Button>
							</div>
						</TabsContent>
						<TabsContent value={'auto'} className={'flex gap-2 flex-col mt-0'}>
							<div className={'text-xs'}>Address of new user:</div>
							<input
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								placeholder={'New member address: 0x...'}
								className={'px-2 md:px-4 py-2 border bg-primary h-[40px] rounded-lg border-gray-400 flex justify-center items-center w-full '}
							/>
							<div className={'flex flex-row items-center justify-end gap-2 w-full'}>
								<Button onClick={handleGenerate} className={'px-4 py-3 flex justify-center items-center w-1/2'}>
									{t('generate')}
								</Button>
								<Button variant={'outline'} onClick={handleLink} className={'flex-grow px-4 gap-2 flex justify-center items-center whitespace-nowrap '}>
									<Link2Icon className={'w-3 h-3'} />
									{t('create')}
								</Button>
								<Button variant={'outline'} onClick={handleAcademyLink} className={'flex-grow px-4 gap-2 flex justify-center items-center whitespace-nowrap '}>
									<Link2Icon className={'w-3 h-3'} />
									{t('academy_link')}
								</Button>
							</div>
						</TabsContent>
					</Tabs>
					<Button
						variant={'secondary'}
						onClick={handleUploadClick}
						className={cx('text-xs mt-1 text-white rounded-lg h-[8px] bg-transparent px-0 flex flex-row gap-1 cursor-pointer')}
					>
						<span className={'text-yellow-400'}>+</span> Upload invitation CSV
					</Button>
				</div>
			</div>
			{openModal && <MintModal open={openModal} onClose={handleClose} initialMembers={[{ address: address as Address, parent: parent || account }]} />}
		</div>
	);
};

const StakeRequired = () => {
	const { data = 0n } = useInviteCondition();
	return (
		<div className={cx('absolute font-medium flex flex-col items-center w-full z-[6] gap-2 justify-center h-full backdrop-blur-sm')}>
			<div className={'font-semibold flex flex-row gap-1'}>
				Stake at least <BetValue value={data} withIcon /> to invite others.
			</div>
			<a href={getStakingUrl()} className={'text-white bg-green-500 px-4 py-2 rounded-lg w-[100px] text-center'}>
				Stake
			</a>
		</div>
	);
};

export default GenerateInvitation;
