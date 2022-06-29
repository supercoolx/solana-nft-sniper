import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NFTDetail from 'components/NFTDetail';

function Home() {
	const [collections, setCollections] = useState([]);
	
	useEffect(() => {
		axios.get('https://api-mainnet.magiceden.dev/v2/collections?limit=15', {
			headers: { 'Access-Control-Allow-Origin': '*' }
		})
			.then(res => setCollections(res.data))
			.catch(console.error);
	}, []);

	return (
		<div className='container min-h-screen pb-5 mx-auto'>
			<div className='grid grid-cols-5 gap-5 mt-5'>
				{
					collections.map((col, key) => <NFTDetail collection={col} key={key} />)
				}
			</div>
		</div>
	);
}

export default Home;
