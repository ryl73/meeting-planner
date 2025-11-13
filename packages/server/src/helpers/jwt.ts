import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'supersecret'
);

export async function signJwt(payload: JWTPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET);
}

export async function verifyJwt(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
}
