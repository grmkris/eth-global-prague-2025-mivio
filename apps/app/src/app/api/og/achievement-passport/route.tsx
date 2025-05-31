import type { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { ImageResponse as ImageResponseClass } from 'next/og';

// Mock function to map NFT ID to wallet address
async function mapNftIdToWallet(nftId: string): Promise<string | null> {
  // Mock mapping - replace with actual database/contract queries
  const nftToWalletMap: Record<string, string> = {
    '1': '0x1234567890123456789012345678901234567890',
    '2': '0x2345678901234567890123456789012345678901',
    '3': '0x3456789012345678901234567890123456789012',
    '4': '0x4567890123456789012345678901234567890123',
    '5': '0x5678901234567890123456789012345678901234',
    // Add more mock mappings as needed
  };
  
  return nftToWalletMap[nftId] || null;
}

// This would come from your database
async function getUserData(walletAddress: string) {
  // Mock data - replace with actual database queries
  return {
    user: {
      username: "FestivalFan",
      totalEvents: 7,
      totalPoints: 12450,
      level: 15,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
    },
    achievements: [
      { id: 1, name: "Early Adopter", icon: "🎯", earned: true },
      { id: 2, name: "Network Maven", icon: "🤝", earned: true },
      { id: 3, name: "Task Master", icon: "✅", earned: false, progress: 0.8 },
      { id: 4, name: "Shopping Expert", icon: "🛍️", earned: true },
      { id: 5, name: "Event Legend", icon: "👑", earned: false, progress: 0.6 },
    ],
    recentEvents: [
      { id: 1, name: "Summer Music Fest", status: "active", points: 1250 },
      { id: 2, name: "Indie Rock Weekend", status: "completed", points: 890 },
      { id: 3, name: "Jazz & Blues Fest", status: "completed", points: 650 },
    ],
    stats: {
      tasksCompleted: 45,
      eventsAttended: 7,
      totalSpent: 8950,
      favorite_category: "Music"
    }
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nftId = searchParams.get('nftId');
  const style = searchParams.get('style') || 'modern';

  console.log("NFT ID received:", nftId);
  
  if (!nftId) {
    return new Response('NFT ID required', { status: 400 });
  }

  // Map NFT ID to wallet address
  const walletAddress = await mapNftIdToWallet(nftId);
  
  if (!walletAddress) {
    return new Response('NFT not found or invalid NFT ID', { status: 404 });
  }

  console.log("Mapped to wallet address:", walletAddress);

  const data = await getUserData(walletAddress);
  const earnedAchievements = data.achievements.filter(a => a.earned);
  const inProgressAchievements = data.achievements.filter(a => !a.earned && a.progress);

  return new ImageResponseClass(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
          padding: '60px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '40px',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
            }}>
              🎪
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ 
                color: 'white', 
                fontSize: '48px', 
                margin: 0,
                fontWeight: 'bold'
              }}>
                {data.user.username}
              </h1>
              <p style={{ 
                color: '#a5b4fc', 
                fontSize: '24px', 
                margin: '8px 0 0 0' 
              }}>
                Level {data.user.level} • {data.user.totalEvents} Events
              </p>
            </div>
          </div>
          
          {/* QR Code placeholder */}
          <div style={{
            width: '100px',
            height: '100px',
            background: 'white',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'black',
            flexShrink: 0
          }}>
            <span style={{ display: 'flex' }}>QR CODE</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          flex: 1 
        }}>
          {/* Left Column - Stats */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Points Card */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '30px',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ color: '#fbbf24', fontSize: '20px', margin: '0 0 10px 0' }}>
                Total Points
              </h3>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: 'bold' }}>
                {data.user.totalPoints.toLocaleString()}
              </div>
            </div>

            {/* Recent Events */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '30px',
              border: '1px solid rgba(255,255,255,0.2)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ color: '#fbbf24', fontSize: '20px', margin: '0 0 20px 0' }}>
                Recent Events
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.recentEvents.slice(0, 3).map((event) => (
                  <div key={event.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '16px' }}>
                      {event.name}
                    </span>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px' 
                    }}>
                      <span style={{ 
                        color: event.status === 'active' ? '#10b981' : '#6b7280',
                        fontSize: '14px'
                      }}>
                        {event.points} pts
                      </span>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: event.status === 'active' ? '#10b981' : '#6b7280',
                        display: 'flex'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '24px', 
              margin: '0 0 20px 0',
              fontWeight: 'bold'
            }}>
              Achievements
            </h3>
            
            {/* Earned Achievements */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '16px',
              marginBottom: '30px'
            }}>
              {earnedAchievements.map((achievement) => (
                <div key={achievement.id} style={{
                  background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '140px'
                }}>
                  <span style={{ fontSize: '24px' }}>{achievement.icon}</span>
                  <span style={{ 
                    color: 'white', 
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {achievement.name}
                  </span>
                </div>
              ))}
            </div>

            {/* In Progress */}
            {inProgressAchievements.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ 
                  color: '#a5b4fc', 
                  fontSize: '18px', 
                  margin: '0 0 16px 0' 
                }}>
                  In Progress
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {inProgressAchievements.map((achievement) => (
                    <div key={achievement.id} style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{ color: 'white', fontSize: '14px' }}>
                          {achievement.icon} {achievement.name}
                        </span>
                        <span style={{ color: '#a5b4fc', fontSize: '12px' }}>
                          {Math.round((achievement.progress || 0) * 100)}%
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div style={{
                        width: '100%',
                        height: '4px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        display: 'flex'
                      }}>
                        <div style={{
                          width: `${(achievement.progress || 0) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                          display: 'flex'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            display: 'flex'
          }}>
            Generated {new Date().toLocaleDateString()}
          </div>
          <div style={{ 
            color: '#a5b4fc', 
            fontSize: '16px', 
            fontWeight: 'bold',
            display: 'flex'
          }}>
            mivio.events
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    },
  );
} 