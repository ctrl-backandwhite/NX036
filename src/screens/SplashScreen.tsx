import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';

export function SplashScreen({ navigation }: any) {
    const rotateY = useRef(new Animated.Value(0)).current;
    const ringScale = useRef(new Animated.Value(0.95)).current;
    const ringOpacity = useRef(new Animated.Value(0.15)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const dotsRef = useRef(0);
    const [dots, setDots] = React.useState('');

    useEffect(() => {
        // Fade in
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Spin-Y animation (logo rotates like the web version)
        const spinLoop = Animated.loop(
            Animated.timing(rotateY, {
                toValue: 1,
                duration: 2000,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
            }),
        );
        spinLoop.start();

        // Pulse ring
        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(ringScale, {
                        toValue: 1.08,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(ringOpacity, {
                        toValue: 0.35,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(ringScale, {
                        toValue: 0.95,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(ringOpacity, {
                        toValue: 0.15,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        );
        pulseLoop.start();

        // Dots animation
        const dotsInterval = setInterval(() => {
            dotsRef.current = (dotsRef.current + 1) % 4;
            setDots('.'.repeat(dotsRef.current));
        }, 500);

        // Navigate after 2.6s
        const timer = setTimeout(() => {
            spinLoop.stop();
            pulseLoop.stop();
            navigation.replace('Auth');
        }, 2600);

        return () => {
            clearTimeout(timer);
            clearInterval(dotsInterval);
            spinLoop.stop();
            pulseLoop.stop();
        };
    }, []);

    const spin = rotateY.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeIn }]}>
            <View style={styles.logoWrapper}>
                {/* Pulsing ring */}
                <Animated.View
                    style={[
                        styles.ring,
                        {
                            transform: [{ scale: ringScale }],
                            opacity: ringOpacity,
                        },
                    ]}
                />
                {/* NX Logo with Y-axis rotation */}
                <Animated.View
                    style={[
                        styles.logo,
                        {
                            transform: [{ perspective: 800 }, { rotateY: spin }],
                        },
                    ]}>
                    <Text style={styles.logoText}>NX</Text>
                </Animated.View>
            </View>
            <Text style={styles.loadingText}>
                Cargando NX036{dots}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 150,
    },
    ring: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#2e86c1',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f6b99',
        shadowColor: 'rgba(26, 82, 118, 0.25)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 10,
    },
    logoText: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: '700',
        letterSpacing: 1,
    },
    loadingText: {
        marginTop: 36,
        fontSize: 14,
        fontWeight: '300',
        color: '#64748b',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});
