// app/about/page.tsx
import Contactpage from './Contactpage';

export const metadata = {
  title: "Contact for Bulk Orders | Wholesale Enquiry – Shiv Watches",
  description: "Contact Shiv Watches for wholesale watch accessories at best prices. Visit our showroom or send an inquiry for MOQ, pricing, samples & fast delivery options.",
  keywords: ["watch accessories wholesale, wholesale watch batteries India, bulk watch orders contact, Shiv Watches showroom Delhi, watch parts supplier contact, minimum order quantity watches, buy watch accessories in bulk, contact for wholesale pricing, Delhi wholesale watch dealer"],
  alternates: {
    canonical: "https://www.shivwatches.com/contact",
  },
  openGraph: {
    title: "Contact for Bulk Orders | Wholesale Enquiry – Shiv Watches",
    description: "Contact Shiv Watches for wholesale watch accessories at best prices. Visit our showroom or send an inquiry for MOQ, pricing, samples & fast delivery options.",
    images: [
      {
        url: "/images/logo2.png",
        width: 1200,
        height: 630,
        alt: "Shiv Watches contact Page",
      },
    ],
  },
};

export default function Contact() {
  return <Contactpage />;
}