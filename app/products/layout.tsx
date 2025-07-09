export const metadata = {
  title: "Wholesale Watch Accessories & clocks | All Products – Shiv Watches",
  description: "Explore all wholesale products at Shiv Watches. From button batteries to straps & speakers — best bulk prices, fast delivery & trusted by 1000+ resellers in India.",
  keywords: ["wholesale watch accessories, bulk watch batteries India, watch parts supplier, wholesale clock accessories, button cell batteries bulk, watch straps wholesale, buy in bulk for resale, best watch accessories for resellers, cheap wholesale electronics India, Shiv Watches all products"],
  alternates: {
    canonical: "https://www.shivwatches.com/products",
  },
  openGraph: {
    title: "Wholesale Watch Accessories & clocks | All Products – Shiv Watches",
    description: "Explore all wholesale products at Shiv Watches. From button batteries to straps & speakers — best bulk prices, fast delivery & trusted by 1000+ resellers in India.",
    images: [
      {
        url: "/images/logo2.png",
        width: 1200,
        height: 630,
        alt: "Shiv Watches products Page",
      },
    ],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}