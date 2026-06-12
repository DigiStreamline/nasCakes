import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NasCakes | Custom Cakes, East Burdwan",
  description: "Handcrafted custom cakes made with passion in East Burdwan. Every cake is baked to order and designed just for you.",
  openGraph: {
    title: "NasCakes | Custom Cakes",
    description: "Handcrafted custom cakes made with passion in East Burdwan.",
    images: ["/photos/photo_0.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
