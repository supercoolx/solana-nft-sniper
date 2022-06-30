import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NFTCard from 'components/NFTCard';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

const Collection = () => {
    const pageSize = 20;
    const { symbol } = useParams();
    const [collection, setCollection] = useState(null);
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState({price_range:{currency:'sol'},rarity_range:{},traits:{}});
    const [trait, setTrait] = useState({});
    const [order, setOrder] = useState('price_asc');
    const [attr, setAttr] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const onChangeAttribute = e => setAttr(e.target.value);
    const onChangePriceRange = (e) => {
        e.preventDefault();
        setFilter(filter => {
            let _filter = Object.assign({}, filter);
            e.target.min_price.value ? _filter.price_range.min_price = e.target.min_price.value : delete _filter.price_range.min_price;
            e.target.max_price.value ? _filter.price_range.max_price = e.target.max_price.value : delete _filter.price_range.max_price;
            return _filter;
        });
    }
    const onChangeRarityRange = (e) => {
        e.preventDefault();
        setFilter(filter => {
            let _filter = Object.assign({}, filter);
            e.target.min.value ? _filter.rarity_range.min = e.target.min.value : delete _filter.rarity_range.min;
            e.target.max.value ? _filter.rarity_range.max = e.target.max.value : delete _filter.rarity_range.max;
            return _filter;
        });
    }
    const changeTraits = (key) => {
        return (e) => {
            let _filter = Object.assign({}, filter);
            if (e.target.checked) {
                if (!_filter.traits[key]) _filter.traits[key] = [];
                _filter.traits[key].push(e.target.value);
            }
            else {
                let index = _filter.traits[key].indexOf(e.target.value);
                index > -1 && _filter.traits[key].splice(index, 1);
                !_filter.traits[key].length && delete _filter.traits[key];
            }
            setFilter(_filter);
        }
    }
    const onChangeOrder = (e) => setOrder(e.target.value);
    const fetch = () => {
        axios.post(`https://api.coralcube.io/v1/getItems?offset=${page * pageSize}&page_size=${pageSize}&ranking=${order}&symbol=${symbol}`, filter)
            .then(res => {
                setItems(items.concat(res.data.items));
                setPage(page + 1);
				res.data.items.length < pageSize && setHasMore(false);
            })
            .catch(console.error);
    }

    useEffect(() => {
        axios.get(`https://api.coralcube.io/v1/getCollectionAttributes?symbol=${symbol}`)
            .then(res => {
                setTrait(res.data.schema.properties.traits.properties);
            })
            .catch(() => setTrait({}));
    }, [symbol]);
    useEffect(() => {
        setItems([]);
        setPage(1);
		setHasMore(true);
        axios.post(`https://api.coralcube.io/v1/getItems?offset=0&page_size=${pageSize}&ranking=${order}&symbol=${symbol}`, filter)
            .then(res => {
                setCollection(res.data.collection);
                setItems(res.data.items);
				res.data.items.length < pageSize && setHasMore(false);
            })
            .catch(() => setCollection({}));
    }, [filter, order]);

    if (!collection) return <div className='container mx-auto'>Loading..</div>

    return (
        <div className='container flex min-h-screen gap-5 pb-5 mx-auto mt-10'>
            <div className='w-80'>
                <div className='px-5 py-3 rounded-md shadow-md bg-neutral-800'>
                    <img src={collection.image} className='w-20 h-20 rounded-md' alt='' />
                    <div className='flex flex-col pt-5'>
                        <div className='text-xl font-bold text-green-400'>{collection.name}</div>
                        {collection.website && <a href={collection.website} className='text-blue-500 underline' target='_blank' rel='noreferrer'>{collection.website}</a>}
                        <div>Floor Price: <span className='text-xl font-bold text-green-400'>{collection.floor_price / 1000000000 || '---'}</span> SOL</div>
                        <div>Listed Count: <span className='text-xl font-bold text-green-400'>{collection.listed_count}</span></div>
                        <div>Total Count: <span className='text-xl font-bold text-green-400'>{collection.total_count}</span></div>
                        <div className='pt-2 text-sm text-gray-300'>{collection.description}</div>
                    </div>
                </div>
                <div className='w-full px-5 pt-5 pb-3 mt-5 rounded-md shadow-md bg-neutral-800'>
                    <form onSubmit={onChangePriceRange} className='flex items-center justify-between pb-3'>
                        <span>Price:</span>
                        <div>
                            <input type='number' id='min_price' className='w-16 pl-2 bg-transparent border rounded-md outline-none appearance-none' />
                            <span className='px-2'>~</span>
                            <input type='number' id='max_price' className='w-16 pl-2 bg-transparent border rounded-md outline-none appearance-none' />
                            <button className='px-3 ml-3 border rounded-md'>Find</button>
                        </div>
                    </form>
                    <form onSubmit={onChangeRarityRange} className='flex items-center justify-between pb-3'>
                        <span>Rarity:</span>
                        <div>
                            <input type='number' id='min' className='w-16 pl-2 bg-transparent border rounded-md outline-none appearance-none' />
                            <span className='px-2'>~</span>
                            <input type='number' id='max' className='w-16 pl-2 bg-transparent border rounded-md outline-none appearance-none' />
                            <button className='px-3 ml-3 border rounded-md'>Find</button>
                        </div>
                    </form>
                    <select defaultValue='' onChange={onChangeAttribute} className='w-full px-3 py-1 border rounded-md'>
                        <option value='' className='hidden' disabled>Select traits</option>
                        {Object.keys(trait).map(key => <option value={key} key={key}>{key}</option>)}
                    </select>
                    <div className='flex flex-col items-start pt-3 pl-3'>
                        {
                            attr && Object.keys(trait[attr].trait_count).map(key => (
                                <label key={key} className='flex items-center gap-3'>
                                    <input type='checkbox' onChange={changeTraits(attr)} value={key} />
                                    <span>{key} ({trait[attr].trait_count[key]})</span>
                                </label>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='flex-1'>
                <div className='flex items-center justify-end pb-5'>
                    <select value={order} onChange={onChangeOrder} className='px-3 py-1 border rounded-md'>
                        <option value='price_asc'>Price: Low to High</option>
                        <option value='price_desc'>Price: High to Low</option>
                        <option value='recently_listed'>Recently Listed</option>
                        <option value='rarity_asc'>Rarity: Rare to Common</option>
                        <option value='rarity_desc'>Rarity: Common to Rair</option>
                    </select>
                </div>
                <InfiniteScroll dataLength={items.length} next={fetch} hasMore={hasMore} className='grid grid-cols-4 gap-5'>
                    { items.map((item, key) => <NFTCard data={item} key={key} />) }
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default Collection;
