import { DecidedNetworkType } from "./serviceTypes";
export type ResponseTypes = GetNftBalance | GetTokenBalance | Transactions;

export interface GetNftBalance {
	statusCode: number;
	message: string;
	data: {
		account: string;
		chain: DecidedNetworkType;
		nftBalances: [
			{
				contractAddress: string;
				tokenId: string;
				balance: string;
			},
		];
	};
}

export interface GetTokenBalance {
	statusCode: number;
	message: string;
	data: {
		queryInfo: {
			address: string;
			currency: string;
			chainId: number;
		};
		totalBalance: number;
		items: [
			{
				name: string;
				symbol: string;
				contractAddress: string;
				logoUrl?: string;
				amount: string;
				unitPrice: number;
				diffRate: number;
				isWatchListElement: boolean;
				isHide: boolean;
				isNative: boolean;
				color: string;
			},
		];
	};
}

export interface Transactions {
	statusCode: number;
	message: string;
	data: {
		isError: boolean;
		account: string;
		chain: DecidedNetworkType;
		nativeCoin: string;
		currencyChoice: string;
		requestedPageNumber: number;
		requestedPageSize: number;
		total: number;
		totalPageCount: number;
		returnedPageNumber: number;
		returnedPageSize: number;
		transactionData: [
			{
				blockHash: string;
				blockNumber: string;
				hash: string;
				nonce: string;
				timestamp: number;
				status: number;
				from: string;
				to: string;
				type: string;
				transactionFee: string;
				transactionFeeUSD: number;
				chain: DecidedNetworkType;
				nativeCoinPriceUSD: number;
				nativeCoinLogo?: string;
			},
		];
	};
}
