import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import NFTDetail from 'components/NFTDetail';
import NFTCard from 'components/NFTCard';
import Pagination from 'components/Pagination';

function Home() {
	const [collection, setCollection] = useState(null);
	const [collections, setCollections] = useState([]);
	const [items, setItems] = useState([]);
	const [page, setPage] = useState(1);

	const onSelectCollection = (option) => {
		setItems([]);
		setPage(1);
		axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${option.value}`)
			.then(res => setCollection(res.data))
			.catch(console.error);
		axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${option.value}/listings`)
			.then(res => setItems(res.data))
			.catch(console.error);
	}
	const onChangePage = (page) => {
		setItems([]);
		axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${collection.symbol}/listings?offset=${(page - 1) * 20}`)
			.then(res => setItems(res.data))
			.catch(console.error);
		setPage(page);
	}
	
	useEffect(() => {
		axios.get('https://api-mainnet.magiceden.dev/v2/collections')
			.then(res => setCollections(res.data.map((item) => {
				return {
					value: item.symbol,
					label: item.name
				}
			})))
			.catch(console.error);
	}, []);

	return (
		<div className='container mx-auto py-5 gap-5 flex min-h-screen'>
			<div className='w-80'>
				<Select onChange={onSelectCollection} options={collections} />
				<NFTDetail collection={collection} />
			</div>
			<div className='flex-1'>
				<div className='pb-5 flex justify-end'>
					<Pagination current={page} total={collection?.listedCount || 0} onChange={onChangePage} />
				</div>
				<div className='flex flex-wrap gap-3'>
					{
						items.map((item, key) => <NFTCard data={item} key={key} />)
					}
				</div>
			</div>
		</div>
	);
}

export default Home;
