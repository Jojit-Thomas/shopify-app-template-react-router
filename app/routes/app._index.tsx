import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { getShopifyClient, graphql } from "@/helpers/get-shopify-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];

  const client = await getShopifyClient(session.shop);

  const response = await client.request(
    graphql(`
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }
    `),
    {
      product: {
        title: `${color} Snowboard`,
      },
    },
  );

  const product = response!.productCreate!.product!;
  const variantId = product.variants.edges[0]!.node!.id!;

  const variantResponse = await client.request(
    graphql(`
      mutation shopifyReactRouterTemplateUpdateVariant(
        $productId: ID!
        $variants: [ProductVariantsBulkInput!]!
      ) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants {
            id
            price
            barcode
            createdAt
          }
        }
      }
    `),
    {
      productId: product.id,
      variants: [{ id: variantId, price: "100.00" }],
    },
  );

  return {
    product: response.productCreate!.product,
    variant: variantResponse!.productVariantsBulkUpdate!.productVariants,
  };
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();

  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Hello World</CardTitle>
          <CardDescription>
            Generate a new product with a random color
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={generateProduct}
            disabled={fetcher.state === "submitting"}
          >
            {fetcher.state === "submitting" ? "Generating..." : "Generate Product"}
          </Button>
          {fetcher.data && (
            <div className="mt-4">
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(fetcher.data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
