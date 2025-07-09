// app/about/page.tsx
import AboutPage from './AboutPage';

export const metadata = {
  title: "About Us - 15+ Years of Wholesale Excellence | Shiv Watches",
  description: "Learn about Shiv Watches' journey from a small Delhi business to India's trusted wholesale partner for watches, clocks, and home appliances.",
  keywords: ["about shiv watches", "wholesale company history", "watch supplier Delhi", "wholesale business story", "trusted wholesale partner"],
  alternates: {
    canonical: "https://www.shivwatches.com/about",
  },
  openGraph: {
    title: "About Us - 15+ Years of Wholesale Excellence | Shiv Watches",
    description: "Learn about Shiv Watches' journey from a small Delhi business to India's trusted wholesale partner for watches, clocks, and home appliances.",
    images: [
      {
        url: "/images/logo2.png",
        width: 1200,
        height: 630,
        alt: "Shiv Watches About Page",
      },
    ],
  },
};

export default function About() {
  return <AboutPage />;
}