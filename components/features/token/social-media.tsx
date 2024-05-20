'use client'
import { Button } from '@/components/ui/button'
import { TokenType } from '@/types/token.type'
import React from 'react'
import { BiLogoTelegram } from 'react-icons/bi'
import { FaDiscord } from 'react-icons/fa'
import { IoEarth } from 'react-icons/io5'
import { RiTwitterXFill } from 'react-icons/ri'
import { StarIcon } from '@radix-ui/react-icons';

interface Props {
    token: TokenType
}

export default function SocialMedia({ token }: Props) {
    return (
        <div className="top flex flex-col items-end justify-center gap-2">

            <Button size='icon' variant='outline'>
                <StarIcon />
            </Button>
            {token?.TokenMedia?.Token_Discord != undefined && (
                <Button
                    variant='link'
                    size='icon'
                    onClick={() => window.open(token.TokenMedia!.Token_Discord, "_blank")}
                >
                    <FaDiscord />
                </Button>
            )}
            {token?.TokenMedia?.Token_Website && (
                <Button
                    variant="link"
                    size='icon'
                    onClick={() => window.open(token.TokenMedia!.Token_Website, "_blank")}
                >
                    <IoEarth />
                </Button>
            )}
            {token?.TokenMedia?.Token_Telegram && (
                <Button
                    variant="link"
                    size='icon'
                    onClick={() => window.open(token.TokenMedia!.Token_Telegram, "_blank")}
                >
                    <BiLogoTelegram />
                </Button>
            )}
            {token?.TokenMedia?.Token_Twitter && (
                <Button
                    variant="link"
                    size='icon'
                    onClick={() => window.open(token.TokenMedia!.Token_Twitter, "_blank")}
                >
                    <RiTwitterXFill />
                </Button>
            )}

        </div>
    )
}
