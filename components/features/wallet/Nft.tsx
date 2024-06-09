import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Image from "next/image";
import { isPaidMember } from '@/services/auth.service';
import Copy from "@/components/ui/copy";
import { minifyContract } from "@/utils/truncate";

dayjs.extend(relativeTime);

interface NFT {
    Currency: {
        Name: string;
        SmartContract: string;
    };
    ImageURLFromMetadata?: string;
    amount: number;
}

interface Props {
    walletAddress: string
}

export default function WalletNFTHolding({ walletAddress }: Props) {
    const [NFTs, setNFTs] = useState<NFT[][]>([]);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(false);
    const [paidMember, setPaidMember] = useState(false);
    const [loadingPaidMember, setLoadingPaidMember] = useState(true);
    const router = useRouter();

    useEffect(() => {
        isPaidMember().then((result) => {
            setPaidMember(result);
            setLoadingPaidMember(false);
        });
    }, []);

    useEffect(() => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 6);
        const controller = new AbortController();

        fetch(`https://onchain.dextrading.com/nftHolding?limit=100&network=eth&address=${walletAddress}&from=${from.toISOString()}&til=${to.toISOString()}`,
            { signal: controller.signal })
            .then((res) => res.json())
            .then((json) => {
                const data = json.filter((j: NFT) => j.amount > 0);
                const uniqueContracts = Array.from(new Set(data.map((d: any) => d.Currency.SmartContract)));
                const nftGroups = uniqueContracts.map((contract) => data.filter((d: any) => d.Currency.SmartContract === contract));
                setNFTs(nftGroups);
            })
            .finally(() => setLoading(false));

        return () => {
            controller.abort();
        };
    }, []);

    if (loadingPaidMember) {
        return <div>Checking membership status...</div>;
    }

    if (loading) {
        return (
            <div className="w-full h-[350px] flex justify-center items-center">
                <span className="loading loading-bars loading-md">loading ...</span>
            </div>
        );
    }

    if (!paidMember) {
        return <div className="w-full h-[350px] flex justify-center items-center">You need to be a paid member to view this content.</div>;
    }

    return (
        <div className="relative flex flex-col gap-5 mt-5">
            <h2 className="text-2xl font-bold">NFT Holdings</h2>
            {NFTs.length ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {(showMore ? NFTs : NFTs.slice(0, 6)).map((nftGroup, idx) => (
                        <Card key={idx} nft={nftGroup} />
                    ))}
                </div>
            ) : (
                <p className="px-4 font-medium text-lg opacity-50">No Activity in NFT</p>
            )}
            {!showMore && NFTs.length > 6 && (
                <div
                    className="absolute flex justify-center items-center w-full bg-gradient-to-t from-base-300 to-base-300/50 py-8"
                    style={{ bottom: "-10px", left: 0, right: 0 }}
                >
                    <button
                        onClick={() => setShowMore(true)}
                        className="btn btn-neutral btn-block lg:btn-wide self-center"
                    >
                        Show More
                    </button>
                </div>
            )}
        </div>
    );
}

const Card = ({ nft }: { nft: NFT[] }) => {
    const count = nft.length;

    return (
        <div className="bg-base-200/70 p-4 rounded-lg gap-5 min-w-[200px] shadow-lg">
            <div className="flex flex-col gap-5">
                <h2 className="text-xl font-medium">{nft[0].Currency.Name || "-"}</h2>
                <div className="flex flex-wrap gap-2">
                    {nft.slice(0, 4).map((n, idx) => (
                        <div key={idx} className="avatar">
                            <div className="mask mask-squircle w-16 h-16">
                                {n.ImageURLFromMetadata ? (
                                    <Image
                                        width={56}
                                        height={56}
                                        src={n.ImageURLFromMetadata}
                                        alt={n.Currency.Name}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="flex justify-center items-center w-16 h-16 font-bold text-base border border-base-content rounded-full opacity-30">
                                        {n.Currency.Name.charAt(0) || "-"}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {count > 4 && (
                        <div className="relative -l-12 flex justify-center items-center w-16 h-16 font-medium text-sm border border-base-content rounded-full opacity-30 bg-base-100">
                            <span className="text-center whitespace-nowrap">+{count - 4} Item</span>
                        </div>
                    )}
                </div>
                <div className="flex space-x-2 items-center">
                    <h3 className="text-md font-medium opacity-40">{minifyContract(nft[0].Currency.SmartContract)}</h3>
                    <Copy text={nft[0].Currency.SmartContract} />
                </div>
            </div>
        </div>
    );
};
