# Summary
Candy machine is fair NFT collectin launchpad on Solana.
you can create a new V3 Candy Machine through this TypeScript application.

## Set up connection

have to define SOLANA_CONNECTION to select network.

>**mainnet-beta**

**app.ts**
```
const SOLANA_CONNECTION = new Connection(clusterApiUrl('mainnet-beta'), { commitment: 'finalized' });
```
>**devnet**

**app.ts**
```
const SOLANA_CONNECTION = new Connection(clusterApiUrl('devnet'), { commitment: 'finalized' });
```

## Wallet
have to define source wallet.
This wallet will be used as NFT mint authority.
>create new wallet

**type command in project root directory**
```
solana-keygen new -o guideSecret.json
```

## Create Collection NFT

>Input NFT metadata IPFS uri

```
const NFT_METADATA = '...';
```

>Input metadata

```
const { nft: collectionNft } = await METAPLEX.nfts().create({
    name: "...",
    uri: NFT_METADATA,
    sellerFeeBasisPoints: 0,
    isCollection: true,
    updateAuthority: WALLET,
  });
```

> Commnet and uncomment functions

```
createCollectionNft();
// generateCandyMachine();
// updateCandyMachine();
// addItems();
// mintNft();
```

>  Run project

** run following command in root directory**
```
ts-node app.ts
```

> Result

```
✅ - Minted Collection NFT: 89nSPfbFtjyF9xjWJYmCUv6R2RUEDyAvDMjqLjQWEM9C
     https://explorer.solana.com/address/89nSPfbFtjyF9xjWJYmCUv6R2RUEDyAvDMjqLjQWEM9C?cluster=devnet

```

>Input Collection Mint address in app.ts

```
const COLLECTION_NFT_MINT = '89nSPfbFtjyF9xjWJYmCUv6R2RUEDyAvDMjqLjQWEM9C';
```

## Initiate Candy Machine

> Commnet and uncomment functions

```
//createCollectionNft();
generateCandyMachine();
// updateCandyMachine();
// addItems();
// mintNft();
```
>  Run project

** run following command in root directory**
```
ts-node app.ts
```

> Result

```
✅ - Created Candy Machine: BwUcRYtJSJBDnB8FwTHFBQCznARSw4yQfvLQr1gRx2Ht
     https://explorer.solana.com/address/BwUcRYtJSJBDnB8FwTHFBQCznARSw4yQfvLQr1gRx2Ht?cluster=devnet

```

>Copy the Candy Machine ID and update your CANDY_MACHINE_ID variable

```
const CANDY_MACHINE_ID = 'BwUcRYtJSJBDnB8FwTHFBQCznARSw4yQfvLQr1gRx2Ht';
```


## Add Candy Machine guard

```
const { response } = await METAPLEX.candyMachines().update({
      candyMachine,
      guards: {
          startDate: { date: new Date() },
          mintLimit: {
              id: 1,
              limit: 2,
          },
          tokenPayment: {
            amount: toBigNumber(300),
            mint: new PublicKey(USDC_MINT),
            destinationAta: paymentAccount,
          },
      }
  })
```

>Reference


- Address Gate: Restricts the mint to a single address.
- Allow List: Uses a wallet address list to determine who is allowed to mint.
- Bot Tax: Configurable tax to charge invalid transactions.
- End Date: Determines a date to end the mint.
- Gatekeeper: Restricts minting via a Gatekeeper Network, e.g., Captcha integration.
- Mint Limit: Specifies a limit on the number of mints per wallet.
- Nft Burn: Restricts the mint to holders of a specified collection, requiring a burn of the NFT.
- Nft Gate: Restricts the mint to holders of a specified collection.
- Nft Payment: Set the price of the mint as an NFT of a specified collection.
- Redeemed Amount: Determines the end of the mint based on the total amount minted.
- Sol Payment: Set the price of the mint in SOL.
Start Date: Determines the start date of the mint.
- Third-Party Signer: Requires an additional signer on the transaction.
- Token Burn: Restricts the mint to holders of a specified token, requiring a burn of the tokens.
- Token Gate: Restricts the mint to holders of a specified token.
- Token Payment: Set the price of the mint in token amount.

> Commnet and uncomment functions and run project

```
//createCollectionNft();
//generateCandyMachine();
updateCandyMachine();
// addItems();
// mintNft();
```

> Update Candy Machin id from log of result

```
const CANDY_MACHINE_ID = 'A6pSh187gdUMZdNApc19oMZ4Z9HpXHmXsjSqk2ut8h9m';
```

## Add Items to Candy machine

> Commnet and uncomment functions and run project

```
//createCollectionNft();
//generateCandyMachine();
//updateCandyMachine();
addItems();
// mintNft();
```

## Mint NFT

> Commnet and uncomment functions and run project

```
//createCollectionNft();
//generateCandyMachine();
//updateCandyMachine();
//addItems();
mintNft();
```