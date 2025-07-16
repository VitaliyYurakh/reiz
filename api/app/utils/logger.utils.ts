import pino from 'pino';

const transports = [];
const prettyLogging = process.env.PRETTY_LOGGING || 'true';

const prettyTransport = pino.transport({
    target: 'pino-pretty',
    level: 'debug',
});

if (prettyLogging === 'true') {
    transports.push(prettyTransport);
}

export default pino(
    {
        level: 'trace',
    },
    ...transports
);
