const solanaWeb3 = require('@solana/web3.js');
const { Connection, programs } = require('@metaplex/js');
const axios = require('axios');

const projectAddress = 'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K';

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

    let signatures;
    const option = {};
    while (true) {
        try{
            signatures = await solanaConnection.getSignaturesForAddress(projectPubKey, option);
            if (!signatures.length) {
                console.log('polling...');
                await timer(3000);
                continue;
            }
        } catch (err) {
            console.log('Error fetching signatures:', err.message);
            continue;
        }

        // for (let i = signatures.length - 1; i >= 0; i--) {
            try{
                let { signature } = signatures[0];
                const tx = await solanaConnection.getTransaction(signature);
                console.log(tx);
                console.log('Transaction:', signature);
                if (!tx.meta || tx.meta.err) {
                    console.log('Empty or error transaction.');
                    continue;
                }

                console.log('DateTime:', new Date(tx.blockTime * 1000).toLocaleString());
                const balanceChange = tx.meta.preBalances[0] - tx.meta.postBalances[0];
                if (balanceChange < 0) {
                    console.log('Unlisting action.');
                    continue;
                }
                console.log('Owner:', tx.transaction.message.accountKeys[0].toString());
                console.log('Token:', tx.meta.postTokenBalances[0].mint);
            }
            catch(err) {
                console.log('Error fetching transaction:', err.message);
                continue;
            }
        // }

        option.until = signatures[0].signature;
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