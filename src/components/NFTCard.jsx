import React from 'react';
import ReactImageAppear from 'react-image-appear';

const NFTCard = ({data}) => {
    return (
        <a href={`https://magiceden.io/item-details/${data.tokenAddress}`} target='_blank' rel='noreferrer' className='flex flex-col justify-between px-3 py-2 rounded-md bg-neutral-800'>
            <div className='flex items-center flex-1 w-full'>
                <ReactImageAppear src={data.extra.img} placeholderStyle={{ backgroundColor: '#262626' }} className='w-full min-h-[100px] rounded-md' />
            </div>
            <div className='pt-2 text-sm'><span className='text-green-400'>{data.price}</span> SOL</div>
        </a>
    )
}

export default NFTCard;