import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NFTCard from 'components/NFTCard';
import Pagination from 'components/Pagination';

const Collection = () => {
    const { symbol } = useParams();
    const [collection, setCollection] = useState(null);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [checked, setChecked] = useState([]);
    const [filter, setFilter] = useState({$match:{collectionSymbol:symbol},$sort:{createdAt:-1},$skip:0,$limit:12,status:[]});
    const [availableAttributes, setAvailableAttributes] = useState({});
    const [attributes, setAttributes] = useState({});
    const [values, setValues] = useState([]);

    const onChangeAttribute = e => setValues(attributes[e.target.value]);

    useEffect(() => {
        setItems([]);
        setFilter({$match:{collectionSymbol:symbol},$sort:{createdAt:-1},$skip:0,$limit:12,status:[]});
        axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${symbol}`)
            .then(res => setCollection(res.data))
            .catch(() => setCollection({}));
        axios.get(`https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/${symbol}`)
            .then(res => {
                setAvailableAttributes(res.data.results.availableAttributes);
                let attr = {};
                res.data.results.availableAttributes.forEach((item, key) => {
                    if (!attr[item.attribute.trait_type]) attr[item.attribute.trait_type] = [];
                    attr[item.attribute.trait_type].push({
                        id: key,
                        count: item.count,
                        floor: item.floor,
                        type: item.attribute.trait_type,
                        value: item.attribute.value
                    });
                });
                setAttributes(attr);
            })
            .catch(console.error);
    }, [symbol]);
    useEffect(() => {
        let option = {$match:{collectionSymbol:symbol},$sort:{createdAt:-1},$skip:0,$limit:12,status:[]}
        if (checked.length) option.$match.$and = [];
        let opt = {};
        checked.forEach(f => {
            if (!opt[availableAttributes[f].attribute.trait_type]) opt[availableAttributes[f].attribute.trait_type] = [];
            opt[availableAttributes[f].attribute.trait_type].push(availableAttributes[f].attribute.value);
        });
        Object.keys(opt).forEach((key, i) => {
            option.$match.$and.push({ $or: [] });
            opt[key].forEach(v => option.$match.$and[i].$or.push({
                attributes: {
                    $elemMatch: {
                        trait_type: key,
                        value: v
                    }
                }
            }));
        });
        setItems([]);
        setPage(1);
        setFilter(option);
    }, [checked]);
    useEffect(() => {
        axios.get(`https://api-mainnet.magiceden.io/rpc/getListedNFTsByQueryLite?q=${JSON.stringify(filter)}`)
            .then(res => setItems(res.data.results))
            .catch(console.error);
    }, [filter]);
    const onChangePage = (page) => {
        setItems([]);
        axios.get(`https://api-mainnet.magiceden.io/rpc/getListedNFTsByQueryLite?q={"$match":{"collectionSymbol":"${symbol}"},"$skip":${(page - 1) * 12},"$limit":12}`)
            .then(res => setItems(res.data.results))
            .catch(console.error);
        setPage(page);
    }
    const changeFilter = (e) => {
        if (e.target.checked) setChecked([...checked, e.target.value]);
        else setChecked(checked.filter(i => i !== e.target.value));
    }
    const onKeyDown = (e) => {
        e.stopPropagation();
        if (e.keyCode === 13) {
            let query = e.target.value.trim();
            if (query) {
                setFilter({$match:{collectionSymbol:symbol,$text:{$search:query}},$sort:{createdAt:-1},$skip:0,$limit:20,status:[]});
            }
        }
    }

    if (!collection) return <div className='container mx-auto'>Loading..</div>

    return (
        <div className='container flex min-h-screen gap-5 pb-5 mx-auto mt-10'>
            <div className='w-80'>
                <div className='px-5 py-3 rounded-md shadow-md bg-neutral-800'>
                    <img src={collection.image} className='w-20 h-20 rounded-md' alt='' />
                    <div className='flex flex-col pt-5'>
                        <div>Name: <span className='text-xl font-bold text-green-400'>{collection.name}</span></div>
                        {collection.website && <a href={collection.website} className='text-blue-500 underline' target='_blank' rel='noreferrer'>{collection.website}</a>}
                        <div>Floor Price: <span className='text-xl font-bold text-green-400'>{collection.floorPrice / 1000000000 || '---'}</span> SOL</div>
                        <div>Listed Count: <span className='text-xl font-bold text-green-400'>{collection.listedCount}</span></div>
                        <div className='pt-2 text-sm text-gray-300'>{collection.description}</div>
                    </div>
                </div>
                <div className='w-full px-5 pt-5 pb-3 mt-5 rounded-md shadow-md bg-neutral-800'>
                    <select defaultValue='' onChange={onChangeAttribute} className='w-full px-3 py-1 border rounded-md'>
                        <option value='' disabled>Select traits</option>
                        {Object.keys(attributes).map(key => <option value={key} key={key}>{key}</option>)}
                    </select>
                    <div className='flex flex-col items-start pt-3 pl-3'>
                        {
                            values.map((value, key) => (
                                <label key={key} className='flex items-center gap-3'>
                                    <input type='checkbox' onChange={changeFilter} value={value.id} checked={checked.includes(`${value.id}`)} />
                                    <span>{value.value} ({value.count})</span>
                                </label>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='flex-1'>
                <div className='flex items-center justify-between pb-5'>
                    <input onKeyDown={onKeyDown} type='text' placeholder='search..' className='px-3 py-1 bg-transparent border rounded-md outline-none w-50 focus:border-green-600 caret-green-600' />
                    <Pagination current={page} total={collection?.listedCount || 0} onChange={onChangePage} />
                </div>
                <div className='grid grid-cols-4 gap-5'>
                    {
                        items.map((item, key) => <NFTCard data={item} key={key} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default Collection;
