import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MoodSelector from '../components/MoodSelector';
import LoadingAnimation from '../components/LoadingAnimation';
import { getGitaQuote } from '../services/aiService';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';

const HomeScreen = ({ navigation }) => {
    const [moodText, setMoodText] = useState('');
    const [selectedMood, setSelectedMood] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastRequestTime, setLastRequestTime] = useState(0);

    const handleMoodSelect = (mood) => {
        if (selectedMood?.id === mood.id) {
            setSelectedMood(null);
            setMoodText('');
        } else {
            setSelectedMood(mood);
            setMoodText(`I'm feeling ${mood.label.toLowerCase()}`);
        }
    };

    const handleGetQuote = async () => {
        const mood = moodText.trim();
        if (!mood) {
            Alert.alert('Tell us how you feel', 'Please type your mood or select one from the options below.');
            return;
        }

        const now = Date.now();
        if (now - lastRequestTime < 10000) {
            Alert.alert('Patience, seeker', 'Please wait a few moments before asking for more wisdom. 🙏');
            return;
        }

        setIsLoading(true);
        const result = await getGitaQuote(mood);
        setIsLoading(false);

        if (result.success) {
            setLastRequestTime(Date.now());
            navigation.navigate('Quote', { quote: result.data, mood });
        } else {
            if (result.error.includes('Too many requests')) {
                Alert.alert(
                    'Patience is a Virtue',
                    'Too many requests. The Free Tier of Gemini has a limit of 15 requests per minute. Please try again in 30 seconds.'
                );
            } else {
                Alert.alert('Oops!', result.error);
            }
        }
    };

    if (isLoading) {
        return (
            <LinearGradient
                colors={[COLORS.darkBg, '#2D1810', COLORS.darkBg]}
                style={styles.loadingContainer}
            >
                <LoadingAnimation />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={[COLORS.warmWhite, COLORS.cream, '#FFE0B2']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.omSymbol}>🙏</Text>
                        <Text style={styles.title}>{APP_NAME}</Text>
                        <Text style={styles.tagline}>{APP_TAGLINE}</Text>
                    </View>

                    {/* Mood Input */}
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>How are you feeling today?</Text>
                        <TextInput
                            style={styles.moodInput}
                            placeholder="e.g., I feel anxious about my future..."
                            placeholderTextColor="rgba(110, 76, 65, 0.5)"
                            value={moodText}
                            onChangeText={(text) => {
                                setMoodText(text);
                                if (selectedMood) setSelectedMood(null);
                            }}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Mood Chips */}
                    <MoodSelector
                        selectedMood={selectedMood}
                        onSelectMood={handleMoodSelect}
                    />

                    {/* Get Quote Button */}
                    <TouchableOpacity
                        style={[
                            styles.getQuoteBtn,
                            !moodText.trim() && styles.getQuoteBtnDisabled,
                        ]}
                        onPress={handleGetQuote}
                        activeOpacity={0.8}
                        disabled={!moodText.trim()}
                    >
                        <LinearGradient
                            colors={
                                moodText.trim()
                                    ? [COLORS.saffron, COLORS.saffronDark]
                                    : ['#CCC', '#AAA']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.getQuoteBtnGradient}
                        >
                            <Text style={styles.getQuoteBtnText}>🙏 Get Gita Wisdom</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingTop: SPACING.xxl + 20,
        paddingBottom: SPACING.xxl,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    omSymbol: {
        fontSize: 48,
        marginBottom: SPACING.sm,
    },
    title: {
        fontSize: FONT_SIZES.title,
        fontWeight: '800',
        color: COLORS.deepMaroon,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        fontStyle: 'italic',
    },
    inputSection: {
        marginBottom: SPACING.md,
    },
    inputLabel: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.deepMaroon,
        marginBottom: SPACING.sm + 2,
    },
    moodInput: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        fontSize: FONT_SIZES.md,
        lineHeight: 24,
        color: COLORS.textPrimary,
        minHeight: 120,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 111, 0, 0.2)',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    getQuoteBtn: {
        marginTop: SPACING.xl,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        shadowColor: COLORS.saffron,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    getQuoteBtnDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    getQuoteBtnGradient: {
        paddingVertical: SPACING.md + 6,
        alignItems: 'center',
    },
    getQuoteBtnText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});

export default HomeScreen;
