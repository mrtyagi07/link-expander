"use client";

import {
	Search,
	Zap,
	Copy,
	Shield,
	ExternalLink,
	AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLinkExpander } from "@/lib/hooks/useLinkExpander";
import Image from "next/image";
import Link from "next/link";
import { IconX } from "./ui/icons";

export function Dashboard() {
	const {
		inputUrl,
		setInputUrl,
		expandedData,
		linkHistory,
		isLoading,
		handleExpand,
		copyToClipboard,
		clearHistory,
	} = useLinkExpander();

	return (
		<div className="min-h-screen bg-background text-foreground p-4">
			<header className="border-b mb-4">
				<div className="container mx-auto py-2 flex items-center justify-between">
					<motion.div
						className="flex items-center space-x-2"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Zap className="h-5 w-5" />
						<span className="text-lg font-semibold">LinkPower</span>
					</motion.div>
					<div className="flex-1 max-w-md mx-4">
						<div className="relative">
							<Input
								type="text"
								placeholder="Enter shortened link..."
								className="w-full pl-8 pr-2 py-1 text-sm"
								value={inputUrl}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setInputUrl(e.target.value)
								}
							/>
							<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						</div>
					</div>
					<Button
						disabled={isLoading}
						onClick={handleExpand}
						variant="default"
						size="sm"
					>
						Expand
					</Button>
				</div>
			</header>

			<main className="container mx-auto flex flex-col lg:flex-row gap-4">
				<Card className="flex-grow">
					<CardHeader className="py-3">
						<CardTitle className="text-lg">Link Expansion Result</CardTitle>
					</CardHeader>
					<CardContent className="py-2">
						<AnimatePresence mode="wait">
							{expandedData ? (
								<motion.div
									key="result"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
									className="space-y-3"
								>
									<div className="flex items-center justify-between text-sm">
										<span className="font-medium">Full URL:</span>
										<div className="flex items-center space-x-2">
											<span className="text-xs truncate max-w-[200px]">
												{expandedData.expandedUrl}
											</span>
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6"
												onClick={() =>
													copyToClipboard(expandedData.expandedUrl)
												}
											>
												<Copy className="h-3 w-3" />
											</Button>
										</div>
									</div>
									<div>
										<h4 className="text-xs font-medium">Website Title</h4>
										<p className="text-xs text-muted-foreground">
											{expandedData.title}
										</p>
									</div>
									<div>
										<h4 className="text-xs font-medium">Description</h4>
										<p className="text-xs text-muted-foreground">
											{expandedData.description}
										</p>
									</div>
									<motion.div
										className={`flex items-center space-x-2 p-2 rounded-md ${expandedData.isSafe ? "bg-green-100" : "bg-red-100"}`}
										initial={{ scale: 0.9 }}
										animate={{ scale: 1 }}
										transition={{ type: "spring", stiffness: 500, damping: 30 }}
									>
										{expandedData.isSafe ? (
											<Shield className="h-4 w-4 text-green-500" />
										) : (
											<AlertTriangle className="h-4 w-4 text-red-500" />
										)}
										<span
											className={`text-xs ${expandedData.isSafe ? "text-green-700" : "text-red-700"}`}
										>
											{expandedData.isSafe
												? "This link is safe"
												: "This link may be unsafe"}
										</span>
									</motion.div>

									<div className="aspect-video bg-muted rounded-md overflow-hidden">
										{expandedData && (
											<Image
												src={`https://api.microlink.io/?url=${encodeURIComponent(expandedData.expandedUrl)}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.isMobile=true&viewport.deviceScaleFactor=1&viewport.width=1280&viewport.height=720`}
												alt="Website Preview"
												width={640}
												height={360}
												className="w-full h-full object-cover"
												priority
											/>
										)}
									</div>
									<Button
										className="w-full"
										variant="outline"
										size="sm"
										onClick={() =>
											window.open(expandedData.expandedUrl, "_blank")
										}
									>
										<ExternalLink className="mr-2 h-3 w-3" />
										View Site
									</Button>
								</motion.div>
							) : (
								<motion.p
									key="placeholder"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-center text-sm text-muted-foreground"
								>
									Enter a shortened link and click "Expand" to see the results.
								</motion.p>
							)}
						</AnimatePresence>
					</CardContent>
				</Card>

				<Card className="w-full lg:w-72">
					<CardHeader className="py-3">
						<CardTitle className="text-lg">Link History</CardTitle>
					</CardHeader>
					<CardContent className="py-2">
						<ScrollArea className="h-[250px]">
							<AnimatePresence>
								{linkHistory.map((link, index) => (
									<motion.div
										key={index.toString()}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.2, delay: index * 0.1 }}
										className="mb-2 p-2 border rounded-md"
									>
										<p className="text-xs text-muted-foreground">
											{link.original}
										</p>
										<p className="text-xs font-medium truncate">
											{link.expanded}
										</p>
										<div className="flex justify-between items-center mt-1">
											<span className="text-[10px] text-muted-foreground">
												{link.date}
											</span>
											<div className="flex items-center space-x-1">
												{link.safe ? (
													<Shield className="h-3 w-3 text-green-500" />
												) : (
													<AlertTriangle className="h-3 w-3 text-red-500" />
												)}
												<Button
													variant="ghost"
													size="icon"
													className="h-5 w-5"
													onClick={() => copyToClipboard(link.expanded)}
												>
													<Copy className="h-3 w-3" />
												</Button>
											</div>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</ScrollArea>
					</CardContent>
					<CardFooter className="py-2">
						<Button
							variant="outline"
							size="sm"
							className="w-full text-xs"
							onClick={clearHistory}
						>
							Clear History
						</Button>
					</CardFooter>
				</Card>
			</main>

			<footer className="mt-4 border-t">
				<div className="container mx-auto py-2 flex justify-end items-center text-xs">
					<Link
						href="https://x.com/mrtyagi07"
						target="_blank"
						prefetch={false}
						className="text-muted-foreground"
					>
						@mrtyagi07
					</Link>
				</div>
			</footer>
		</div>
	);
}
