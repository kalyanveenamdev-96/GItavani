import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import MoodChip from './MoodChip';
import { MOODS } from '../utils/constants';
import { COLORS, SPACING, FONT_SIZES } from '../styles/theme';

const MoodSelector = ({ selectedMood, onSelectMood }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>or pick a mood</Text>
            <View style={styles.chipContainer}>
                {MOODS.map((mood) => (
                    <MoodChip
                        key={mood.id}
                        mood={mood}
                        isSelected={selectedMood?.id === mood.id}
                        onPress={onSelectMood}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm + 4,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontWeight: '600',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default MoodSelector;
