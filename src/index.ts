import app from './app';
import { main } from './main';
import { log } from './helpers/logger';

declare global {
	namespace Express {
		interface Request {}
	}
}

export const env: 'DEV' | 'PROD' = process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD';

const selectedPort = '8090';

app.listen(selectedPort, async () => {
	try {
		log.info(`Node environment : ${env}`);
		log.info(`Server running on port : ${selectedPort}`);
		await main('ETH');
	} catch (error: any) {
		log.error('Error: ' + error.message || error);
	}
}).on('error', (e: any) => log.error(e));
