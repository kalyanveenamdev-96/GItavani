import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

const QuoteCard = ({ quote }) => {
    if (!quote) return null;

    return (
        <View style={styles.card}>
            {/* Reference */}
            <View style={styles.referenceContainer}>
                <Text style={styles.reference}>
                    📖 Bhagavad Gita {quote.chapter}.{quote.verse}
                </Text>
            </View>

            {/* Sanskrit Verse */}
            <View style={styles.sanskritContainer}>
                <Text style={styles.sanskrit}>{quote.sanskrit}</Text>
            </View>

            {/* Transliteration */}
            {quote.transliteration && (
                <Text style={styles.transliteration}>{quote.transliteration}</Text>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Translation */}
            <View style={styles.translationContainer}>
                <Text style={styles.translationLabel}>Translation</Text>
                <Text style={styles.translation}>{quote.translation}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Explanation */}
            <View style={styles.explanationContainer}>
                <Text style={styles.explanationLabel}>✨ How this relates to you</Text>
                <Text style={styles.explanation}>{quote.explanation}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    referenceContainer: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    reference: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        color: COLORS.saffron,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    sanskritContainer: {
        backgroundColor: COLORS.darkBg,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    sanskrit: {
        fontSize: FONT_SIZES.xl,
        lineHeight: 36,
        color: COLORS.gold,
        textAlign: 'center',
        fontWeight: '500',
    },
    transliteration: {
        fontSize: FONT_SIZES.sm,
        fontStyle: 'italic',
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.md,
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 111, 0, 0.2)',
        marginVertical: SPACING.md,
    },
    translationContainer: {
        marginBottom: SPACING.xs,
    },
    translationLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
        color: COLORS.saffron,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING.sm,
    },
    translation: {
        fontSize: FONT_SIZES.md,
        lineHeight: 26,
        color: COLORS.textPrimary,
        fontWeight: '400',
    },
    explanationContainer: {},
    explanationLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
        color: COLORS.saffronDark,
        marginBottom: SPACING.sm,
    },
    explanation: {
        fontSize: FONT_SIZES.md,
        lineHeight: 26,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
});

export default QuoteCard;
