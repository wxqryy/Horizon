import type { Metadata, Viewport  } from "next";
import Header from "wxqryy/components/Head/Header";
import "./globals.css";
import { AuthProvider } from 'wxqryy/components/AuthProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};


export const metadata: Metadata = {
  title: "Horizon",
  description: "Horizon is a platform for students to find internships easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <div className="app-wrapper">
            <Header />
            <main className="main-content-wrapper">
              {children}
            </main>
          </div>
          </AuthProvider>
      </body>
    </html>
  );
}