import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { WalletType } from "@/types/Wallet.type";
import { Input } from "@/components/ui/input";

interface Props {
    wallet: WalletType[];
    onSearch: (wallet: WalletType[]) => void;
}
function Search({ wallet, onSearch }: Props) {
    const [searchTerm, setsearchTerm] = useState("");

    const handleSearch = (input: string): void => {
        setsearchTerm(input);
        const searchResults = wallet.filter((item: WalletType) => {
            let regexString = "";
            input.split("").forEach((char) => (regexString += char + ".*"));
            const rgx = new RegExp(regexString, "i");
            return item.walletAddress.match(rgx);
        });
        onSearch(searchResults);
    };

    return (
        <>
            <LuSearch />
            <Input
                type="text"
                name="addresses"
                id="addresses"
                placeholder="Find addresses ..."
                className="w-52"
                onChange={(event) => handleSearch(event.target.value)}
            />
        </>
    );
}

export default Search;
