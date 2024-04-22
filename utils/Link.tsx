import React from 'react'
import { Link as NextLink } from "@/utils/router-events";


interface Props {
    children: React.ReactNode,
    href: Href,
    className?: string
}

interface Href {
    url: string[],
    searchParams?: { [key: string]: string },
}

export default function Link({ children, href, className }: Props) {

    function makeParams(params: { [key: string]: string }) {
        let temp: string[] = [];
        Object.keys(params).forEach((element) => {
            temp.push(`${element}=s${params[element]}`);
        });
        return temp;
    }

    const url = href.url.join('/')
    const params = href.searchParams ? makeParams(href.searchParams) : ''


    return (
        <NextLink href={url + "?" + params} className={className}>{children}</NextLink>
    )
}


// FIXME: add navigation/router href abstraction as well
// FIXME: add router-event for gloabal loading overlay