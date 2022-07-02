const WebSocket = require('ws');
const Event = require('events');
const axios = require('axios');
const solanaWeb3 = require('@solana/web3.js');
const { Connection, programs } = require('@metaplex/js');

const magicEdenAddress = 'MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8';
const httpUrl = solanaWeb3.clusterApiUrl('mainnet-beta');
const wsUrl = 'wss://api.mainnet-beta.solana.com/';

const solanaConnection = new solanaWeb3.Connection(httpUrl, 'confirmed');
const metaplexConnection = new Connection('mainnet-beta');
const Metadata = programs.metadata.Metadata;

var ws;
const event = new Event();

const monitor = () => {
    ws = new WebSocket(wsUrl);
    ws.onopen = () => {
        ws.send(JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'programSubscribe',
            params: [
                magicEdenAddress,
                {
                    encoding: 'base64',
                    commitment: 'processed'
                }
            ]
        }));
    }
    ws.on('message', (event) => {
        try {
            var data = JSON.parse(event).params.result;
            data.slot = JSON.parse(event).params.result.context.slot;
            event.emit('task', data);
        }
        catch (e) {
            console.log('Error:', e.message);
        }
    });
    ws.onclose = () => {
        console.log('Closed.');
    }
    return ws;
}

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

monitor();