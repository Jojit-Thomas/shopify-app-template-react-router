import { GraphQLClient } from "graphql-request";
import type { ResponseMiddleware } from "graphql-request";
import { initGraphQLTada } from "gql.tada";
import type { introspection } from "shopify-graphql";
import db from "@/db.server";
import { CustomError } from "./custom-error";
import { ApiVersion } from "@shopify/shopify-app-react-router/server";

// Type definitions for Shopify response structure
interface UserError {
  message: string;
  field?: string[];
}

interface ShopifyResponse {
  [key: string]: unknown;
  userErrors?: UserError[];
}

// Helper function to find userErrors in response data
const findUserErrors = (data: ShopifyResponse | unknown): UserError[] => {
  const errors: UserError[] = [];
  const traverse = (obj: unknown): void => {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
    } else {
      const keys = ["userErrors"];
      Object.entries(obj).forEach(([key, value]) => {
        if (keys.includes(key) && Array.isArray(value) && value.length > 0) {
          errors.push(...value);
        } else {
          traverse(value);
        }
      });
    }
  };
  traverse(data);
  return errors;
};

// Function to create Shopify client
export const getShopifyClient = async (
  shop: string,
): Promise<GraphQLClient> => {
  const getShopData = await db.session.findFirst({
    where: { shop },
    select: { accessToken: true },
  });

  if (!getShopData) throw new CustomError(`Shop not found: ${shop}`);

  const responseMiddleware: ResponseMiddleware = (response) => {
    const userErrors = findUserErrors(response);
    if (userErrors.length > 0) {
      throw new CustomError(`UserError: ${JSON.stringify(userErrors)}`);
    }
  };

  const client = new GraphQLClient(
    `https://${shop}/admin/api/${ApiVersion.January25}/graphql.json`,
    {
      headers: { "X-Shopify-Access-Token": getShopData.accessToken },
      responseMiddleware,
    },
  );

  return client;
};

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    URL: string;
    Decimal: string;
    DateTime: string;
  };
}>();
