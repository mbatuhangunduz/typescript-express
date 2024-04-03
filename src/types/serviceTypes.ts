export type DecidedNetworkType = 'ETH' | 'BSC' | 'MATIC' | 'FANTOM' | 'GOERLI';

export interface Endpoint {
	name: 'login' | 'getNftBalance' | 'getTokenBalance' | 'chartData' | 'transactions' | 'nftInformation';
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	url: string;
    headers?: any;
    data?: any;
    params?: string;
}

export interface StatisticFields {
    totalTests: number;
    successfulTests: number;
    failedTests: number;
    testDurationMs: number;
    tests: Array<{ successful: boolean; elapsedTimeMs: number }>;
}


