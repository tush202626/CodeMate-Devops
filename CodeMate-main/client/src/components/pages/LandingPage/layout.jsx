import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Codemate - Collaborative Code Editor",
  description:
    "A powerful collaborative code editor that brings teams together. Write, execute, and share code seamlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
