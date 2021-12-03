import {ethers} from "ethers";
import NFT721 from '../../artifacts/contracts/NFT721.sol/NFT721.json';
import Factory721 from '../../artifacts/contracts/Factory721.sol/Factory721.json';
import {erc721ContractAddress, infuraApiKey, nftMarketAddress} from "../variable";
import {Erc721Item} from "./erc721Item";

export async function loadNFTs(): Promise<unknown[]> {
    console.log(`loading NFT items...`)
    console.log(`nft 721 contract address is ${erc721ContractAddress}`);
    console.log(`factory contract address is ${nftMarketAddress}`);
    const provider =  new ethers.providers.InfuraProvider('rinkeby', infuraApiKey);
    const tokenContract = new ethers.Contract(erc721ContractAddress, NFT721.abi, provider);
    const marketContract = new ethers.Contract(nftMarketAddress, Factory721.abi, provider);
    const data = await marketContract.fetchMarketItems();
    console.log(data)
    if(!data){
        //TODO: give some better exceptions
    }

    const nfts = await Promise.all(data.map(async (item: {
        itemId: { toNumber: () => any; };
        sold: boolean;
        tokenId: { toNumber: () => any; };
        price: { toString: () => ethers.BigNumberish; };
        seller: any;
        owner: any;
        nftContract: string;
    }) => {
        const tokenUri = await tokenContract.tokenURI(item.tokenId);
        let i: Erc721Item = {
            itemId: item.itemId.toNumber(),
            price: ethers.utils.formatUnits(item.price.toString(), 'ether'),
            tokenId: item.tokenId.toNumber(),
            seller: item.seller,
            owner: item.owner,
            sold: item.sold,
            tokenUri: tokenUri,
            nftContract: item.nftContract
        }
        return i;
    }))
    return nfts;
}

export async function createMarketItem(): Promise<string> {

    console.log(`creating sale item...`)
    const provider =  new ethers.providers.InfuraProvider('rinkeby', infuraApiKey);
    const wallet = new ethers.Wallet(`1226dc0e2836cbfff5d97117c711ef47c31b1921727bfe10242625c7418f09d8`, provider);
    //const signer = provider.getSigner();
    const signer = wallet.connect(provider);
    let balance = await wallet.getBalance();
    console.log(`the wallet balance is ${balance}`);  // decimal 18
    console.log(`the NFT contract address is ${erc721ContractAddress}`);
    let contract = new ethers.Contract(erc721ContractAddress, NFT721.abi, signer)

    console.log(`creating ERC721 token...`)
    let contractWithSigner = contract.connect(wallet)
    let transaction = await contractWithSigner.createToken(`https://ipfs.io/ipfs/Qmf7iUaa6r7NVL3Zzt7Ks6fiMbubrqYHd7dEsuteNHNkeq/NFT.json`)
    //let transaction = await contract.createToken(`https://gateway.pinata.cloud/ipfs/QmbsSK8FtqCSMQ3qp4or8CngEFPb6jZAFvBzUSyKVEk5gy`)
    console.log(transaction.hash);

    console.log(`minting ERC721 token...`)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    console.log(`token id is ${tokenId}`)

    const price = ethers.utils.parseUnits(`0.002`, 'ether')
    contract = new ethers.Contract(nftMarketAddress, Factory721.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    console.log(`list price is ${listingPrice}`)

    console.log(`creating market item...`)
    transaction = await contract.createMarketItem(erc721ContractAddress, tokenId, price, { value: listingPrice })
    console.log(`create market item transaction hash is ${transaction.hash}`)
    console.log(`minting market item...`)
    let marketItem = await transaction.wait()
    console.log(`Done`)
    return marketItem.transactionHash;

}

export async function buy(nft: Erc721Item) {
    const provider =  new ethers.providers.InfuraProvider('rinkeby', infuraApiKey);
    const wallet = new ethers.Wallet(`1226dc0e2836cbfff5d97117c711ef47c31b1921727bfe10242625c7418f09d8`, provider);
    const signer = wallet.connect(provider);
    let balance = await wallet.getBalance();
    console.log(`the wallet balance is ${balance}`);  // decimal 18
    const contract = new ethers.Contract(nftMarketAddress, Factory721.abi, signer)
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    console.log(`creating sale...`);
    const transaction = await contract.createMarketSale(erc721ContractAddress, nft.tokenId, {
        value: price
    })
    console.log(`minting`);
    let tx = await transaction.wait()
    console.log(`Done`)
    return tx.transactionHash;

}


