'use client'

import React, { useEffect, useLayoutEffect } from 'react'

interface Props {
    tabItems: string[]
}

export default function Tab({ }: Props) {

    useEffect(() => {

    }, [])

    return (
        <ul className='container'>
            {/* {
                tabItems.map((item, i) => <li key={i}>
                    item
                </li>)
            } */}
        </ul>
    )
}
