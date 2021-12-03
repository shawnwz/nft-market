import {
    Controller,
    Get, Post,
    Route,
} from "tsoa";
import {createMarketItem, loadNFTs, buy} from "./nftService";

@Route("nfts")
export class NftController extends Controller {

    @Get("get")
    public async  getAccounts(): Promise<any> {
        return loadNFTs()
    }

    @Post("create")
    public async createSale(): Promise<string> {
        console.log(`creating sale...`)
        return createMarketItem();
    }

    @Post("buy")
    public async buy() {
        console.log(`buy...`)
        return buy(       {
            "itemId": 3,
            "price": "0.002",
            "tokenId": 3,
            "seller": "0xcFa1b6c003350FE7eBB679eB3b9EeF554f1201D8",
            "owner": "0x0000000000000000000000000000000000000000",
            "sold": false,
            "tokenUri": "https://ipfs.io/ipfs/Qmf7iUaa6r7NVL3Zzt7Ks6fiMbubrqYHd7dEsuteNHNkeq/NFT.json",
            "nftContract": "0x7e50D7a1408a31ec3567e2A7dfbeDdee29E5DF61"
        })
    }

}
