import React from 'react';
import { Link } from 'react-router-dom';
import logo from 'assets/img/solana-logo.png';

const Header = () => (
    <div className='flex items-center justify-between py-2'>
        <Link to='/'>
            <img src={logo} className='w-10 h-10' alt='' />
        </Link>
        <div className='flex items-center gap-3'>
            <div>Search:</div>
            <input type='text' className='px-3 py-1 rounded-md outline-none w-96' />
        </div>
    </div>
);

export default Header;