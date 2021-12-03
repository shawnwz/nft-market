function getEnvVar(name: string, required: true, defaultValue?: string): string;
function getEnvVar(name: string, required: boolean, defaultValue: string): string;
function getEnvVar(name: string, required: boolean, defaultValue?: string): string | undefined {
    const value = process.env[name] ?? defaultValue;
    if (required && value === undefined) {
        console.error(`missing env. var. ${name}`);
        process.exit(1);
    }
    return value
}

export const ethProvider = getEnvVar('ETH_DEFAULT_PROVIDER', true)
export const erc721ContractAddress = getEnvVar('ERC721_CONTRACT_ADDRESS', true)
export const nftMarketAddress = getEnvVar('NFT_MARKET_ADDRESS', true)
export const walletPrivateKey = getEnvVar('WALLET_PRIVATE_KEY', true)
export const infuraApiKey = getEnvVar('INFURA_API_KEY', true);
