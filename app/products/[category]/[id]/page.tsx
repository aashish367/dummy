import { supabase, normalizeCoverImage } from "@/lib/supabase";
import ProductDetail from "./ProductDetail";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Enable ISR with revalidation
export const revalidate = 3600; // Revalidate every hour
export const dynamicParams = true; // Allow dynamic params not in generateStaticParams

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  moq: number;
  category: string;
  subcategory: string;
  brand?: string;
  model?: string;
  rating: number;
  reviews: number;
  tags: string[];
  inStock: boolean;
  cover_img: string | string[]; 
  images: string[];
  specifications?: Record<string, string>;
  highlights?: string[];
  created_at?: string;
  updated_at?: string;
};

// Generate static paths for existing products
export async function generateStaticParams() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, category")
      .limit(100); // Limit for build performance

    if (error || !products) {
      console.error("Error fetching products for static params:", error);
      return [];
    }

    return products.map((product) => ({
      category: product.category,
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single<Product>();

    if (error || !product) {
      return {
        title: "Product Not Found | Shiv Watches",
        description: "Product not found. Browse our wholesale collection.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const categoryName = product.category.replace("-", " ");
const coverImage = normalizeCoverImage(product.cover_img ?? "");


    return {
      title: `${product.name} | Wholesale ${categoryName} – Shiv Watches`,
      description:
        product.description ||
        `Wholesale ${product.name} at best prices. MOQ: ${product.moq} pieces. High-quality ${categoryName.toLowerCase()} for retailers.`,
      keywords: [
        product.name.toLowerCase(),
        `wholesale ${product.name.toLowerCase()}`,
        `${categoryName.toLowerCase()} wholesale`,
        `bulk ${product.name.toLowerCase()}`,
        "wholesale supplier India",
        ...product.tags.map((tag) => tag.toLowerCase()),
      ],
      alternates: {
        canonical: `https://www.shivwatches.com/products/${product.category}/${product.id}`,
      },
      openGraph: {
        title: `${product.name} | Shiv Watches`,
        description:
          product.description || `Wholesale ${product.name} at best prices`,
        images: coverImage
          ? [
              {
                url: coverImage,
                width: 1200,
                height: 630,
                alt: product.name,
              },
            ]
          : [
              {
                url: "/images/logo2.png",
                width: 1200,
                height: 630,
                alt: "Shiv Watches",
              },
            ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product | Shiv Watches",
      description: "Wholesale products at best prices",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  try {
    const { id } = await params;

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single<Product>();

    if (error || !product) {
      notFound();
    }

    const { data: similarProducts } = await supabase
      .from("products")
      .select("*")
      .eq("category", product.category)
      .neq("id", product.id)
      .limit(4);

    return (
      <ProductDetail
        initialProduct={product}
        initialSimilarProducts={similarProducts || []}
      />
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}
