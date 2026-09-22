import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

// Inter: body, UI and supporting text. A variable font, so one file covers every weight the site uses.
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

// Poppins: headings and display text. Not variable, so only the weights the site uses are loaded.
const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "DataTwin — Finance observability for the office of the CFO",
  description:
    "DataTwin finds the money your finance team has already lost, gets it back, then checks every transaction in real time so it doesn't happen again.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        {/* Applies the saved theme before first paint, so a refresh never flashes the other one. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full">
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
