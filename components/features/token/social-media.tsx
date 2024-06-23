'use client'
import { Button } from '@/components/ui/button'
import { IToken } from '@/types/token.type'
import React from 'react'
import { BiLogoTelegram } from 'react-icons/bi'
import { FaDiscord } from 'react-icons/fa'
import { IoEarth } from 'react-icons/io5'
import { RiTwitterXFill } from 'react-icons/ri'
import { StarIcon } from '@radix-ui/react-icons';

interface Props {
    token: IToken
}

export default function SocialMedia({ token }: Props) {
    return (
        <div className="top flex items-end justify-center gap-1">

            {token?.TokenMedia?.Token_Discord != undefined && (
                <Button
                    className='rounded-full text-xs py-0'
                    variant='outline'
                    onClick={() => window.open(token.TokenMedia!.Token_Discord, "_blank")}
                >
                    <FaDiscord />
                    <span className='ml-2'>Discord</span>
                </Button>
            )}
            {token?.TokenMedia?.Token_Website && (
                <Button
                    className='rounded-full text-xs !px-1 !py-1 !h-auto'
                    variant="outline"
                    onClick={() => window.open(token.TokenMedia!.Token_Website, "_blank")}
                >
                    <IoEarth />
                    <span className='ml-2'>Website</span>
                </Button>
            )}
            {token?.TokenMedia?.Token_Telegram && (
                <Button
                    className='rounded-full text-xs !px-1 !py-1 !h-auto'
                    variant="outline"
                    onClick={() => window.open(token.TokenMedia!.Token_Telegram, "_blank")}
                >
                    <BiLogoTelegram />
                    <span className='ml-2'>Telegram</span>
                </Button>
            )}
            {token?.TokenMedia?.Token_Twitter && (
                <Button
                    className='rounded-full text-xs !px-1 !py-1 !h-auto'
                    variant="outline"
                    onClick={() => window.open(token.TokenMedia!.Token_Twitter, "_blank")}
                >
                    <RiTwitterXFill />
                    <span className='ml-2'>Twitter</span>
                </Button>
            )}

        </div>
    )
}
