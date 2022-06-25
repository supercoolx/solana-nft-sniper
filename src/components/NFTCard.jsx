import React from 'react';
import ReactImageAppear from 'react-image-appear';

const NFTCard = ({data}) => {
    return (
        <a href={`https://magiceden.io/item-details/${data.mintAddress}`} target='_blank' rel='noreferrer' className='flex flex-col justify-between px-3 py-2 rounded-md bg-neutral-800'>
            <div className='flex items-center flex-1 w-full'>
                <ReactImageAppear src={data.img} placeholderStyle={{ backgroundColor: '#262626' }} className='w-full min-h-[100px] rounded-md' />
            </div>
            <div className='flex items-end justify-between pt-2'>
                <span className='text-lg'>{data.title}</span>
                <span className='text-sm text-green-400'>{data.price} SOL</span>
            </div>
        </a>
    )
}

export default NFTCard;