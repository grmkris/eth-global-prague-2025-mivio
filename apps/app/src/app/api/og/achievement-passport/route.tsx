import type { ImageResponse } from "next/og";
import { ImageResponse as ImageResponseClass } from "next/og";
import type { NextRequest } from "next/server";

// Type definitions
type Achievement = {
	id: number;
	name: string;
	icon: string;
	earned: boolean;
	progress?: number;
};

type RecentEvent = {
	id: number;
	name: string;
	status: "active" | "completed";
	points: number;
};

type UserStats = {
	tasksCompleted: number;
	eventsAttended: number;
	totalSpent: number;
	favoriteCategory: string;
	favoriteGenre?: string;
};

type UserData = {
	user: {
		username: string;
		totalEvents: number;
		totalPoints: number;
		level: number;
		avatar: string;
	};
	achievements: Achievement[];
	recentEvents: RecentEvent[];
	stats: UserStats;
};

type NFTMetadata = {
	properties?: {
		userData?: {
			username: string;
			walletAddress: string;
			totalEvents: number;
			totalPoints: number;
			level: number;
			achievements: Achievement[];
			recentEvents: RecentEvent[];
			stats: UserStats;
		};
	};
};

// Fetch NFT metadata from our own API
async function getNftMetadata(nftId: string): Promise<NFTMetadata | null> {
	try {
    const url = new URL(`https://eth-global-prague-2025-mivio-app.vercel.app/api/nft/${nftId}`);
		const response = await fetch(
			url.toString(),
		);

    console.log("Fetching metadata from:", url.toString());

		if (!response.ok) {
			throw new Error(`Failed to fetch metadata: ${response.statusText}`);
		}

		const metadata = await response.json();
		return metadata;
	} catch (error) {
		console.error("Error fetching NFT metadata:", error);
		// Return null to fall back to mock data
		return null;
	}
}

// Fallback mock function (kept for development/fallback)
async function getFallbackUserData(nftId: string): Promise<UserData> {
	return {
		user: {
			username: "FallbackUser",
			totalEvents: 3,
			totalPoints: 5000,
			level: 8,
			avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nftId}`,
		},
		achievements: [
			{ id: 1, name: "Festival Starter", icon: "🎵", earned: true },
			{ id: 2, name: "Music Maven", icon: "🎧", earned: false, progress: 0.5 },
		],
		recentEvents: [
			{ id: 1, name: "Sample Festival", status: "active", points: 1000 },
		],
		stats: {
			tasksCompleted: 10,
			eventsAttended: 3,
			totalSpent: 2500,
			favoriteCategory: "Music",
			favoriteGenre: "General",
		},
	};
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const nftId = searchParams.get("nftId");
	const style = searchParams.get("style") || "modern";

	console.log("NFT ID received:", nftId);

	if (!nftId) {
		return new Response("NFT ID required", { status: 400 });
	}

	// Fetch metadata from our NFT endpoint
	const metadata = await getNftMetadata(nftId);
	let userData: UserData;

	if (metadata?.properties?.userData) {
		// Use data from metadata
		userData = {
			user: {
				username: metadata.properties.userData.username,
				totalEvents: metadata.properties.userData.totalEvents,
				totalPoints: metadata.properties.userData.totalPoints,
				level: metadata.properties.userData.level,
				avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${metadata.properties.userData.walletAddress}`,
			},
			achievements: metadata.properties.userData.achievements,
			recentEvents: metadata.properties.userData.recentEvents,
			stats: metadata.properties.userData.stats,
		};
		console.log("Using metadata from NFT endpoint");
	} else {
		// Fallback to mock data
		userData = await getFallbackUserData(nftId);
		console.log("Using fallback data");
	}

	const earnedAchievements = userData.achievements.filter((a: Achievement) => a.earned);
	const inProgressAchievements = userData.achievements.filter(
		(a: Achievement) => !a.earned && a.progress,
	);

	// Get icon based on favorite genre
	const getGenreIcon = (genre?: string) => {
		switch (genre?.toLowerCase()) {
			case "rock":
			case "indie":
				return "🎸";
			case "jazz":
				return "🎷";
			case "electronic":
			case "edm":
				return "🎧";
			case "classical":
				return "🎼";
			case "pop":
				return "🎤";
			default:
				return "🎵";
		}
	};

	return new ImageResponseClass(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				background:
					"linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
				padding: "60px",
				fontFamily: "Inter, system-ui, sans-serif",
			}}
		>
			{/* Header */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					marginBottom: "40px",
					justifyContent: "space-between",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
					<div
						style={{
							width: "80px",
							height: "80px",
							borderRadius: "50%",
							background: "linear-gradient(45deg, #fbbf24, #f59e0b)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "40px",
						}}
					>
						{getGenreIcon(userData.stats.favoriteGenre)}
					</div>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<h1
							style={{
								color: "white",
								fontSize: "48px",
								margin: 0,
								fontWeight: "bold",
							}}
						>
							{userData.user.username}
						</h1>
						<p
							style={{
								color: "#a5b4fc",
								fontSize: "24px",
								margin: "8px 0 0 0",
							}}
						>
							Level {userData.user.level} • {userData.user.totalEvents} Festivals
						</p>
					</div>
				</div>

				{/* NFT ID Badge */}
				<div
					style={{
						background: "rgba(255,255,255,0.9)",
						borderRadius: "12px",
						padding: "16px 20px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						minWidth: "100px",
					}}
				>
					<div style={{ color: "#1e1b4b", fontSize: "12px", fontWeight: "bold", display: "flex" }}>
						Music Pass #{nftId}
					</div>
					<div style={{ color: "#6b7280", fontSize: "10px", display: "flex" }}>
						Mivio Festival
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div
				style={{
					display: "flex",
					gap: "40px",
					flex: 1,
				}}
			>
				{/* Left Column - Stats */}
				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						gap: "20px",
					}}
				>
					{/* Points Card */}
					<div
						style={{
							background: "rgba(255,255,255,0.1)",
							borderRadius: "16px",
							padding: "30px",
							border: "1px solid rgba(255,255,255,0.2)",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<h3
							style={{
								color: "#fbbf24",
								fontSize: "20px",
								margin: "0 0 10px 0",
							}}
						>
							Festival Points
						</h3>
						<div
							style={{ color: "white", fontSize: "36px", fontWeight: "bold" }}
						>
							{userData.user.totalPoints.toLocaleString()}
						</div>
					</div>

					{/* Recent Events */}
					<div
						style={{
							background: "rgba(255,255,255,0.1)",
							borderRadius: "16px",
							padding: "30px",
							border: "1px solid rgba(255,255,255,0.2)",
							flex: 1,
							display: "flex",
							flexDirection: "column",
						}}
					>
						<h3
							style={{
								color: "#fbbf24",
								fontSize: "20px",
								margin: "0 0 20px 0",
							}}
						>
							Recent Festivals
						</h3>
						<div
							style={{ display: "flex", flexDirection: "column", gap: "12px" }}
						>
							{userData.recentEvents.slice(0, 3).map((event: RecentEvent) => (
								<div
									key={event.id}
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<span style={{ color: "white", fontSize: "16px" }}>
										{event.name}
									</span>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
										}}
									>
										<span
											style={{
												color:
													event.status === "active" ? "#10b981" : "#6b7280",
												fontSize: "14px",
											}}
										>
											{event.points} pts
										</span>
										<div
											style={{
												width: "8px",
												height: "8px",
												borderRadius: "50%",
												background:
													event.status === "active" ? "#10b981" : "#6b7280",
												display: "flex",
											}}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Right Column - Achievements */}
				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
					}}
				>
					<h3
						style={{
							color: "white",
							fontSize: "24px",
							margin: "0 0 20px 0",
							fontWeight: "bold",
						}}
					>
						Achievements
					</h3>

					{/* Earned Achievements */}
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "16px",
							marginBottom: "30px",
						}}
					>
						{earnedAchievements.map((achievement: Achievement) => (
							<div
								key={achievement.id}
								style={{
									background: "linear-gradient(45deg, #fbbf24, #f59e0b)",
									borderRadius: "12px",
									padding: "16px 20px",
									display: "flex",
									alignItems: "center",
									gap: "8px",
									minWidth: "140px",
								}}
							>
								<span style={{ fontSize: "24px" }}>{achievement.icon}</span>
								<span
									style={{
										color: "white",
										fontSize: "14px",
										fontWeight: "bold",
									}}
								>
									{achievement.name}
								</span>
							</div>
						))}
					</div>

					{/* In Progress */}
					{inProgressAchievements.length > 0 && (
						<div style={{ display: "flex", flexDirection: "column" }}>
							<h4
								style={{
									color: "#a5b4fc",
									fontSize: "18px",
									margin: "0 0 16px 0",
								}}
							>
								In Progress
							</h4>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "12px",
								}}
							>
								{inProgressAchievements.map((achievement: Achievement) => (
									<div
										key={achievement.id}
										style={{
											background: "rgba(255,255,255,0.05)",
											borderRadius: "8px",
											padding: "12px 16px",
											border: "1px solid rgba(255,255,255,0.1)",
											display: "flex",
											flexDirection: "column",
										}}
									>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												marginBottom: "8px",
											}}
										>
											<span style={{ color: "white", fontSize: "14px" }}>
												{achievement.icon} {achievement.name}
											</span>
											<span style={{ color: "#a5b4fc", fontSize: "12px" }}>
												{Math.round((achievement.progress || 0) * 100)}%
											</span>
										</div>
										{/* Progress bar */}
										<div
											style={{
												width: "100%",
												height: "4px",
												background: "rgba(255,255,255,0.1)",
												borderRadius: "2px",
												overflow: "hidden",
												display: "flex",
											}}
										>
											<div
												style={{
													width: `${(achievement.progress || 0) * 100}%`,
													height: "100%",
													background:
														"linear-gradient(90deg, #fbbf24, #f59e0b)",
													display: "flex",
												}}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Footer */}
			<div
				style={{
					marginTop: "40px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					paddingTop: "20px",
					borderTop: "1px solid rgba(255,255,255,0.1)",
				}}
			>
				<div
					style={{
						color: "#6b7280",
						fontSize: "14px",
						display: "flex",
					}}
				>
					Generated {new Date().toLocaleDateString()}
				</div>
				<div
					style={{
						color: "#a5b4fc",
						fontSize: "16px",
						fontWeight: "bold",
						display: "flex",
					}}
				>
					mivio.events
				</div>
			</div>
		</div>,
		{
			width: 1200,
			height: 800,
		},
	);
}
