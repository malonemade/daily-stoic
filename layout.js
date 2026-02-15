import { EB_Garamond, Cormorant } from "next/font/google";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const cormorant = Cormorant({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
});

export const metadata = {
  title: "Daily Stoic — AI-Powered Meditations",
  description:
    "Receive a fresh Stoic reflection each day, generated in the voice of history's greatest philosophers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${cormorant.variable}`}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
