"use client";

import { useState } from "react";
import {
	Search,
	Zap,
	Copy,
	Shield,
	ExternalLink,
	AlertTriangle,
	Check,
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLinkExpander } from "@/lib/hooks/useLinkExpander";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

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

	const [isCopied, setIsCopied] = useState(false);
	const [copiedLinkIndex, setCopiedLinkIndex] = useState<number | null>(null);

	const { push } = useRouter();

	const handleCopy = (text: string) => {
		copyToClipboard(text);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<div className="min-h-screen bg-background text-foreground p-4">
			<header className="border-b mb-6">
				<div className="container mx-auto py-4 flex flex-col sm:flex-row items-center justify-between">
					<motion.div
						className="flex items-center space-x-2 mb-4 sm:mb-0"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Zap className="h-6 w-6" />
						<span className="text-2xl font-semibold">LinkPower</span>
					</motion.div>
					<Link
						href="https://x.com/mrtyagi07"
						target="_blank"
						prefetch={false}
						className="text-muted-foreground hover:text-foreground transition-colors text-sm"
					>
						@mrtyagi07
					</Link>
				</div>
			</header>

			<div className="container mx-auto mb-6">
				<div className="relative max-w-2xl mx-auto">
					<Input
						type="text"
						placeholder="Enter shortened link..."
						className="w-full pl-10 pr-24 py-2 text-base"
						value={inputUrl}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setInputUrl(e.target.value)
						}
					/>
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
					<Button
						disabled={isLoading}
						onClick={handleExpand}
						variant="default"
						size="sm"
						className="absolute right-1 top-1/2 transform -translate-y-1/2"
					>
						Expand
					</Button>
				</div>
			</div>

			<main className="container mx-auto flex flex-col lg:flex-row gap-6">
				<Card className="flex-grow">
					<CardHeader className="py-4">
						<CardTitle className="text-xl">Link Expansion Result</CardTitle>
					</CardHeader>
					<CardContent className="py-4">
						<AnimatePresence mode="wait">
							{isLoading ? (
								<motion.div
									key="skeleton"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="space-y-4"
								>
									<Skeleton className="h-6 w-full" />
									<Skeleton className="h-6 w-full" />
									<Skeleton className="h-6 w-full" />
								</motion.div>
							) : expandedData ? (
								<motion.div
									key="result"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
									className="space-y-4"
								>
									<div>
										<h4 className="text-sm font-medium mb-1">Full URL:</h4>
										<div className="flex items-center justify-between bg-muted p-2 rounded-md">
											<span className="text-sm truncate max-w-[calc(100%-40px)]">
												{expandedData.expandedUrl}
											</span>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
															onClick={() =>
																handleCopy(expandedData.expandedUrl)
															}
														>
															<div className="relative h-4 w-4">
																<AnimatePresence>
																	{isCopied ? (
																		<motion.div
																			key="check"
																			initial={{ scale: 0 }}
																			animate={{ scale: 1 }}
																			exit={{ scale: 0 }}
																			className="absolute inset-0 flex items-center justify-center" // Center the icon
																		>
																			<Check className="h-4 w-4 text-green-500" />
																		</motion.div>
																	) : (
																		<motion.div
																			key="copy"
																			initial={{ scale: 0 }}
																			animate={{ scale: 1 }}
																			exit={{ scale: 0 }}
																			className="absolute inset-0 flex items-center justify-center" // Center the icon
																		>
																			<Copy className="h-4 w-4" />
																		</motion.div>
																	)}
																</AnimatePresence>
															</div>
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>{isCopied ? "Copied!" : "Copy to clipboard"}</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
									</div>
									<div>
										<h4 className="text-sm font-medium mb-1">Website Title</h4>
										<p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
											{expandedData.title}
										</p>
									</div>
									<div>
										<h4 className="text-sm font-medium mb-1">Description</h4>
										<p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
											{expandedData.description}
										</p>
									</div>
									<motion.div
										className={`flex items-center space-x-2 p-3 rounded-md ${
											expandedData.isSafe ? "bg-green-100" : "bg-red-100"
										}`}
										initial={{ scale: 0.9 }}
										animate={{ scale: 1 }}
										transition={{ type: "spring", stiffness: 500, damping: 30 }}
									>
										{expandedData.isSafe ? (
											<Shield className="h-5 w-5 text-green-500" />
										) : (
											<AlertTriangle className="h-5 w-5 text-red-500" />
										)}
										<span
											className={`text-sm font-medium ${
												expandedData.isSafe ? "text-green-700" : "text-red-700"
											}`}
										>
											{expandedData.isSafe
												? "This link is safe"
												: "This link may be unsafe"}
										</span>
									</motion.div>

									<div className="aspect-video bg-muted rounded-md overflow-hidden">
										{expandedData && (
											<Image
												src={`https://api.microlink.io/?url=${encodeURIComponent(
													expandedData.expandedUrl,
												)}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.isMobile=true&viewport.deviceScaleFactor=1&viewport.width=1280&viewport.height=720`}
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
										size="lg"
										onClick={() => push(expandedData.expandedUrl)}
									>
										<ExternalLink className="mr-2 h-4 w-4" />
										View Site
									</Button>
								</motion.div>
							) : (
								<motion.p
									key="placeholder"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-center text-base text-muted-foreground"
								>
									Enter a shortened link and click "Expand" to see the results.
								</motion.p>
							)}
						</AnimatePresence>
					</CardContent>
				</Card>

				<Card className="w-full lg:w-96">
					<CardHeader className="py-4">
						<CardTitle className="text-xl">Link History</CardTitle>
					</CardHeader>
					<CardContent className="py-4">
						<ScrollArea className="h-[400px]">
							<AnimatePresence>
								{linkHistory.length === 0 ? ( // Check if there is no link history
									<motion.p
										key="no-history"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="text-center text-base text-muted-foreground"
									>
										No link history available.
									</motion.p>
								) : (
									linkHistory.map((link, index) => (
										<motion.div
											key={index.toString()}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{ duration: 0.2, delay: index * 0.1 }}
											className="mb-3 p-3 border rounded-md"
										>
											<p className="text-sm text-muted-foreground">
												{link.original}
											</p>
											<p className="text-sm font-medium truncate">
												{link.expanded}
											</p>
											<div className="flex justify-between items-center mt-2">
												<span className="text-xs text-muted-foreground">
													{link.date}
												</span>
												<div className="flex items-center space-x-2">
													{link.safe ? (
														<Shield className="h-4 w-4 text-green-500" />
													) : (
														<AlertTriangle className="h-4 w-4 text-red-500" />
													)}
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-6 w-6"
																	onClick={() => {
																		copyToClipboard(link.expanded);
																		setCopiedLinkIndex(index); // Set the copied link index
																		setTimeout(
																			() => setCopiedLinkIndex(null),
																			2000,
																		); // Reset after 2 seconds
																	}}
																>
																	<div className="relative h-4 w-4">
																		<AnimatePresence>
																			{copiedLinkIndex === index ? ( // Check if this link is copied
																				<motion.div
																					key="check"
																					initial={{ scale: 0 }}
																					animate={{ scale: 1 }}
																					exit={{ scale: 0 }}
																					className="absolute inset-0 flex items-center justify-center" // Center the icon
																				>
																					<Check className="h-3 w-3 text-green-500" />
																				</motion.div>
																			) : (
																				<motion.div
																					key="copy"
																					initial={{ scale: 0 }}
																					animate={{ scale: 1 }}
																					exit={{ scale: 0 }}
																					className="absolute inset-0 flex items-center justify-center" // Center the icon
																				>
																					<Copy className="h-3 w-3" />
																				</motion.div>
																			)}
																		</AnimatePresence>
																	</div>
																</Button>
															</TooltipTrigger>
															<TooltipContent>
																<p>Copy to clipboard</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>
											</div>
										</motion.div>
									))
								)}
							</AnimatePresence>
						</ScrollArea>
					</CardContent>
					{linkHistory.length > 0 && ( // Only show the button if there is link history
						<CardFooter className="py-4">
							<Button
								variant="outline"
								size="lg"
								className="w-full text-sm"
								onClick={clearHistory}
							>
								Clear History
							</Button>
						</CardFooter>
					)}
				</Card>
			</main>

			<footer className="mt-6 border-t">
				<div className="container mx-auto py-4 flex justify-end items-center text-sm">
					<Link
						href="https://x.com/mrtyagi07"
						target="_blank"
						prefetch={false}
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						@mrtyagi07
					</Link>
				</div>
			</footer>
		</div>
	);
}
