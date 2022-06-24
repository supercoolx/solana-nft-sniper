import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from 'components/Header';
import NFTCard from 'components/NFTCard';
import Pagination from 'components/Pagination';

const Collection = () => {
    const { symbol } = useParams();
    const [collection, setCollection] = useState(null);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        symbol && axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${symbol}`)
            .then(res => setCollection(res.data))
            .catch(console.error);
        axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${symbol}/listings?limit=12`)
            .then(res => setItems(res.data))
            .catch(console.error);
    }, [symbol])
    const onChangePage = (page) => {
        setItems([]);
        axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${symbol}/listings?offset=${(page - 1) * 12}&limit=12`)
            .then(res => setItems(res.data))
            .catch(console.error);
        setPage(page);
    }

    if (!collection) return <div>Loading..</div>

    return (
        <div className='container min-h-screen mx-auto'>
            <Header />
            <div className='flex gap-5'>
                <div className='w-80'>
                    <div className='px-5 py-3 mt-5 rounded-md shadow-md bg-neutral-800'>
                        <img src={collection.image} className='w-20 h-20 rounded-md' alt='' />
                        <div className='flex flex-col pt-5'>
                            <div>Name: <span className='text-xl font-bold text-green-400'>{collection.name}</span></div>
                            {collection.website && <a href={collection.website} className='text-blue-500 underline' target='_blank' rel='noreferrer'>{collection.website}</a>}
                            <div>Floor Price: <span className='text-xl font-bold text-green-400'>{collection.floorPrice / 1000000000 || '---'}</span> SOL</div>
                            <div>Listed Count: <span className='text-xl font-bold text-green-400'>{collection.listedCount}</span></div>
                            <div className='pt-2 text-sm text-gray-300'>{collection.description}</div>
                        </div>
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='flex justify-end pb-5'>
                        <Pagination current={page} total={collection?.listedCount || 0} onChange={onChangePage} />
                    </div>
                    <div className='grid grid-cols-4 gap-5'>
                        {
                            items.map((item, key) => <NFTCard data={item} key={key} />)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Collection;
