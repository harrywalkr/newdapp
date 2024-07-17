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
            <Table >
                <TableCaption>Benefits comparison between Basic and Premium Users</TableCaption>
                <TableHeader>
                    <TableRow className="border-none">
                        <TableHead className="whitespace-nowrap font-semibold text-base">Benefits</TableHead>
                        <TableHead className="whitespace-nowrap font-semibold text-base">Basic Users</TableHead>
                        <TableHead className="whitespace-nowrap font-semibold text-base">Premium Users</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className=" [&>*:nth-child(odd)]:bg-brand2/15">
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap w-96 rounded-l-md py-3">View Trending Token List</TableCell>
                        <TableCell className="whitespace-nowrap">10 Tokens</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md">Full Access <span>&#10003;</span></TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3">Access to All Wallet data</TableCell>
                        <TableCell className="whitespace-nowrap">10 Wallets</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md">Full Access <span>&#10003;</span></TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3">Statistical Charts</TableCell>
                        <TableCell className="whitespace-nowrap">3 Charts</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md">Full Access <span>&#10003;</span></TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3">Statistical Charts</TableCell>
                        <TableCell className="whitespace-nowrap">3 Charts</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md">Full Access <span>&#10003;</span></TableCell>
                    </TableRow>
                    <TableRow className="border-none">
                        <TableCell className="whitespace-nowrap rounded-l-md py-3">Statistical Charts</TableCell>
                        <TableCell className="whitespace-nowrap">3 Charts</TableCell>
                        <TableCell className="whitespace-nowrap rounded-r-md">Full Access <span>&#10003;</span></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default BenefitsTable;
