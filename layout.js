export const metadata = {
  title: "CartCollage",
  description: "Visual shopping cart collage app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
