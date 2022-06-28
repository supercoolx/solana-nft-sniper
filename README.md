# Magic Eden NFT Sniper Bot.

```

      @@@@@@%               @@@@@@@@@@@@@@@@@@@@@@@@
     @@@@@@@@@@           @@@@@@@@@@@@@@@@@@@@@@@@@@(
     @@@@@@@@@@@@@      .@@@@@@@@@@@@@@
     @@@@@@@@@@@@@@@   @@@@@@@@ @@@@@@@@@
     @@@@@@@@@@@@@@@@@@@@@@@@     @@@@@@@@@
     @@@@@@@@  @@@@@@@@@@@@        /@@@@@@@@
     @@@@@@@@     @@@@@@@         @@@@@@@@#
     @@@@@@@@                   @@@@@@@@
     @@@@@@@@                 @@@@@@@@@@@@@@@@@@@@/
     @@@@@@@@                @@@@@@@@@@@@@@@@@@@@@@@@
      @@@@@@                 @@@@@@@@@@@@@@@@@@@@@@@


```

## Magic Eden Apis

```
https://api-mainnet.magiceden.io/rpc/getListedNFTsByQueryLite?q={"$match":{"collectionSymbol":"kenoko"},"$skip":0,"$limit":20,"status":[]}
https://api-mainnet.magiceden.io/rpc/getNFTByMintAddress/5K3UqhkWjuzLyVnXYmNzx1u19mhxpvozt1ybUBZ6pSHA?useRarity=true
https://api-mainnet.magiceden.io/rpc/getNFTStatsByMintAddress/5K3UqhkWjuzLyVnXYmNzx1u19mhxpvozt1ybUBZ6pSHA
https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/solhellcats
https://api-mainnet.magiceden.io/rpc/getListedNFTsByQueryLite?q={"$match":{"collectionSymbol":"degenerate_ape_academy","$text":{"$search":"ape"},"rarity.howrare":{"$exists":true}},"$sort":{"rarity.howrare.rank":1},"$skip":0,"$limit":20,"status":[]}
```