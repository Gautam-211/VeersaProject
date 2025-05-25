import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../../context/GlobalProvider'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native'

const riskClass = {
  High: 'bg-red-100 border-l-4 border-red-400',
  Medium: 'bg-yellow-100 border-l-4 border-yellow-400',
  Low: 'bg-green-100 border-l-4 border-green-400',
  Default: 'bg-slate-100 border-l-4 border-slate-400',
}

const textRiskColor = {
  High: 'text-red-700',
  Medium: 'text-yellow-700',
  Low: 'text-green-700',
  Default: 'text-slate-700',
}

const Diagnosis = () => {
  const { diagnosis } = useGlobalContext()

  const analysis =
    diagnosis?.result?.result?.analysis ||
    diagnosis?.result?.analysis ||
    {}

  const possibleConditions = analysis.possibleConditions || []
  const generalAdvice = analysis.generalAdvice || {}
  const disclaimer =
    diagnosis?.result?.result?.disclaimer ||
    diagnosis?.result?.disclaimer ||
    ''

  return (
    <SafeAreaView className="flex-1 bg-white">
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-bold text-center mb-6 text-[#19A7CE]">
        Diagnosis Result
      </Text>

      {!possibleConditions.length ? (
        <View className="items-center my-8">
          <Ionicons name="alert-circle" size={48} color="#19A7CE" />
          <Text className="text-gray-500 mt-3">
            No possible conditions detected.
          </Text>
        </View>
      ) : (
        <>
          <Text className="text-xl font-semibold mb-2 text-slate-800">
            Possible Conditions
          </Text>
          {possibleConditions.map((cond, idx) => {
            const risk = cond.riskLevel || 'Default'
            return (
              <View
                key={idx}
                className={`rounded-xl p-4 mb-5 ${riskClass[risk] || riskClass.Default}`}
              >
                <Text className="font-bold text-lg mb-1 text-[#19A7CE]">
                  {cond.condition}
                </Text>
                <Text className="text-slate-600 mb-2">{cond.description}</Text>
                <Text className="font-semibold mb-1">
                  Risk Level:{' '}
                  <Text className={`${textRiskColor[risk] || textRiskColor.Default} font-bold`}>
                    {cond.riskLevel}
                  </Text>
                </Text>
                {cond.additionalInfo ? (
                  <Text className="text-slate-500 text-[13px] mt-2">
                    <Text className="font-semibold text-slate-700">Info:</Text> {cond.additionalInfo}
                  </Text>
                ) : null}
              </View>
            )
          })}
        </>
      )}

      {/* General Advice */}
      {(generalAdvice.recommendedActions || generalAdvice.lifestyleConsiderations || generalAdvice.whenToSeekMedicalAttention) && (
        <View className="rounded-xl p-4 mb-5 bg-blue-50 border-l-4 border-blue-200">
          <Text className="text-slate-800 font-bold text-base mb-2 flex-row items-center">
            <Ionicons name="information-circle" size={16} color="#19A7CE" /> General Advice
          </Text>
          {generalAdvice.recommendedActions && generalAdvice.recommendedActions.length > 0 && (
            <>
              <Text className="text-slate-700 font-semibold mb-1">Recommended Actions:</Text>
              {generalAdvice.recommendedActions.map((item, ix) => (
                <Text key={ix} className="text-slate-600 ml-2 mb-1">
                  • {item}
                </Text>
              ))}
            </>
          )}
          {generalAdvice.lifestyleConsiderations && generalAdvice.lifestyleConsiderations.length > 0 && (
            <>
              <Text className="text-slate-700 font-semibold mt-3 mb-1">Lifestyle Considerations:</Text>
              {generalAdvice.lifestyleConsiderations.map((item, ix) => (
                <Text key={ix} className="text-slate-600 ml-2 mb-1">
                  • {item}
                </Text>
              ))}
            </>
          )}
          {generalAdvice.whenToSeekMedicalAttention && generalAdvice.whenToSeekMedicalAttention.length > 0 && (
            <>
              <Text className="text-slate-700 font-semibold mt-3 mb-1">When to Seek Medical Attention:</Text>
              {generalAdvice.whenToSeekMedicalAttention.map((item, ix) => (
                <Text key={ix} className="text-red-700 ml-2 mb-1">
                  • {item}
                </Text>
              ))}
            </>
          )}
        </View>
      )}

      {/* Disclaimer */}
      {disclaimer ? (
        <View className="rounded-md px-3 py-3 bg-orange-50 mb-8 border-l-4 border-orange-300">
          <Text className="text-orange-900 text-[13px] italic">
            {disclaimer}
          </Text>
        </View>
      ) : null}
    </ScrollView>
    </SafeAreaView>
  )
}

export default Diagnosis