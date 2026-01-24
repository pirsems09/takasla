import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
    BannerAd,
    BannerAdSize,
} from 'react-native-google-mobile-ads';
import { adUnitIds, adConfig } from '../config/adConfig';

interface AdBannerProps {
    size?: BannerAdSize;
    containerStyle?: object;
}

export const AdBanner: React.FC<AdBannerProps> = ({
    size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
    containerStyle,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Reklamı yönet

    useEffect(() => {
        // 5 saniye içinde yüklenmezse loading'i kapat
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    if (hasError) {
        return null; // Hata durumunda boş alan gösterme
    }

    return (
        <View style={[styles.container, containerStyle]}>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#7a7d82" />
                </View>
            )}
            <BannerAd
                unitId={adUnitIds.banner}
                size={size}
                requestOptions={adConfig.banner}
                onAdLoaded={() => {
                    setIsLoading(false);
                    setHasError(false);
                }}
                onAdFailedToLoad={(error) => {
                    console.warn('Banner ad failed to load:', error);
                    setIsLoading(false);
                    setHasError(true);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f5f8',
        paddingVertical: 8,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AdBanner;
