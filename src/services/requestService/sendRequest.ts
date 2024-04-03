import axios, { AxiosResponse } from 'axios';
import { Endpoint } from '../../types/serviceTypes';
import { log } from '../../helpers/logger';

export const sendRequest = async (endpoint: Endpoint): Promise<AxiosResponse<any, any>> => {
	try {
        
		const { url, method, data, headers } = endpoint;
		const res = await axios({
			method,
			url,
			data,
			headers,
		});
		return res;
		
	} catch (err: any) {
		log.error(`Send request failed with ${endpoint.name} Error is: ${err.message}`);
		throw err;
	}
	
};