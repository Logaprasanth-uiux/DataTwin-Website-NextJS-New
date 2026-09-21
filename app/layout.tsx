import type { Metadata } from "next";
import { Manrope, Darker_Grotesque } from "next/font/google";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const darkerGrotesque = Darker_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
      className={`${manrope.variable} ${darkerGrotesque.variable} h-full antialiased`}
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
