import "./globals.css";

export const metadata = {
  title: "AI Receipt Reader",
  description: "Extract data from receipts using AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
