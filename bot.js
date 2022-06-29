const solanaWeb3 = require('@solana/web3.js');
const { Connection, programs } = require('@metaplex/js');
const axios = require('axios');

const projectAddress = '4ECurpxLuMYXS4FmPHXwsM8XQgdzMJ6CKXiZ3xNggvwa';

const projectPubKey = new solanaWeb3.PublicKey(projectAddress);
const url = solanaWeb3.clusterApiUrl('mainnet-beta');
const solanaConnection = new solanaWeb3.Connection(url, 'confirmed');
const metaplexConnection = new Connection('mainnet-beta');
const { metadata: { Metadata } } = programs;
const pollingInterval = 2000; // ms
const marketplaceMap = {
    "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K": "Magic Eden"
};

const runSalesBot = async () => {
    console.log("starting sales bot...");

    const signature = '42ZxZskUgLNWQgjryVemUVaHCRLjsbnQtv2pSg87oFyNgY2W9U6MXk16zPiFYwQNTUB9t2reoE8pmxGwDnfakKSD';
    const txn = await solanaConnection.getTransaction(signature);
    if (txn.meta && txn.meta.err != null) return;

    const dateString = new Date(txn.blockTime * 1000).toLocaleString();
    console.log('data', dateString);
    const accounts = txn.transaction.message.accountKeys;
    console.log('Owner', accounts[0].toString());
    console.log('Token', txn.meta.postTokenBalances[0].mint);
    const marketplaceAccount = accounts[accounts.length - 1].toString();
    console.log('marketplace', marketplaceAccount);

    if (marketplaceMap[marketplaceAccount]) {
        const metadata = await getMetadata(txn.meta.postTokenBalances[0].mint);
        if (!metadata) {
            console.log("couldn't get metadata");
            return;
        }

        console.log(metadata);
        // await postSaleToDiscord(metadata.name, price, dateString, signature, metadata.image)
    } else {
        console.log("not a supported marketplace sale");
    }
}
runSalesBot();

const printSalesInfo = (date, price, signature, title, marketplace, imageURL) => {
    console.log("-------------------------------------------")
    console.log(`Sale at ${date} ---> ${price} SOL`)
    console.log("Signature: ", signature)
    console.log("Name: ", title)
    console.log("Image: ", imageURL)
    console.log("Marketplace: ", marketplace)
}

const timer = ms => new Promise(res => setTimeout(res, ms))

const getMetadata = async (tokenPubKey) => {
    try {
        const addr = await Metadata.getPDA(tokenPubKey)
        const resp = await Metadata.load(metaplexConnection, addr);
        const { data } = await axios.get(resp.data.data.uri);

        return data;
    } catch (error) {
        console.log("error fetching metadata: ", error)
    }
}

const postSaleToDiscord = (title, price, date, signature, imageURL) => {
    axios.post(process.env.DISCORD_URL,
        {
            "embeds": [
                {
                    "title": `SALE`,
                    "description": `${title}`,
                    "fields": [
                        {
                            "name": "Price",
                            "value": `${price} SOL`,
                            "inline": true
                        },
                        {
                            "name": "Date",
                            "value": `${date}`,
                            "inline": true
                        },
                        {
                            "name": "Explorer",
                            "value": `https://explorer.solana.com/tx/${signature}`
                        }
                    ],
                    "image": {
                        "url": `${imageURL}`,
                    }
                }
            ]
        }
    )
}