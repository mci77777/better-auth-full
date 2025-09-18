import { betterAuth } from "better-auth";
import { emailOTP, jwt /*, bearer, phoneNumber, oauth */ } from "better-auth/plugins";
import { Pool } from "pg";

const {
  DATABASE_URL,
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  CLIENT_ORIGIN,
} = process.env;

export const auth = betterAuth({
  basePath: "/api/auth",
  secret: BETTER_AUTH_SECRET!,

  trustedOrigins: [CLIENT_ORIGIN ?? "http://localhost:3000"],

  database: new Pool({
    connectionString: DATABASE_URL,
    ssl: /supabase\.co/.test(DATABASE_URL ?? "") ? { rejectUnauthorized: false } : undefined,
  }),

  // 基础：邮箱密码 + 邮箱验证
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      console.info(`[reset-password] ${user.email} -> ${url}`);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.info(`[verify-email] ${user.email} -> ${url}`);
    },
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        console.info(`[email-otp:${type}] ${email} -> ${otp}`);
        // TODO: 使用 nodemailer/第三方服务发送
      },
    }),
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          sub: user.id,
          email: user.email,
          role: user.role ?? "user",
        }),
        issuer: BETTER_AUTH_URL,
        audience: BETTER_AUTH_URL,
        expirationTime: "15m",
      },
      jwks: {
        keyPairConfig: {
          alg: "EdDSA",
          crv: "Ed25519"
        }
      },
    }),

    // 可选：允许使用 Authorization: Bearer 访问 better-auth（谨慎）
    // bearer(),

    // 可选：手机号 OTP（需在插件中配置发送器）
    // phoneNumber({ sendOTP: async ({ phoneNumber, otp, type }) => { ... } }),

    // 可选：OAuth（Google/GitHub 等）—— 需要各自的 clientId/clientSecret
    // oauth({ providers: [ google({ clientId: '', clientSecret: '' }) ] })
  ],
});

