import ProductListing from '../ProductListingpage';
import { getCategories, getCategoryDetails } from '@/lib/supabase';
import type { Metadata } from 'next';

// Enable ISR
export const revalidate = 3600; // Revalidate every hour
export const dynamicParams = true; // Allow dynamic params

// Generate static params for known categories
export async function generateStaticParams(): Promise<{ category: string }[]> {
  try {
    const categories = await getCategories();
    return categories.map((category: string) => ({
      category,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata for each category
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  
  // Category-specific metadata mapping
  const categoryMetadata: Record<string, any> = {
    'speakers': {
      title: "Wholesale Bluetooth Speakers | Best Prices & Quality – Shiv Watches",
      description: "Buy premium Bluetooth speakers in bulk at wholesale prices. High-quality sound systems for retailers. Fast delivery across India. MOQ available.",
      keywords: ["wholesale bluetooth speakers", "bulk speakers India", "portable speakers wholesale", "wireless speakers supplier", "audio equipment bulk", "speakers for resale", "wholesale electronics India"]
    },
    'wrist-watches': {
      title: "Wholesale Wrist Watches | Analog & Digital Watches Bulk – Shiv Watches", 
      description: "Premium wrist watches at wholesale prices. Analog, digital, sports watches in bulk. Best quality watches for retailers across India. Competitive MOQ.",
      keywords: ["wholesale wrist watches", "bulk watches India", "analog watches wholesale", "digital watches supplier", "sports watches bulk", "watch retailer supplier", "wholesale timepieces"]
    },
    'wall-clocks': {
      title: "Wholesale Wall Clocks | Decorative & Silent Wall Clocks Bulk – Shiv Watches",
      description: "Stylish wall clocks at wholesale prices. Decorative, silent, vintage wall clocks in bulk. Perfect for home decor retailers. Fast India delivery.",
      keywords: ["wholesale wall clocks", "bulk wall clocks India", "decorative clocks wholesale", "silent wall clocks bulk", "home decor clocks", "wall clock supplier", "wholesale timepieces"]
    },
    'table-clocks': {
      title: "Wholesale Table Clocks | Desk & Alarm Clocks Bulk – Shiv Watches",
      description: "Premium table clocks at wholesale rates. Desk clocks, alarm clocks, decorative table clocks in bulk. Quality timepieces for retailers.",
      keywords: ["wholesale table clocks", "bulk desk clocks", "alarm clocks wholesale", "decorative table clocks", "office clocks bulk", "table clock supplier India"]
    },
    'home-appliances': {
      title: "Wholesale Home Appliances | Kitchen & Electronic Appliances Bulk – Shiv Watches",
      description: "Quality home appliances at wholesale prices. Kitchen appliances, electronic gadgets in bulk. Reliable supplier for retailers across India.",
      keywords: ["wholesale home appliances", "bulk kitchen appliances", "electronic appliances wholesale", "home gadgets bulk", "appliance supplier India"]
    },
    'accessories': {
      title: "Wholesale Watch Accessories | Straps, Batteries & Parts Bulk – Shiv Watches",
      description: "Complete range of watch accessories at wholesale prices. Watch straps, batteries, repair parts in bulk. Best supplier for watch retailers.",
      keywords: ["wholesale watch accessories", "watch straps bulk", "watch batteries wholesale", "watch parts supplier", "watch repair accessories", "timepiece accessories bulk"]
    }
  };

  const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const defaultMetadata = {
    title: `Wholesale ${categoryName} | Best Prices & Quality – Shiv Watches`,
    description: `Premium ${categoryName.toLowerCase()} at wholesale prices. High-quality products in bulk for retailers across India. Competitive MOQ and fast delivery.`,
    keywords: [`wholesale ${categoryName.toLowerCase()}`, `bulk ${categoryName.toLowerCase()} India`, `${categoryName.toLowerCase()} supplier`]
  };

  const metadata = categoryMetadata[category] || defaultMetadata;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: `https://www.shivwatches.com/products/${category}`,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: "/images/logo2.png",
          width: 1200,
          height: 630,
          alt: `Shiv Watches ${categoryName}`,
        },
      ],
    },
  };
}

export default function CategoryPage() {
  return <ProductListing />;
}