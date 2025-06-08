import { http, HttpResponse } from "msw";
import { AUTH_API_URL } from "@/config";
import type { AccountDto } from "@/dto/account";
import jwt from "jsonwebtoken";

const JWT_SECRET = "mock_secret";

const mockAccounts: AccountDto[] = [
  {
    id: "user-1",
    email: "test@example.com",
    username: "testuser",
    password: "password123",
    isActive: true,
    createdAt: new Date("2022-01-01T00:00:00Z"),
  },
  {
    id: "user-2",
    email: "admin@example.com",
    username: "admin",
    password: "adminpass",
    isActive: false,
    createdAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    id: "user-3",
    email: "guest@example.com",
    username: "guest",
    password: "guestpass",
    isActive: true,
    createdAt: new Date("2024-01-01T00:00:00Z"),
  },
];

export const authHandlers = [
  http.post(`${AUTH_API_URL}/refresh`, async ({ cookies }) => {
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      return HttpResponse.json({ error: "No access token" }, { status: 401 });
    }
    // Decode/validate access token (for mock, just check existence)
    const decoded = jwt.decode(accessToken) as { sub?: string };
    if (!decoded?.sub) {
      return HttpResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }
    // Issue new access token
    const newAccessToken = jwt.sign({ sub: decoded.sub }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ sub: decoded.sub }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return HttpResponse.json(
      { accessToken: newAccessToken },
      {
        headers: {
          "Set-Cookie": `refreshToken=${refreshToken}; Path=/; Max-Age=604800; SameSite=Lax`,
        },
      }
    );
  }),
  http.post(`${AUTH_API_URL}/signup`, async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    const existingAccount = mockAccounts.find((acc) => acc.email === email);
    if (existingAccount) {
      return HttpResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    const newAccount: AccountDto = {
      id: `user-${mockAccounts.length + 1}`,
      email,
      username: email.split("@")[0],
      password,
      isActive: true,
      createdAt: new Date(),
    };
    mockAccounts.push(newAccount);
    const accessToken = jwt.sign({ sub: newAccount.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ sub: newAccount.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return HttpResponse.json(
      { accessToken },
      {
        headers: {
          "Set-Cookie": `refreshToken=${refreshToken}; Path=/; Max-Age=604800; SameSite=Lax`,
        },
      }
    );
  }),
  http.post(`${AUTH_API_URL}/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    const acc = mockAccounts.find((acc) => acc.email === email);
    if (acc && acc.password === password) {
      const accessToken = jwt.sign({ sub: acc.id }, JWT_SECRET, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign({ sub: acc.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return HttpResponse.json(
        { accessToken },
        {
          headers: {
            "Set-Cookie": `refreshToken=${refreshToken}; Path=/; Max-Age=604800; SameSite=Lax`,
          },
        }
      );
    }
    return HttpResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }),
  http.post(`${AUTH_API_URL}/logout`, async () => {
    return HttpResponse.json(
      { success: true },
      {
        headers: {
          "Set-Cookie": "refreshToken=; HttpOnly; Path=/; Max-Age=0",
        },
      }
    );
  }),
];
