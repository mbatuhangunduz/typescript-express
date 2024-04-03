import { log } from '../../helpers/logger';
import { checkStatusCode } from '../checkResponse/checkStatusCode';
import { checkResponseType } from '../checkResponse/checkResponseType';
import { DecidedNetworkType, Endpoint } from '../../types/serviceTypes';
import { sendRequest } from './sendRequest';

export const sendPostRequest = async (
	token: string | undefined,
	endpoint: Endpoint,
	data: Record<string, string[] | DecidedNetworkType>
) => {
	if (!token) {
		console.error('Token is undefined. Cannot send test request.');
		return;
	}
	try {
		if(endpoint.name === "nftInformation"){
			endpoint.data.contractAddresses = data.firstTenContractAddresses
			endpoint.data.tokenIds = data.first10TokenIds
			endpoint.data.chain = data.chain
		}
		endpoint.headers = { Authorization: `Bearer ${token}` };
		const testResponse = await sendRequest(endpoint);
		const isSuccess = testResponse && checkStatusCode(testResponse);
		console.log('isSuccess', isSuccess);

		if (isSuccess) checkResponseType(testResponse.data);

	} catch (error: any) {
		log.error(`Post request failed with ${endpoint.name}:' + ${error.message}`);
	}
};
