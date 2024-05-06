import React from 'react'
import Tab from '@/components/features/blog/tab'


export default function page() {

    // FIXME: implement seo meta data to all pages

    

    return (
        <div>
            {/* FIXME: get the list of categories from the api and put them into the tab component */}
            <Tab tabItems={['View all', 'Crypto', 'Blockchain', 'NFT']} />
            <div className="content">

            </div>
        </div>
    )
}
