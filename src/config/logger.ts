import { createConsola } from 'consola/browser';

const logger = createConsola({}).withTag('affiliate');


logger.wrapConsole();


export default logger;
