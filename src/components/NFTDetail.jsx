import React from 'react';

const NFTDetail = ({ collection }) => {
    if(!collection) return null;
    return (
        <div className='bg-neutral-800 shadow-md rounded-md px-5 py-3 mt-5'>
            <img src={collection.image} className='w-20 h-20 rounded-md' alt='' />
            <div className='flex flex-col pt-5'>
                <div>Name: <span className='text-green-400 text-xl font-bold'>{collection.name}</span></div>
                { collection.website && <a href={collection.website} className='text-blue-500 underline' target='_blank' rel='noreferrer'>{collection.website}</a> }
                <div>Floor Price: <span className='text-green-400 text-xl font-bold'>{collection.floorPrice / 1000000000}</span> SOL</div>
                <div>Listed Count: <span className='text-green-400 text-xl font-bold'>{collection.listedCount}</span></div>
                <div className='text-sm pt-2 text-gray-300'>{collection.description}</div>
            </div>
        </div>
    )
}

export default NFTDetail;
