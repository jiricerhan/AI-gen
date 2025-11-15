import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GenUI',
  description: 'Generated UI with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <script src="https://cdn.tailwindcss.com" async></script>
        {children}
      </body>
    </html>
  );
}
