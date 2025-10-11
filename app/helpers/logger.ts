import pino from 'pino';
import pretty from 'pino-pretty';
import { prismaLogStream } from './prisma-transport';

// Pretty stream for console
const prettyStream = pretty({
  colorize: true,             // Adds colors
  translateTime: 'SYS:standard',  // Translates timestamp
  ignore: 'pid,hostname'      // Optional: hide process ID and host
});

const streams = [
  { stream: prettyStream },        // Colorized console
  { stream: prismaLogStream },     // Your custom Prisma stream
];

const logger = pino(
  {
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream(streams)
);

export default logger;
