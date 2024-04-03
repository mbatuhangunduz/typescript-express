import { log } from '../../helpers/logger';
import { checkStatusCode } from '../checkResponse/checkStatusCode';
import { checkResponseType } from '../checkResponse/checkResponseType';
import { Endpoint } from '../../types/serviceTypes';
import { sendRequest } from './sendRequest';

export const sendGetRequest = async (
	token: string | undefined,
	endpoint: Endpoint,
	params: Record<string, string | number>,
) => {
	if (!token) {
		console.error('Token is undefined. Cannot send test request.');
		return;
	}
	const updatedEndpoint = { ...endpoint };
	if (endpoint.name === 'chartData') {
        updatedEndpoint.url += `?tokenContractAddress=${params.contractAddress}`;
    } 
	if (endpoint.name === 'transactions') {
        updatedEndpoint.url += `?pageNumber=${params.pageNumber}&pageSize=20`;
    }

	try {
		updatedEndpoint.headers = { Authorization: `Bearer ${token}` };
		const testResponse = await sendRequest(updatedEndpoint);
		const isSuccess = testResponse && checkStatusCode(testResponse);
		console.log('isSuccess', isSuccess);

		if (isSuccess) checkResponseType(testResponse.data);
	} catch (error: any) {
		log.error(`Get request failed with ${endpoint.name}:' + ${error.message}`);
	}
};
