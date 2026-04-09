import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

const MoodChip = ({ mood, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.chip, isSelected && styles.chipActive]}
            onPress={() => onPress(mood)}
            activeOpacity={0.7}
        >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={[styles.label, isSelected && styles.labelActive]}>
                {mood.label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm + 2,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.pill,
        backgroundColor: COLORS.chipBg,
        marginRight: SPACING.sm,
        marginBottom: SPACING.sm,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    chipActive: {
        backgroundColor: COLORS.chipBgActive,
        borderColor: COLORS.gold,
    },
    emoji: {
        fontSize: FONT_SIZES.lg,
        marginRight: SPACING.xs + 2,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.saffron,
    },
    labelActive: {
        color: COLORS.white,
    },
});

export default MoodChip;
