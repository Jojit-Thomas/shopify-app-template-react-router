import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to the App</h1>
      {showForm ? (
        <Form method="get" action="/auth" className="flex gap-3  ">
          <Input
            type="text"
            name="shop"
            placeholder="Enter your shop domain"
            className="my-auto"
            required
          />
          <Button type="submit">Log in</Button>
        </Form>
      ) : (
        <p>Please log in to continue.</p>
      )}
    </div>
  );
}
