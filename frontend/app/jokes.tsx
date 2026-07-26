import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

interface Joke {
  id: string;
  setup: string;
  delivery: string;
  timestamp: number;
}

export default function JokeGeneratorScreen() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [jokeHistory, setJokeHistory] = useState<Joke[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using JokeAPI - https://jokeapi.dev/
      const response = await axios.get(
        'https://v2.jokeapi.dev/joke/Programming?type=twopart'
      );

      if (response.data.error) {
        setError('Nepovedlo se získat vtip');
        setLoading(false);
        return;
      }

      const newJoke: Joke = {
        id: `joke_${Date.now()}`,
        setup: response.data.setup,
        delivery: response.data.delivery,
        timestamp: Date.now(),
      };

      setJoke(newJoke);
      setJokeHistory([newJoke, ...jokeHistory]);
    } catch (err) {
      setError('Chyba při stahování vtipu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setJokeHistory([]);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-purple-600 p-6 pt-12">
        <Text className="text-white text-4xl font-bold">😂 Vtip Generátor</Text>
        <Text className="text-purple-100 text-lg mt-2">Skvělé vtipy každý den</Text>
      </View>

      {/* Main Content */}
      <View className="p-6">
        {/* Joke Display */}
        {joke ? (
          <View className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg mb-6 border-2 border-purple-300">
            <Text className="text-gray-800 text-lg mb-4">{joke.setup}</Text>
            <View className="border-t-2 border-purple-300 pt-4">
              <Text className="text-purple-700 text-xl font-bold italic">
                {joke.delivery}
              </Text>
            </View>
          </View>
        ) : (
          <View className="bg-gray-100 p-8 rounded-lg mb-6 justify-center items-center h-32">
            <Text className="text-gray-600 text-lg text-center">
              Klikni na tlačítko pro nový vtip! 😄
            </Text>
          </View>
        )}

        {/* Error Message */}
        {error && (
          <View className="bg-red-100 p-4 rounded-lg mb-4 border-l-4 border-red-500">
            <Text className="text-red-700">{error}</Text>
          </View>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          onPress={fetchJoke}
          disabled={loading}
          className="bg-purple-600 p-4 rounded-lg mb-4 active:bg-purple-700"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              🎲 Získat nový vtip
            </Text>
          )}
        </TouchableOpacity>

        {/* History Section */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold">Historie (😂 {jokeHistory.length})</Text>
            {jokeHistory.length > 0 && (
              <TouchableOpacity
                onPress={clearHistory}
                className="bg-red-500 px-3 py-2 rounded"
              >
                <Text className="text-white text-sm font-bold">Vymazat</Text>
              </TouchableOpacity>
            )}
          </View>

          {jokeHistory.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">
              Žádné vtipy v historii
            </Text>
          ) : (
            jokeHistory.map((j) => (
              <View key={j.id} className="bg-gray-100 p-4 rounded-lg mb-3">
                <Text className="text-gray-800 font-semibold mb-2">{j.setup}</Text>
                <Text className="text-purple-700 italic">{j.delivery}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
