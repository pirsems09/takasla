import { useEffect, useState, useRef, useCallback } from 'react';
import {
    RewardedAd,
    RewardedAdEventType,
    AdEventType,
} from 'react-native-google-mobile-ads';
import { adUnitIds, adConfig } from '../config/adConfig';

interface UseRewardedAdOptions {
    onRewardEarned?: (reward: { type: string; amount: number }) => void;
    onAdClosed?: () => void;
    onError?: (error: Error) => void;
}

export const useRewardedAd = (options: UseRewardedAdOptions = {}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const rewardedRef = useRef<RewardedAd | null>(null);

    const loadAd = useCallback(() => {
        if (isLoading || isLoaded) return;

        setIsLoading(true);

        const rewarded = RewardedAd.createForAdRequest(
            adUnitIds.rewarded,
            adConfig.rewarded
        );
        rewardedRef.current = rewarded;

        const unsubscribeLoaded = rewarded.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
                setIsLoaded(true);
                setIsLoading(false);
            }
        );

        const unsubscribeEarned = rewarded.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            (reward) => {
                options.onRewardEarned?.(reward);
            }
        );

        const unsubscribeClosed = rewarded.addAdEventListener(
            AdEventType.CLOSED,
            () => {
                setIsLoaded(false);
                options.onAdClosed?.();
                // Sonraki reklam için yeniden yükle
                loadAd();
            }
        );

        const unsubscribeError = rewarded.addAdEventListener(
            AdEventType.ERROR,
            (error) => {
                setIsLoading(false);
                setIsLoaded(false);
                options.onError?.(error as unknown as Error);
            }
        );

        rewarded.load();

        return () => {
            unsubscribeLoaded();
            unsubscribeEarned();
            unsubscribeClosed();
            unsubscribeError();
        };
    }, [isLoading, isLoaded, options]);

    useEffect(() => {
        const cleanup = loadAd();
        return cleanup;
    }, []);

    const showAd = useCallback(async () => {
        if (rewardedRef.current && isLoaded) {
            try {
                await rewardedRef.current.show();
            } catch (error) {
                console.warn('Failed to show rewarded ad:', error);
                options.onError?.(error as Error);
            }
        } else {
            console.warn('Rewarded ad not loaded yet');
            loadAd();
        }
    }, [isLoaded, loadAd, options]);

    return {
        isLoaded,
        isLoading,
        showAd,
        loadAd,
    };
};

export default useRewardedAd;
