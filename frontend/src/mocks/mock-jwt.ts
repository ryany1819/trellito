
import { jwtDecode } from "jwt-decode";

export function mockSign(payload: object): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.mock_signature`;
}

export function mockDecode<T>(token: string): T {
    return jwtDecode<T>(token);
}