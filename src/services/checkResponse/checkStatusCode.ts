import { AxiosResponse } from 'axios';

export const checkStatusCode = (response: AxiosResponse): boolean => {
	const statusCode = response.data.statusCode;

	return statusCode === 200;
};
