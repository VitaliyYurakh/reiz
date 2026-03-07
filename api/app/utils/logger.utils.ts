import pino from 'pino';
import {env} from '../config/env';
import {requestContext} from '../config/request-context';

const transports = [];
const prettyLogging = env.PRETTY_LOGGING || 'true';

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
        mixin() {
            const store = requestContext.getStore();
            return store ? {requestId: store.requestId} : {};
        },
    },
    ...transports
);
