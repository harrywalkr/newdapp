import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import clsx from "clsx";

interface Props {
    className?: string
}

const BenefitsTable = ({ className }: Props) => {
    return (
        <ScrollArea className={clsx('', className)}>
            <Table>
                <TableCaption>Benefits comparison between Basic and Premium Users</TableCaption>
                <TableHeader>
                    <TableRow className="border-none">
                        <TableHead className="whitespace-nowrap font-semibold text-base ">Benefits</TableHead>
                        <TableHead className="whitespace-nowrap font-semibold text-base text-center">Basic Users</TableHead>
                        <TableHead className="whitespace-nowrap font-semibold text-base text-center">Premium Users</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className=" [&>*:nth-child(odd)]:bg-brand2/15">
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap w-96 rounded-l-md py-3 ">View Trending Token List</TableCell>
                        <TableCell className="whitespace-nowrap text-center">10 Tokens</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md text-center">Full Access <span>&#10003;</span></TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3 ">Access to All Wallet data</TableCell>
                        <TableCell className="whitespace-nowrap text-center">10 Wallets</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md text-center">Full Access <span>&#10003;</span></TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3 ">Statistical Charts</TableCell>
                        <TableCell className="whitespace-nowrap text-center">3 Charts</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md text-center">Full Access <span>&#10003;</span></TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3 ">Hot tokens watchlist</TableCell>
                        <TableCell className="whitespace-nowrap text-center">10</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md text-center">Full Access <span>&#10003;</span></TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3 ">Customizable Analytics</TableCell>
                        <TableCell className="whitespace-nowrap text-center">❌</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md text-center">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3 ">Advanced Filters</TableCell>
                        <TableCell className="whitespace-nowrap text-center">❌</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md text-center">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3 ">Fee Tracking Bot(Click To See)</TableCell>
                        <TableCell className="whitespace-nowrap text-center">✅</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md text-center">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3 ">Custom Watchlist Notification (Click 2C)</TableCell>
                        <TableCell className="whitespace-nowrap text-center">❌</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md text-center">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3 ">Custom Wallet Notification (Click 2C)</TableCell>
                        <TableCell className="whitespace-nowrap text-center">❌</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md text-center">✅</TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3 ">24/7 Support</TableCell>
                        <TableCell className="whitespace-nowrap text-center">❌</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md text-center">✅</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default BenefitsTable;
