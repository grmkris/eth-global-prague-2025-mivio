'use client';

import { Shield, AlertCircle, Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { useEventChannel } from '~/hooks/nitrolite/useEventChannel';
import type { WalletClient } from 'viem';
import type { NitroliteClient } from '@erc7824/nitrolite';

interface ChannelStatusProps {
  walletAddress: `0x${string}` | undefined;
  walletClient: WalletClient | undefined;
  nitroliteClient: NitroliteClient | undefined;
}

export function ChannelStatus({ walletAddress, walletClient, nitroliteClient }: ChannelStatusProps) {
  const {
    channelStatus,
    offchainBalance,
    isInitializing,
    error,
    hasChannel,
    needsChannel,
    initializeChannel,
    updateBalance,
  } = useEventChannel({ walletAddress, walletClient, nitroliteClient });

  // Status icon and color
  const getStatusIcon = () => {
    switch (channelStatus) {
      case 'none':
        return <Shield className="h-5 w-5 text-gray-400" />;
      case 'pending':
      case 'connecting':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'open':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (channelStatus) {
      case 'none':
        return 'No Channel';
      case 'pending':
        return 'Initializing...';
      case 'connecting':
        return 'Connecting...';
      case 'open':
        return 'Connected';
      case 'failed':
        return 'Connection Failed';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (channelStatus) {
      case 'none':
        return 'secondary';
      case 'pending':
      case 'connecting':
        return 'default';
      case 'open':
        return 'success';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-semibold">Payment Channel</h3>
              <p className="text-sm text-muted-foreground">
                Off-chain payment status
              </p>
            </div>
          </div>
          <Badge variant={getStatusColor() as any}>
            {getStatusText()}
          </Badge>
        </div>

        {/* Balance Display */}
        {channelStatus === 'open' && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Off-chain Balance</span>
              <span className="text-2xl font-bold">${offchainBalance}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={updateBalance}
              className="mt-2 w-full"
            >
              Refresh Balance
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        {needsChannel && !hasChannel && channelStatus === 'none' && (
          <div className="space-y-3">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                A payment channel is required for off-chain transactions. This enables instant, gas-free payments within the event.
              </AlertDescription>
            </Alert>
            <Button
              onClick={initializeChannel}
              disabled={isInitializing || !walletAddress || !walletClient || !nitroliteClient}
              className="w-full"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up channel...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Create Payment Channel
                </>
              )}
            </Button>
          </div>
        )}

        {/* Connection Info */}
        {channelStatus === 'open' && (
          <div className="text-xs text-muted-foreground mt-4">
            <p>• Instant transactions enabled</p>
            <p>• No gas fees for payments</p>
            <p>• Funds are secure and withdrawable</p>
          </div>
        )}

        {/* Retry Button for Failed State */}
        {channelStatus === 'failed' && (
          <Button
            onClick={initializeChannel}
            disabled={isInitializing}
            variant="outline"
            className="w-full mt-4"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 