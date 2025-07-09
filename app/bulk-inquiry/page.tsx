// app/about/page.tsx
import BulkInquiryContent from './bulkInquiryPage';

export const metadata = {
  title: "Bulk Inquiry - Bulk Inquiry & Quote Request | Shiv Watches",
  description: "Get competitive wholesale pricing for your business. Fill out the form below and receive a detailed quotation within 2 hours.",
  keywords: ["bulk inquiry for watch accessories, wholesale watch batteries supplier, watch parts in bulk, watch straps in bulk, buy button batteries wholesale, wall clocks bulk wholesale"],
  alternates: {
    canonical: "https://www.shivwatches.com/bulk-inquiry",
  },
  openGraph: {
    title: "Bulk Inquiry - Bulk Inquiry & Quote Request | Shiv Watches",
    description: "Get competitive wholesale pricing for your business. Fill out the form below and receive a detailed quotation within 2 hours.",
    images: [
      {
        url: "/images/logo2.png",
        width: 1200,
        height: 630,
        alt: "Shiv Watches bulk inquiry Page",
      },
    ],
  },
};

export default function BulkInquiry() {
  return <BulkInquiryContent />;
}