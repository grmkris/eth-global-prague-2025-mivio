# Nitrolite Integration for Event Management

This directory contains the Nitrolite integration for the event management platform, enabling off-chain payment channels for instant, gas-free transactions within events.

## Overview

When a user joins an event, they can create a Nitrolite payment channel that enables:
- Instant microtransactions for task rewards
- Gas-free purchases at event shops
- Real-time balance updates
- Secure fund management

## Event Join Flow

### 1. User Joins Event

```typescript
// User clicks "Join Event"
const result = await joinEvent(eventSlug);

// This creates:
// - EventParticipant record
// - EventWallet with 0 balance
// - Returns needsChannel flag
```

### 2. Channel Initialization

After joining, the system automatically initiates channel creation:

```typescript
// In the event dashboard, useEventChannel hook:
// 1. Detects needsChannel flag
// 2. Creates database record for channel
// 3. Connects to ClearNode WebSocket
// 4. Creates Nitrolite channel
// 5. Confirms channel creation
```

### 3. Channel States

The channel goes through several states:

- **none**: No channel exists
- **pending**: Channel creation initiated
- **connecting**: Connecting to ClearNode
- **open**: Channel active and ready
- **failed**: Channel creation failed
- **closing**: Channel being closed
- **closed**: Channel terminated

### 4. WebSocket Authentication

The ClearNode connection uses EIP-712 signatures for authentication:

```typescript
// Authentication flow:
// 1. Send auth_request with wallet info
// 2. Receive auth_challenge with nonce
// 3. Sign challenge with EIP-712
// 4. Send auth_verify
// 5. Receive auth_success with JWT
```

### 5. Off-chain Transactions

Once the channel is open, users can:

- **Earn rewards**: Task completions credit off-chain balance
- **Make purchases**: Shop items deduct from off-chain balance
- **View balance**: Real-time balance updates via WebSocket

## Architecture

### Services

- **clearNodeClient.ts**: WebSocket connection management
- **channelManager.ts**: Channel lifecycle management

### Database Schema

- **event_channels**: Stores channel state and metadata
- **event_wallets**: Links to channel for off-chain balance

### API Routes

- **channel.initializeChannel**: Start channel creation
- **channel.confirmChannel**: Confirm channel is open
- **channel.getChannelStatus**: Get current state
- **channel.updateOffchainBalance**: Sync balance

### React Hooks

- **useEventChannel**: Main hook for channel operations
- **useEventJoin**: Handles event joining with channel setup

### Components

- **ChannelStatus**: Visual indicator of channel state

## Configuration

Set these environment variables:

```bash
# ClearNode WebSocket URL
NEXT_PUBLIC_CLEARNODE_URL=wss://clearnet.yellow.com/ws

# Contract addresses (if needed)
NEXT_PUBLIC_CUSTODY_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
```

## Error Handling

The system handles various error scenarios:

1. **WebSocket disconnection**: Automatic reconnection with exponential backoff
2. **Authentication failure**: Clears JWT and retries
3. **Channel creation failure**: Updates UI and allows retry
4. **Balance sync issues**: Falls back to cached values

## Security Considerations

1. **Private keys**: Never sent to server, only used for signing
2. **JWT storage**: Stored in localStorage for reconnection
3. **Balance verification**: Off-chain balances backed by on-chain deposits
4. **Channel recovery**: Local storage backup for channel state

## Future Enhancements

1. **Batch channel creation**: Create channels for multiple events
2. **Cross-event channels**: Reuse channels across events
3. **Channel templates**: Pre-configured channel parameters
4. **Advanced dispute resolution**: Handle channel disputes
5. **Multi-asset support**: Support multiple tokens per channel

## Testing

To test the integration:

1. Connect a wallet
2. Join an event
3. Watch for channel creation in the wallet dashboard
4. Verify WebSocket connection in browser console
5. Check channel status in the UI
6. Perform test transactions

## Troubleshooting

Common issues and solutions:

- **Channel stuck in "connecting"**: Check WebSocket URL and network
- **Authentication fails**: Ensure wallet is connected
- **Balance not updating**: Check WebSocket connection status
- **Channel creation fails**: Verify sufficient gas for on-chain tx 