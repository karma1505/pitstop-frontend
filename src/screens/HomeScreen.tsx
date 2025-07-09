import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils';
import Button from '../components/Button';

export default function HomeScreen() {
  const handleFindGarages = () => {
    // Navigate to garages list or implement search
    console.log('Find garages pressed');
  };

  const handleBookAppointment = () => {
    // Navigate to booking flow
    console.log('Book appointment pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to iGarage</Text>
        <Text style={styles.subtitle}>
          Find trusted garages and book appointments with ease
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Find Garages"
            onPress={handleFindGarages}
            variant="primary"
            size="large"
            style={styles.button}
          />
          
          <Button
            title="Book Appointment"
            onPress={handleBookAppointment}
            variant="outline"
            size="large"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  button: {
    width: '100%',
  },
}); 