import { IncomingMessage, ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
declare const context: ({ req, res }: {
    req: IncomingMessage;
    res: ServerResponse;
}) => Promise<string | jwt.JwtPayload>;
export default context;
