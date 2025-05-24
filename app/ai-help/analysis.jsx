import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Ionicons } from '@expo/vector-icons';

const TEAL = '#19A7CE';
const CARD_BG = '#F3FBFE';
const GRAY_TEXT = '#666';
const DARK_TEXT = '#222';

const urgencyCardStyle = (level) => {
  switch (level) {
    case 'Emergency':
      return {
        backgroundColor: '#FEE2E2',
        borderLeftWidth: 5,
        borderLeftColor: '#EF4444', // red-500
      };
    case 'Medium':
      return {
        backgroundColor: '#FEF9C3',
        borderLeftWidth: 5,
        borderLeftColor: '#FACC15', // yellow-400
      };
    case 'Routine':
      return {
        backgroundColor: '#DCFCE7',
        borderLeftWidth: 5,
        borderLeftColor: '#22C55E', // green-500
      };
    default:
      return {
        backgroundColor: CARD_BG,
        borderLeftWidth: 5,
        borderLeftColor: TEAL,
      };
  }
};

const urgencyTextColor = (level) => {
  switch (level) {
    case 'Emergency':
      return '#B91C1C'; // red-700
    case 'Medium':
      return '#CA8A04'; // yellow-700
    case 'Routine':
      return '#15803D'; // green-700
    default:
      return GRAY_TEXT;
  }
};

const Report = () => {
  const { recommendation } = useGlobalContext();

  const result = recommendation?.recommendation;

  if (!result) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Ionicons name="alert-circle" size={60} color={TEAL} style={{ marginBottom: 12 }} />
        <Text className="text-lg text-gray-500">No report data available</Text>
      </View>
    );
  }

  // Render
  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-bold text-center mb-6" style={{ color: TEAL }}>
        Health Analysis Report
      </Text>

      {/* Recommended Specialist Highlight Card */}
      <View style={{
        backgroundColor: TEAL,
        borderRadius: 15,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { height: 2 },
        flexDirection: 'row', alignItems: 'center'
      }}>
        <Ionicons name="person-circle" size={38} color="#fff" style={{ marginRight: 12 }} />
        <View>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Recommended Specialist</Text>
          <Text style={{ color: '#E9F7FC', fontSize: 17, marginTop: 1, fontWeight: '800', letterSpacing: .5 }}>
            {result.recommendedSpecialist}
          </Text>
        </View>
      </View>

      {/* Urgency Level Card (color-coded) */}
      <View style={{
        borderRadius: 12, padding: 14, marginBottom: 14,
        ...urgencyCardStyle(result.urgencyLevel),
      }}>
        <Text style={{ color: DARK_TEXT, fontWeight: 'bold', marginBottom: 3, fontSize: 15 }}>
          <Ionicons name="alert" size={16} color={TEAL} />{'  '}Urgency Level
        </Text>
        <Text style={{ color: urgencyTextColor(result.urgencyLevel), fontSize: 15 }}>
          {result.urgencyLevel}
        </Text>
      </View>

      {/* The rest cards are standard */}
      <View style={{ backgroundColor: CARD_BG, borderRadius: 12, padding: 14, marginBottom: 14, borderLeftWidth: 5, borderLeftColor: TEAL }}>
        <Text style={{ color: DARK_TEXT, fontWeight: 'bold', marginBottom: 3, fontSize: 15 }}>
          <Ionicons name="help-circle" size={16} color={TEAL} />
          {'  '}Reasoning
        </Text>
        <Text style={{ color: GRAY_TEXT, fontSize: 15 }}>{result.reasoning}</Text>
      </View>
      <View style={{ backgroundColor: CARD_BG, borderRadius: 12, padding: 14, marginBottom: 14, borderLeftWidth: 5, borderLeftColor: TEAL }}>
        <Text style={{ color: DARK_TEXT, fontWeight: 'bold', marginBottom: 3, fontSize: 15 }}>
          <Ionicons name="checkmark-circle" size={16} color={TEAL} />
          {'  '}Precautionary Measures
        </Text>
        {result.precautionaryMeasures.map((item, index) => (
          <Text key={index} style={{ color: GRAY_TEXT, fontSize: 14, marginLeft: 8, marginBottom: 2 }}>• {item}</Text>
        ))}
      </View>
      <View style={{ backgroundColor: CARD_BG, borderRadius: 12, padding: 14, marginBottom: 14, borderLeftWidth: 5, borderLeftColor: TEAL }}>
        <Text style={{ color: DARK_TEXT, fontWeight: 'bold', marginBottom: 3, fontSize: 15 }}>
          <Ionicons name="document-text" size={16} color={TEAL} />
          {'  '}Additional Notes
        </Text>
        <Text style={{ color: GRAY_TEXT, fontSize: 15 }}>{result.additionalNotes}</Text>
      </View>
      {/* Disclaimer */}
      <View style={{ borderRadius: 10, padding: 10, backgroundColor: '#F6F6F7', marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#FFA500' }}>
        <Text style={{ color: '#888', fontSize: 13, fontStyle: 'italic' }}>
          {result.disclaimer}
        </Text>
      </View>
    </ScrollView>
  );
};

export default Report;