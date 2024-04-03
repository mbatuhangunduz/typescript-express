import { log } from '../../helpers/logger';
import {  GetNftBalance, GetTokenBalance } from '../../types/responseTypes';
import { Endpoint } from '../../types/serviceTypes';
import Config from '../../config/config';
import { sendRequest } from './sendRequest';

export const getAccountBalance = async (
	token: string | undefined,
	type: 'getNftBalance' | 'getTokenBalance',
): Promise<{
	contractAddresses: Array<string>;
	tokenIds?: Array<string>;
} | null> => {
	if (!token) {
		console.error('Token is undefined. Cannot send test request.');
		return null;
	}

	try {
		if (type === 'getTokenBalance') {
			const nftEndpoint = Config.testEndpoints.find((endpoint) => endpoint.name === type) as Endpoint;
			nftEndpoint.headers = { Authorization: `Bearer ${token}` };
			const res = await sendRequest(nftEndpoint)
			const data: GetTokenBalance = res && res.data;
			const contractAddresses = data.data.items.map((token) => token.contractAddress);
			return {
				contractAddresses,
			};
		} else {
			const tokenEndpoint = Config.testEndpoints.find((endpoint) => endpoint.name === type) as Endpoint;
			tokenEndpoint.headers = { Authorization: `Bearer ${token}` };
			const res = await sendRequest(tokenEndpoint)
			const data: GetNftBalance = res&& res.data;

			const contractAddresses = data.data.nftBalances.map((nft) => nft.contractAddress);
			const tokenIds = data.data.nftBalances.map((nft) => nft.tokenId);

			return {
				contractAddresses,
				tokenIds,
			};
		}
	} catch (error: any) {
		log.error('getAccountBalance:' + error.message);
		return null;
	}
};
