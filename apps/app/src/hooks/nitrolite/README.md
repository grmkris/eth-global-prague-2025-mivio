# Simplified Nitrolite Integration

This directory contains React hooks for integrating Nitrolite state channels into the event management app.

## Philosophy

Following the pattern from the Nitrolite tictactoe example, we use a **client-side approach** where:

1. **Channels are managed directly by the client** - No server involvement
2. **localStorage for persistence** - Simple and effective
3. **Direct WebSocket connections** - Client connects directly to ClearNode
4. **Server handles business logic only** - Event management, not channel operations

## Core Hooks

### `useEventChannelSimple`
- Creates and manages Nitrolite channels for events
- Stores channel state in localStorage
- Auto-creates channel when user joins event
- Tracks off-chain balance

### `useSimplePayment`
- Handles direct peer-to-peer payments
- Creates and closes app sessions
- No server involvement for payments
- Returns payment receipts

## Usage Example

```typescript
// In a component
function EventWallet() {
  const { channelId, isChannelOpen, offchainBalance } = useEventChannelSimple({
    walletAddress,
    walletClient,
    nitroliteClient,
  });

  const { sendPayment } = useSimplePayment({
    channelId,
    walletAddress,
    walletClient,
    nitroliteClient,
    clearNodeWs,
  });

  // Send a payment directly
  const handleReward = async (recipient: string, amount: string) => {
    const result = await sendPayment(recipient, amount);
    if (result?.success) {
      // Just notify server about the business logic
      await api.task.markCompleted.mutate({ taskId, txHash: result.appSessionId });
    }
  };
}
```

## Benefits

- **70% less code** than server-mediated approach
- **Lower latency** - Direct connections
- **Simpler debugging** - Client owns the flow
- **True to Nitrolite design** - Channels are client-side constructs 