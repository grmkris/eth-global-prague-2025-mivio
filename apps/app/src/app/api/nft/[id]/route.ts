import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Mock function to get user data based on NFT ID
async function getUserDataByNftId(nftId: number) {
	// This would normally query your database using the NFT ID
	// For now, returning mock data that varies by NFT ID - music festival themed
	const userData = {
		0: {
			username: "MusicLover",
			walletAddress: "0x81d786b35f3EA2F39Aa17cb18d9772E4EcD97206",
			totalEvents: 3,
			totalPoints: 8750,
			level: 12,
			achievements: [
				{ id: 1, name: "Festival Starter", icon: "🎵", earned: true },
				{ id: 2, name: "Music Maven", icon: "🎧", earned: true },
				{
					id: 3,
					name: "Stage Hopper",
					icon: "🎤",
					earned: false,
					progress: 0.7,
				},
				{ id: 4, name: "VIP Experience", icon: "⭐", earned: true },
				{
					id: 5,
					name: "Festival Legend",
					icon: "👑",
					earned: false,
					progress: 0.3,
				},
			],
			recentEvents: [
				{
					id: 1,
					name: "Summer Music Festival 2025",
					status: "active",
					points: 2500,
				},
				{
					id: 2,
					name: "Jazz & Blues Festival",
					status: "completed",
					points: 1800,
				},
				{
					id: 3,
					name: "Indie Rock Weekend",
					status: "completed",
					points: 1200,
				},
			],
			stats: {
				tasksCompleted: 28,
				eventsAttended: 3,
				totalSpent: 4200,
				favoriteCategory: "Music",
				favoriteGenre: "Rock",
			},
		},
		1: {
			username: "FestivalFan",
			walletAddress: "0x1234567890123456789012345678901234567890",
			totalEvents: 7,
			totalPoints: 12450,
			level: 15,
			achievements: [
				{ id: 1, name: "Festival Starter", icon: "🎵", earned: true },
				{ id: 2, name: "Music Maven", icon: "🎧", earned: true },
				{ id: 3, name: "Stage Hopper", icon: "🎤", earned: true },
				{ id: 4, name: "VIP Experience", icon: "⭐", earned: true },
				{ id: 5, name: "Festival Legend", icon: "👑", earned: true },
				{
					id: 6,
					name: "Sound Pioneer",
					icon: "🔊",
					earned: false,
					progress: 0.6,
				},
			],
			recentEvents: [
				{
					id: 1,
					name: "Summer Music Festival 2025",
					status: "active",
					points: 1250,
				},
				{ id: 2, name: "Indie Rock Weekend", status: "completed", points: 890 },
				{
					id: 3,
					name: "Jazz & Blues Festival",
					status: "completed",
					points: 650,
				},
				{
					id: 4,
					name: "Electronic Dance Fest",
					status: "completed",
					points: 1100,
				},
			],
			stats: {
				tasksCompleted: 45,
				eventsAttended: 7,
				totalSpent: 8950,
				favoriteCategory: "Music",
				favoriteGenre: "Electronic",
			},
		},
		2: {
			username: "JazzEnthusiast",
			walletAddress: "0x2345678901234567890123456789012345678901",
			totalEvents: 4,
			totalPoints: 6800,
			level: 10,
			achievements: [
				{ id: 1, name: "Festival Starter", icon: "🎵", earned: true },
				{ id: 2, name: "Music Maven", icon: "🎧", earned: true },
				{
					id: 3,
					name: "Stage Hopper",
					icon: "🎤",
					earned: false,
					progress: 0.8,
				},
				{ id: 4, name: "Jazz Aficionado", icon: "🎷", earned: true },
			],
			recentEvents: [
				{
					id: 1,
					name: "Jazz & Blues Festival",
					status: "active",
					points: 2200,
				},
				{
					id: 2,
					name: "Classic Jazz Night",
					status: "completed",
					points: 1500,
				},
				{ id: 3, name: "Smooth Jazz Sunday", status: "completed", points: 950 },
			],
			stats: {
				tasksCompleted: 32,
				eventsAttended: 4,
				totalSpent: 3400,
				favoriteCategory: "Music",
				favoriteGenre: "Jazz",
			},
		},
	};

	return userData[nftId as keyof typeof userData] || userData[0];
}

export async function GET(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const id = path.split("/").pop();

	try {
		console.log("Fetching metadata for NFT ID:", id);
		const tokenId = Number.parseInt(id || "0");
		if (Number.isNaN(tokenId)) {
			return NextResponse.json({ error: "Invalid token ID" }, { status: 400 });
		}

		// Get user data for this NFT
		const userData = await getUserDataByNftId(tokenId);
		const earnedAchievements = userData.achievements.filter((a) => a.earned);
		const inProgressAchievements = userData.achievements.filter(
			(a) => !a.earned && a.progress,
		);

		// Create the NFT metadata object according to ERC-721 standard
		const metadata = {
			name: `Mivio Music Pass #${tokenId}`,
			description:
				"A soulbound NFT representing your music festival journey and achievements in the Mivio ecosystem. This pass showcases your participation across various music events and festivals.",
			image: `https://eth-global-prague-2025-mivio-app.vercel.app/api/og/achievement-passport?nftId=${tokenId}`,
			external_url: `https://eth-global-prague-2025-mivio-app.vercel.app/nft/${tokenId}`,
			attributes: [
				{
					trait_type: "Type",
					value: "Music Pass",
				},
				{
					trait_type: "Collection",
					value: "Mivio Festival Passport",
				},
				{
					trait_type: "Soulbound",
					value: "Yes",
				},
				{
					trait_type: "Token ID",
					value: tokenId,
					display_type: "number",
				},
				{
					trait_type: "Username",
					value: userData.username,
				},
				{
					trait_type: "Level",
					value: userData.level,
					display_type: "number",
				},
				{
					trait_type: "Total Points",
					value: userData.totalPoints,
					display_type: "number",
				},
				{
					trait_type: "Festivals Attended",
					value: userData.totalEvents,
					display_type: "number",
				},
				{
					trait_type: "Achievements Earned",
					value: earnedAchievements.length,
					display_type: "number",
				},
				{
					trait_type: "Favorite Genre",
					value: userData.stats.favoriteGenre,
				},
				{
					trait_type: "Music Category",
					value: userData.stats.favoriteCategory,
				},
			],
			properties: {
				category: "Music Pass",
				collection: "Mivio",
				soulbound: true,
				// Include the full user data for the OG generator to use
				userData: userData,
			},
		};

		return NextResponse.json(metadata, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error generating NFT metadata:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
