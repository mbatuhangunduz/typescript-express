import { log } from '../helpers/logger';
import { sendRequest } from '../services/requestService/sendRequest';
import { Endpoint } from '../types/serviceTypes';

export const login = async (endpoint: Endpoint): Promise<string | undefined> => {
	try {
		const res = await sendRequest(endpoint)
		return res.data.tokens.access.token;
	} catch (err: any) {
		log.info(`Login for ${endpoint.data.email} failed:`, err.message);
		throw err
	}
};
