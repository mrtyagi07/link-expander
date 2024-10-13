import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "LinkPower - Expand and Analyze URLs",
	description:
		"Expand shortened links, analyze their safety, and preview content with LinkPower.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					spaceGrotesk.className,
				)}
			>
				{children}
			</body>
		</html>
	);
}
