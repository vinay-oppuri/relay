import { db, NICHE_TEMPLATES, schema } from "@repo/db";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { requiredEnv } from "./req-env";
import { sendSignInCode } from "./resend-mail";

export const auth = betterAuth({
  appName: "Relay",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
    transaction: true,
  }),
  socialProviders: {
    google: {
      clientId: requiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requiredEnv("GOOGLE_CLIENT_SECRET"),
      prompt: "select_account",
    },
  },
  user: {
    additionalFields: {
      nicheTemplate: {
        type: "string",
        input: true,
        required: false,
      },
    },
  },
  advanced: {
    cookiePrefix: "relay",
    database: {
      generateId: "uuid",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          validateNicheTemplate(user.nicheTemplate);
          return { data: user };
        },
      },
      update: {
        before: async (user) => {
          validateNicheTemplate(user.nicheTemplate);
          return { data: user };
        },
      },
    },
  },
  plugins: [
    emailOTP({
      expiresIn: 600,
      allowedAttempts: 5,
      storeOTP: "hashed",
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type !== "sign-in") {
          throw new Error(`Unsupported OTP type: ${type}.`);
        }

        await sendSignInCode(email, otp);
      },
    }),
    nextCookies(),
  ],
});

function validateNicheTemplate(template: unknown) {
  if (
    template !== undefined &&
    template !== null &&
    !NICHE_TEMPLATES.some((supported) => supported === template)
  ) {
    throw new APIError("BAD_REQUEST", {
      message: "Choose a supported niche template.",
    });
  }
}
