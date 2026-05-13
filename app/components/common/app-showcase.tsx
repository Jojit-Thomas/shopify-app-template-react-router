import React from "react";
import { ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

interface AppItemProps {
  appUrl: string;
  imageUrl: string;
  title: string;
  shortDescription: string;
  longDescription: string;
}

const AppItem: React.FC<AppItemProps> = ({ appUrl, imageUrl, title, shortDescription, longDescription }) => {
  const section2Markup = (
    <>
      {/* Long Description (moves outside the flex-row) */}
      <p className="text-sm text-muted-foreground mt-4 mb-2">{longDescription}</p>

      {/* Button */}
      <Link to={appUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "secondary" })}>
        Add app
      </Link>
    </>
  );
  return (
    <Card className="mb-8">
      <CardContent>
        <div className="flex flex-row items-start">
          {/* Image */}
          <div className="shrink-0 mr-4">
            <Link to={appUrl} target="_blank" rel="noopener noreferrer">
              <div className="w-16 h-16 sm:w-30 sm:h-30 lg:w-20 lg:h-20">
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Title + Short Description */}
          <div className="grow mt-4 sm:mt-0">
            <div className="flex flex-col">
              <Link
                to={appUrl}
                className="text-lg font-medium hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </Link>
              <p className="text-sm font-medium text-muted-foreground mt-1 sm:mt-0">{shortDescription}</p>
              <div className="sm:block hidden lg:hidden">{section2Markup}</div>
            </div>
          </div>
        </div>
        <div className="block lg:block sm:hidden">{section2Markup}</div>
      </CardContent>
    </Card>
  );
};

const apps = [
  {
    appUrl: "https://apps.shopify.com/theme-on-time",
    imageUrl: "https://giftify-mm.herokuapp.com/_next/image?url=%2Ftot.png&w=128&q=75",
    title: "Theme on Time",
    shortDescription: "Automate Theme Changes",
    longDescription:
      "Run & automate sales with ease. Schedule theme changes in accordance with your sales. Automate your theme publishing to coordinate with your online sale times.",
  },
  {
    appUrl: "https://apps.shopify.com/giftify-3",
    imageUrl: "https://theme-on-time.herokuapp.com/_next/image?url=%2Fgift.png&w=128&q=75",
    title: "Giftify",
    shortDescription: "Create a special gifting experience through your store",
    longDescription:
      "Allow your customers to send your products as gifts, directly to friends and family. Provide the opportunity for your customers to send gifts with immediate gifting notifications and optional shipping and tracking details along the way.",
  },
  {
    appUrl: "https://apps.shopify.com/rebuyify",
    imageUrl: "https://cdn.shopify.com/s/files/applications/3eb7ec45bb5a2736e48c7390ec380664_200x200.png?1683553336",
    title: "Resend",
    shortDescription: "Send repurchase reminders for orders.",
    longDescription:
      "Automate retention techniques by prompting previous customers to repurchase previously purchased products. Send reminders based on conditions.",
  },
  {
    appUrl: "https://apps.shopify.com/shopbnb",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0704/7767/6761/files/354225515_103278669477237_3991112018883425637_n.jpg?v=1738703683",
    title: "ShopSTR",
    shortDescription: "Book Everything",
    longDescription:
      "Create your very own website for your vacation rental & experiences business. With ShopSTR you can now quickly and easily create, manage and sell your stays and book directly.",
  },
];

const AppShowcase: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="flex justify-between my-4">
        <h4 className="text-xl font-semibold">Other apps powered by Minion</h4>
        <div className="text-center lg:text-left">
          Made with ❤ &amp; ☕ in New York by{" "}
          <Link
            to="https://minionmade.com"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Minion
          </Link>
          .
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid lg:grid-cols-2 gap-3">
            {apps.map((app, index) => (
              <AppItem
                key={index}
                appUrl={app.appUrl}
                imageUrl={app.imageUrl}
                title={app.title}
                shortDescription={app.shortDescription}
                longDescription={app.longDescription}
              />
            ))}
          </div>

          <Link
            to="https://apps.shopify.com/partners/minion-made"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "link" })}
          >
            VIEW ALL APPS <ArrowRightIcon className="ml-2" size={16} />
          </Link>
        </div>

        <Card className="lg:col-span-1 h-min">
          <CardContent>
            <div>
              <h4 className="text-xl font-semibold mb-4">Support services by Minion</h4>
              <p className="font-medium mb-2">In need of ongoing support? Enroll in our support retainer service!</p>
              <p className="text-muted-foreground mb-4">
                As a top Shopify &amp; Shopify Plus expert, we can help. Allow Minion and our entire team here to become
                an extension of your team. We can help manage your site, make ongoing SEO and performance enhancement
                adjustments, and of course provide you with any necessary and needed support on an ongoing basis.
              </p>
              <Link
                to="https://minionmade.com/#contact"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "secondary" })}
              >
                Learn More
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppShowcase;
