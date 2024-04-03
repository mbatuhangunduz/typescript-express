import { writeFile } from 'fs/promises';
import { login } from './auth/login';
import Config from './config/config';
import { sendGetRequest } from './services/requestService/sendGetRequest';
import { generateRandomDelay } from './helpers/generateRandomDelay';
import { log } from './helpers/logger';
import { shuffleArray } from './helpers/shuffleArray';
import { DecidedNetworkType, Endpoint, StatisticFields } from './types/serviceTypes';
import { sendPostRequest } from './services/requestService/sendPostRequest';
import { getAccountBalance } from './services/requestService/getAccountBalance';

export const main = async (chain: DecidedNetworkType) => {
	const statistics: { [key: string]: StatisticFields } = {};
	const users = Config.users;
	// Object to store tokens for each user
  const userTokens: { [key: string]: string | undefined } = {};

	for (const user of users) {
		const loginEndpoint = Config.testEndpoints.find((endpoint) => endpoint.name === "login") as Endpoint;
		const token = await login(loginEndpoint);
		userTokens[user.email] = token; // Store the token using the email as the key
		console.log(`Token obtained: ${user.email}`);
	}

	const nftBalances = await getAccountBalance(userTokens[users[0].email], 'getNftBalance');
	const nftContractAddresses = nftBalances?.contractAddresses;
	const tokenIds = nftBalances?.tokenIds;
	console.log('nftContractAddresses', nftContractAddresses?.length);

	const tokenBalances = await getAccountBalance(userTokens[users[0].email], 'getTokenBalance');
	const tokenContractAddresses = tokenBalances?.contractAddresses;
	console.log('tokenContractAddresses', tokenContractAddresses?.length);

	const startTime = Date.now();
	let pageNumber = 0;

	while (Date.now() - startTime < Config.testDurationInMilliseconds) {
		const endpoints = shuffleArray(Config.testEndpoints);
		// Send test requests concurrently for each user
		const testRequestPromises = users.map(async (user, userIndex) => {
			let elapsedTimeMs: number;

			for (const endpoint of endpoints) {
				const url = endpoint.url;
				// Initialize the statistics object for each endpoint
				if (!statistics[url]) {
					statistics[url] = {
						totalTests: 0,
						successfulTests: 0,
						failedTests: 0,
						tests: [],
						testDurationMs: Config.testDurationInMilliseconds,
					};
				}

				const startTime = Date.now();

				try {
					// Use the previously obtained token for each user
					const userToken = userTokens[user.email];
					if (endpoint.method === 'GET') {
						if (endpoint.name === 'transactions') pageNumber += 1;
						const shuffledAddresses = shuffleArray(tokenContractAddresses as string[]);
						const params = {
							pageNumber,
							contractAddress: shuffledAddresses[0]
						}
						await sendGetRequest(userToken, endpoint, params);
					} else {
						const firstTenContractAddresses = (nftContractAddresses as string[]).slice(0, 10);
						const first10TokenIds = (tokenIds as string[]).slice(0, 10);
						const data = {
							firstTenContractAddresses,
							first10TokenIds,
							chain
						}
						await sendPostRequest(userToken, endpoint, data );
					}

					const endTime = Date.now();
					elapsedTimeMs = endTime - startTime;

					log.info(`User ${userIndex + 1} - Test request to ${url} successful. Elapsed time: ${elapsedTimeMs} ms`);

					// Update statistics
					statistics[url].tests.push({
						successful: true,
						elapsedTimeMs,
					});
					statistics[url].successfulTests++;
				} catch (error: any) {
					log.info(`User ${userIndex + 1} - Test request to ${url} failed:`, error.message);

					// If an error occurred, set elapsedTimeMs to 0
					elapsedTimeMs = 0;

					// Update statistics
					statistics[url].tests.push({
						successful: false,
						elapsedTimeMs,
					});

					// Update statistics
					statistics[url].tests.push({
						successful: false,
						elapsedTimeMs,
					});
					statistics[url].failedTests++;
				}

				// Increment total test count
				statistics[url].totalTests++;

				// Random delay between requests
				const randomDelay = generateRandomDelay(1000, 5000);
				log.info(`User ${userIndex + 1} is waiting for ${randomDelay} ms`);

				await new Promise((resolve) => setTimeout(resolve, randomDelay));
			}
		});

		await Promise.all(testRequestPromises);
	}

	const statisticsJson = JSON.stringify(statistics, null, 2);
	await writeFile('statistics.json', statisticsJson);

	log.info('Test completed. Statistics saved to statistics.json');
};
