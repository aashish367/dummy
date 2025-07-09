import type { Metadata } from "next";

type DynamicMetadataProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonicalUrl?: string;
};

export const generateMetadata = ({
  title = "Shop Wholesale Batteries, Clocks & More | ShivWatches",
  description = "Find the best deals on wholesale gift items and home appliances at Shiv watches, your go-to source for affordable and high-quality products.",
  keywords = ["wholesale batteries", "clocks", "home appliances", "ShivWatches"],
  image = "/images/og-default.jpg",
  canonicalUrl,
}: DynamicMetadataProps): Metadata => {
  const fullTitle = title.includes("ShivWatches") 
    ? title 
    : `${title} | ShivWatches`;

  return {
    title: fullTitle,
    description,
    keywords,
    icons: {
      icon: "/images/fevicon.png",
    },
    themeColor: "#FFA500",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: fullTitle,
      description,
      images: [image],
      type: "website",
    },
    ...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
  };
};