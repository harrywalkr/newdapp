'use client'

import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import React, { useEffect, useLayoutEffect, useState } from 'react'

interface Props {
    tabItems: string[]
}

export default function Tab({ tabItems }: Props) {
    const [selectedTab, setSelectedTab] = useState<string>(tabItems[0])


    return (
        <div className='flex items-center justify-center'>
            <ul className='container inline-flex gap-3 items-center justify-between bg-card rounded-md p-2 w-auto'>
                {
                    tabItems.map((item, i) => <li key={i}>
                        <Button
                            variant='secondary'
                            onClick={() => setSelectedTab(item)}
                            className={clsx(
                                selectedTab === item && 'bg-brand',
                                `text-foreground flex-1 w-full !shadow-none hover:!bg-transparent focus:!bg-brand`
                            )}>
                            {item}
                        </Button>
                    </li>)
                }
            </ul>
        </div>
    )
}
