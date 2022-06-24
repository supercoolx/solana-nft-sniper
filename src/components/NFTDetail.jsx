import React from 'react';
import { Link } from 'react-router-dom';
import ReactImageAppear from 'react-image-appear';

const NFTDetail = ({ collection }) => {
    if(!collection) return null;
    return (
        <Link to={'/collection/' + collection.symbol} className='px-5 py-3 transition-all duration-200 rounded-md shadow-md hover:shadow-lg hover:-translate-y-1 bg-neutral-800'>
            <ReactImageAppear src={collection.image} placeholderStyle={{ backgroundColor: '#262626' }} className='w-20 h-20 rounded-md' alt='' />
            <div className='flex flex-col pt-5'>
                <div>Name: <span className='text-xl font-bold text-green-400'>{collection.name}</span></div>
                <div className='pt-2 text-sm text-gray-300'>{collection.description}</div>
            </div>
        </Link>
    )
}

export default NFTDetail;
