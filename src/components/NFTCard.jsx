import React from 'react';
import ReactImageAppear from 'react-image-appear';

const NFTCard = ({data}) => {
    return (
        <div className='flex flex-col justify-between px-3 py-2 rounded-md bg-neutral-800'>
            <ReactImageAppear src={data.extra.img} placeholderStyle={{ backgroundColor: '#262626' }} className='w-full min-h-[100px] rounded-md' />
            <div className='pt-2 text-sm'><span className='text-green-400'>{data.price}</span> SOL</div>
        </div>
    )
}

export default NFTCard;