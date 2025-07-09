// app/about/page.tsx
import ClockRepairContent from './clockrepairpage';

export const metadata = {
  title: "Clock Repair Pickup – Free Home Service | Shiv Watches",
  description: "Book expert clock repair with free pickup & delivery in Delhi. 15+ years of experience. 6-month warranty. Fast service. Book online or via WhatsApp now!",
  keywords: ["clock repair service near me, clock repair pickup and delivery, expert clock repair Delhi, book clock repair online, free clock repair pickup, antique clock repair service, wall clock repair at home, best clock technicians in Delhi, clock not working repair, Shiv Watches clock service"],
  alternates: {
    canonical: "https://www.shivwatches.com/clock-repair",
  },
  openGraph: {
    title: "Clock Repair Pickup – Free Home Service | Shiv Watches",
    description: "Book expert clock repair with free pickup & delivery in Delhi. 15+ years of experience. 6-month warranty. Fast service. Book online or via WhatsApp now!",
    images: [
      {
        url: "/images/logo2.png",
        width: 1200,
        height: 630,
        alt: "Shiv Watches clock-repair Page",
      },
    ],
  },
};

export default function ClockRepair() {
  return <ClockRepairContent />;
}