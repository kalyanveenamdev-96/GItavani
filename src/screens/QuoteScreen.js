import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Share,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QuoteCard from '../components/QuoteCard';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

const QuoteScreen = ({ route, navigation }) => {
    const { quote, mood } = route.params;

    const handleShare = async () => {
        try {
            const shareText = `📖 Bhagavad Gita ${quote.chapter}.${quote.verse}\n\n${quote.sanskrit}\n\n"${quote.translation}"\n\n✨ ${quote.explanation}\n\n— Shared via GitaVani 🙏`;
            await Share.share({
                message: shareText,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share quote');
        }
    };

    const handleGetAnother = () => {
        navigation.goBack();
    };

    return (
        <LinearGradient
            colors={[COLORS.warmWhite, COLORS.cream, '#FFE0B2']}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Mood Label */}
                <View style={styles.moodContainer}>
                    <Text style={styles.moodLabel}>You said you're feeling</Text>
                    <Text style={styles.moodText}>"{mood}"</Text>
                </View>

                {/* Quote Card */}
                <QuoteCard quote={quote} />

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    {/* Share Button */}
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={handleShare}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[COLORS.saffron, COLORS.saffronDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.actionBtnGradient}
                        >
                            <Text style={styles.actionBtnText}>📤 Share</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Get Another Button */}
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={handleGetAnother}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[COLORS.deepMaroon, '#6D2323']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.actionBtnGradient}
                        >
                            <Text style={styles.actionBtnText}>🔄 Try Another Mood</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    🙏 May this wisdom bring you peace
                </Text>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    moodContainer: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    moodLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
    },
    moodText: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.deepMaroon,
        fontStyle: 'italic',
        fontWeight: '600',
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.xl,
    },
    actionBtn: {
        flex: 1,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    actionBtnGradient: {
        paddingVertical: SPACING.md + 2,
        alignItems: 'center',
    },
    actionBtnText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
    footer: {
        textAlign: 'center',
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.xl,
        fontStyle: 'italic',
    },
});

export default QuoteScreen;
