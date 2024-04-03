import { log } from '../../helpers/logger';
import { GetNftBalance, GetTokenBalance, Transactions, ResponseTypes } from '../../types/responseTypes';

export const checkResponseType = (response: ResponseTypes): void => {
	if (isGetNftBalanceResponse(response)) {
		checkGetNftBalanceResponse(response);
	} else if (isGetTokenBalanceResponse(response)) {
		checkGetTokenBalanceResponse(response);
	} else if (isTransactionsResponse(response)) {
		checkTransactionsResponse(response);
	} else {
		log.error('Unexpected response type');
	}
};

const isGetNftBalanceResponse = (response: any): response is GetNftBalance => {
	return response.data && response.data.account && response.data.chain && response.data.nftBalances;
};

const isGetTokenBalanceResponse = (response: any): response is GetTokenBalance => {
	return response.data && response.data.queryInfo && response.data.totalBalance && response.data.items;
};

const isTransactionsResponse = (response: any): response is Transactions => {
	return response.data && response.data.account && response.data.chain && response.data.transactionData;
};

const checkGetNftBalanceResponse = (response: GetNftBalance): void => {
	if (!response.data || !response.data.account || !response.data.chain || !response.data.nftBalances) {
		log.error('Invalid GetNftBalance response:', response);
		return;
	}

	for (const nftBalance of response.data.nftBalances) {
		if (!nftBalance.contractAddress || !nftBalance.tokenId || !nftBalance.balance) {
			log.error('Invalid nftBalances element in GetNftBalance response:', response);
			return;
		}
	}
};

const checkGetTokenBalanceResponse = (response: GetTokenBalance): void => {};

const checkTransactionsResponse = (response: Transactions): void => {};
