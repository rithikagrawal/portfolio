import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rithik Agrawal | Senior Software Engineer — Terminal Portfolio',
  description:
    'Interactive 3D Linux Terminal Portfolio of Rithik Agrawal. Senior Full Stack Engineer specializing in Python, Flask, FastAPI, Angular, and Distributed Systems.',
  keywords: [
    'Rithik Agrawal',
    'Senior Software Engineer',
    'Full Stack Developer',
    'Python',
    'FastAPI',
    'Flask',
    'Angular',
    'PostgreSQL',
    'Microservices',
    'Terminal Portfolio',
    '3D Portfolio',
  ],
  authors: [{ name: 'Rithik Agrawal', url: 'https://github.com/rithik-agrawal' }],
  openGraph: {
    title: 'Rithik Agrawal | Senior Software Engineer [Terminal OS]',
    description:
      'Enter the 3D Linux terminal portfolio. Explore engineering systems, enterprise architecture, and verified metrics.',
    type: 'website',
    url: 'https://rithik.us.cc',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono bg-[#0a0800] text-[#ffb000] antialiased selection:bg-[#ffb000] selection:text-[#0a0800]">
        {children}
      </body>
    </html>
  );
}
