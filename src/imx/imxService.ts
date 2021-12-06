import {
    bulkMintMax,
    publicApiUrl,
    starkContractAddress,
    registrationContractAddress,
    gasLimit,
    gasPrice,
    privateKey1,
    tokenAddress
} from "../variable";
import {ethNetwork, alchemyApiKey} from "../variable";
import { AlchemyProvider } from '@ethersproject/providers';
import { ImmutableXClient, ImmutableMethodParams } from '@imtbl/imx-sdk';
import {Wallet} from "@ethersproject/wallet";

export type BulkMintParams = {
    amount: number;
    tokenId: number;
    wallet: string;
}

export async function bulkMint(req: BulkMintParams): Promise<void> {
    if(req.amount >= Number(bulkMintMax)){
        throw new Error(`tried to mint too many tokens. Maximum ${bulkMintMax}`)
    }
    console.log(`token id is ${req.tokenId}`)
    const provider = new AlchemyProvider(ethNetwork, alchemyApiKey);
    const signer = new Wallet(privateKey1).connect(provider);
    const minter = await ImmutableXClient.build({
        publicApiUrl, signer, starkContractAddress, registrationContractAddress, gasLimit, gasPrice
    })


    const waitForTransaction = async (promise: Promise<string>) => {
        const txId = await promise;
        console.log('Waiting for transaction', {
            txId,
            etherscanLink: `https://ropsten.etherscan.io/tx/${txId}`,
            alchemyLink: `https://dashboard.alchemyapi.io/mempool/eth-ropsten/tx/${txId}`,
        });
        const receipt = await provider.waitForTransaction(txId);
        if (receipt.status === 0) {
            throw new Error('Transaction rejected');
        }
        console.log(`Transaction Mined: ${receipt.blockNumber}`);
        return receipt;
    };


    const registerImxResult = await minter.registerImx({
        etherKey: minter.address.toLowerCase(),
        starkPublicKey: minter.starkPublicKey,
    });

    if (registerImxResult.tx_hash === '') {
        console.log('Minter registered, continuing...');
    } else {
        console.log('Waiting for minter registration...');
        await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
    }

    const tokens = Array.from({ length: req.amount.valueOf() }, (_, i) => i).map(i => ({
        id: (req.tokenId.valueOf() + i).toString(),
        blueprint: 'onchain-metadata',
    }));




    const payload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
        {
            contractAddress: tokenAddress, // NOTE: a mintable token contract is not the same as regular erc token contract
            users: [
                {
                    etherKey: req.wallet.toLowerCase(),
                    tokens,
                },
            ],
        },
    ];

    const result = await minter.mintV2(payload);
    console.log(result);


}
