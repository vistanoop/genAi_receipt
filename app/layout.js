import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "AI Receipt Reader",
  description: "Extract data from receipts using AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <main className="min-h-screen">{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
