import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../styles/theme';

const LoadingAnimation = () => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulse animation
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );

        // Rotate animation
        const rotate = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        );

        pulse.start();
        rotate.start();

        return () => {
            pulse.stop();
            rotate.stop();
        };
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.omContainer,
                    {
                        transform: [{ scale: pulseAnim }, { rotate: spin }],
                    },
                ]}
            >
                <Text style={styles.om}>🙏</Text>
            </Animated.View>
            <Text style={styles.text}>Seeking wisdom from the Gita...</Text>
            <Text style={styles.subText}>This may take a moment</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xxl,
    },
    omContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 111, 0, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    om: {
        fontSize: 40,
    },
    text: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.saffron,
        fontWeight: '600',
        marginBottom: SPACING.sm,
    },
    subText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
});

export default LoadingAnimation;
