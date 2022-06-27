import React from 'react';
import ReactImageAppear from 'react-image-appear';

const NFTCard = ({data}) => {
    return (
        <a href={`https://magiceden.io/item-details/${data.mintAddress}`} target='_blank' rel='noreferrer' className='flex flex-col justify-between px-3 py-2 rounded-md bg-neutral-800'>
            <div className='flex items-center flex-1 w-full'>
                <ReactImageAppear src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/' + data.img} placeholderStyle={{ backgroundColor: '#262626' }} className='w-full min-h-[100px] rounded-md' />
            </div>
            <div className='pt-2'>
                <div className='text-lg'>{data.title}</div>
                <div className='text-sm text-green-400'>{data.price} SOL</div>
            </div>
        </a>
    )
}

export default NFTCard;