import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ConnectionStatus {
    isConnected: boolean;
    isSyncing: boolean;
    lastSyncTime: Date | null;
    error: string | null;
}

export function useTikTokConnection(initialConnected: boolean = false) {
    const [status, setStatus] = useState<ConnectionStatus>({
        isConnected: initialConnected,
        isSyncing: false,
        lastSyncTime: null,
        error: null
    });
    const router = useRouter();

    const checkConnection = async () => {
        // In a real app, this might poll an endpoint, 
        // but for now we rely on the manual sync triggering an update
    };

    const syncConnection = async () => {
        setStatus(prev => ({ ...prev, isSyncing: true, error: null }));
        try {
            const res = await fetch('/api/creator/sync-profile', {
                method: 'POST',
            });
            const data = await res.json();

            if (data.success) {
                setStatus({
                    isConnected: true,
                    isSyncing: false,
                    lastSyncTime: new Date(),
                    error: null
                });
                router.refresh(); // Refresh server components to show new data
                return true;
            } else {
                setStatus(prev => ({
                    ...prev,
                    isSyncing: false,
                    error: data.message || "Failed to sync"
                }));
                return false;
            }
        } catch (err) {
            setStatus(prev => ({
                ...prev,
                isSyncing: false,
                error: "Network error during sync"
            }));
            return false;
        }
    };

    return {
        ...status,
        syncConnection,
        checkConnection
    };
}
