import React from 'react';
import ReactImageAppear from 'react-image-appear';

const NFTCard = ({data}) => {
    return (
        <div className='px-3 py-2 rounded-md bg-neutral-800'>
            <ReactImageAppear src={data.extra.img} placeholderStyle={{ backgroundColor: '#262626' }} className='w-20 h-20 rounded-md' />
            <div className='text-sm pt-2'><span className='text-green-400'>{data.price}</span> SOL</div>
        </div>
    )
}

export default NFTCard;