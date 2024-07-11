import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity, toMetaplexFile, toBigNumber, CreateCandyMachineInput, DefaultCandyGuardSettings, CandyMachineItem, toDateTime, sol, TransactionBuilder, CreateCandyMachineBuilderContext } from "@metaplex-foundation/js";
import secret from './guideSecret.json';
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

const SOLANA_CONNECTION = new Connection(clusterApiUrl('devnet'), { commitment: 'finalized' });

const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
const NFT_METADATA = 'https://storage.googleapis.com/privasea-face-prod-private/vector/100010-vector.json';
const COLLECTION_NFT_MINT = 'GA5Y3qm2LT6PdGGzCsZckpJCpXkHCpx4rPE6ttaK4SqX';
const CANDY_MACHINE_ID = 'A6pSh187gdUMZdNApc19oMZ4Z9HpXHmXsjSqk2ut8h9m';
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const paymentAccount = getAssociatedTokenAddressSync(
  USDC_MINT,
  WALLET.publicKey
);

const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
  .use(keypairIdentity(WALLET));

async function createCollectionNft() {
  const { nft: collectionNft } = await METAPLEX.nfts().create({
    name: "face token",
    uri: NFT_METADATA,
    sellerFeeBasisPoints: 0,
    isCollection: true,
    updateAuthority: WALLET,
  });

  console.log(`✅ - Minted Collection NFT: ${collectionNft.address.toString()}`);
  console.log(`     https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`);
}

async function generateCandyMachine() {
  const candyMachineSettings: CreateCandyMachineInput<DefaultCandyGuardSettings> =
      {
          itemsAvailable: toBigNumber(3), // Collection Size: 3
          sellerFeeBasisPoints: 1000, // 10% Royalties on Collection
          symbol: "DEMO",
          maxEditionSupply: toBigNumber(0), // 0 reproductions of each NFT allowed
          isMutable: true,
          creators: [
              { address: WALLET.publicKey, share: 100 },
          ],
          collection: {
              address: new PublicKey(COLLECTION_NFT_MINT), // Can replace with your own NFT or upload a new one
              updateAuthority: WALLET,
          },
      };
  const { candyMachine } = await METAPLEX.candyMachines().create(candyMachineSettings);
  console.log(`✅ - Created Candy Machine: ${candyMachine.address.toString()}`);
  console.log(`     https://explorer.solana.com/address/${candyMachine.address.toString()}?cluster=devnet`);
}

async function updateCandyMachine() {
  const candyMachine = await METAPLEX
      .candyMachines()
      .findByAddress({ address: new PublicKey(CANDY_MACHINE_ID) });

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
  
  console.log(`✅ - Updated Candy Machine: ${CANDY_MACHINE_ID}`);
  console.log(`     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
}

async function addItems() {
  const candyMachine = await METAPLEX
      .candyMachines()
      .findByAddress({ address: new PublicKey(CANDY_MACHINE_ID) }); 
  const items = [];
  for (let i = 0; i < 3; i++ ) { // Add 3 NFTs (the size of our collection)
      items.push({
          name: `ace token # ${i+1}`,
          uri: NFT_METADATA
      })
  }
  const { response } = await METAPLEX.candyMachines().insertItems({
      candyMachine,
      items: items,
    },{commitment:'finalized'});

  console.log(`✅ - Items added to Candy Machine: ${CANDY_MACHINE_ID}`);
  console.log(`     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
}

async function mintNft() {
  const candyMachine = await METAPLEX
      .candyMachines()
      .findByAddress({ address: new PublicKey(CANDY_MACHINE_ID) }); 
  let { nft, response } = await METAPLEX.candyMachines().mint({
      candyMachine,
      collectionUpdateAuthority: WALLET.publicKey,
      },{commitment:'finalized'})

  console.log(`✅ - Minted NFT: ${nft.address.toString()}`);
  console.log(`     https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`);
  console.log(`     https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
}

// createCollectionNft();
// generateCandyMachine();
// updateCandyMachine();
// addItems();
mintNft();

