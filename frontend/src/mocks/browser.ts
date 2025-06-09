import { setupWorker } from 'msw/browser';
import { boardHandlers } from './board-handlers';
import { authHandlers } from './auth-handlers';
import { userHandlers } from './user-handlers';

export const worker = setupWorker(...boardHandlers, ...authHandlers, ...userHandlers);
