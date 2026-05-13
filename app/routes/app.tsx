import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";

import { authenticate } from "../shopify.server";
import AppLayoutWrapper from "@/components/common/app-layout-wrapper";
import Sidebar from "@/components/common/sidebar";
import MobileTabs from "@/components/common/mobile-tabs";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppLayoutWrapper>
      <AppProvider embedded apiKey={apiKey}>
        <div className="relative h-full w-full pb-[38px] md:pb-0">
          <div className="flex h-full w-full relative p-6 gap-5">
            <Sidebar />
            {/* Padding added here for not to cut scroll area */}
            <div className="grow overflow-auto p-3">
              <Outlet />
            </div>
          </div>
          <MobileTabs />
        </div>
      </AppProvider>
    </AppLayoutWrapper>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
