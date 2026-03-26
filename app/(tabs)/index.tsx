import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { LogOut } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
export default function JetXScreen() {
  const { profile, signOut } = useAuth();
  const [time, setTime] = useState('');
  const [hash, setHash] = useState('');
  const [multi, setMulti] = useState('');
  const [prediction, setPrediction] = useState<number | null>(5.19);
  const [percent, setPercent] = useState(34);


  const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const randTime = (s: number) => {
    let d = new Date();
    d.setSeconds(d.getSeconds() + s);
    return d.toLocaleTimeString();
  }

  const [history, setHistory] = useState([
    { time: randTime(20), hash: 'A1B2C3D4E5', result: `${rand(1.13,2.51).toFixed(2)}` },
    { time: randTime(40), hash: 'F6G7H8I9J0', result: `${rand(1.30,3.78).toFixed(2)}` },
    { time: randTime(60), hash: 'K1L2M3N4O5', result: `${rand(1.90,6.32).toFixed(2)}` },
  ]);

  const handlePredict = () => {
    if (!time || !hash || !multi) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    const seed = hash
      .split('')
      .reduce((a, c) => a + c.charCodeAt(0), 0);

    const result = ((seed % 500) / 100).toFixed(2);
    const val = Math.max(1.2, parseFloat(result));

    setPrediction(val);
    setPercent(Math.floor((val / 10) * 100));
    let newEntry = [
      { time: randTime(20), hash: 'A1B2C3D4E5', result: `${rand(1.13,2.51).toFixed(2)}` },
      { time: randTime(40), hash: 'F6G7H8I9J0', result: `${rand(1.30,3.78).toFixed(2)}` },
      { time: randTime(60), hash: 'K1L2M3N4O5', result: `${rand(1.90,6.32).toFixed(2)}` },
    ];
    newEntry.unshift({ time: randTime(1), hash, result: `${val}` });
    setHistory(newEntry.slice(0, 3));
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#0a0015', '#1a0030', '#0a0015']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.username}>{profile?.display_name}</Text>
          {profile?.expiration_date && (
            <Text style={styles.expiration}>
              Expire le:{' '}
              {new Date(profile.expiration_date).toLocaleDateString('fr-FR')}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut color="#fff" size={24} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>🚀 JET X 😎</Text>

      {/* INPUT HEURE */}
      <Text style={styles.label}>🕒 Heure (HH:MM:SS)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 12:45:30"
        placeholderTextColor="#777"
        value={time}
        onChangeText={setTime}
      />

      {/* INPUT HASH */}
      <Text style={styles.label}>🧾 HASH</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: A7F9X2B9KQ"
        placeholderTextColor="#777"
        value={hash}
        onChangeText={setHash}
      />

      {/* INPUT MULTI */}
      <Text style={styles.label}>📜 Multiplicateur</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 3"
        placeholderTextColor="#777"
        value={multi}
        onChangeText={setMulti}
        keyboardType="numeric"
      />

      {/* RESULT */}
      <Text style={styles.result}>
        x{prediction?.toFixed(2)}
      </Text>

      <Text style={styles.percent}>{percent}%</Text>

      {/* PROGRESS BAR */}
      <View style={styles.progressBar}>
        <LinearGradient
          colors={['#ff004c', '#00ff88']}
          style={[styles.progressFill, { width: `${percent}%` }]}
        />
      </View>

      {/* BUTTON */}
      <TouchableOpacity onPress={handlePredict}>
        <LinearGradient
          colors={['#ff004c', '#00c6ff']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>PRÉDICTION</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* FUTURE CARDS */}
      <View style={styles.futureRow}>
        {history.map((item, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardTime}>{item.time}</Text>
            <Text style={styles.cardValue}>x{item.result}</Text>
            <View style={styles.cardBar}>
              <LinearGradient
                colors={['#ff004c', '#00c6ff']}
                style={styles.cardFill}
              />
            </View>
          </View>
        ))}
      </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    padding: 10,
  },

  logoutButton: {
    padding: 8,
  },

  greeting: {
    fontSize: 16,
    color: '#999',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 48,
  },

  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  expiration: {
    fontSize: 12,
    color: '#FFD700',
    marginTop: 4,
  },

  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 40,
    marginBottom: 20,
  },

  label: {
    marginTop: 12,
    marginBottom: 6,
    color: '#aaa',
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#ffffff0d',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    color: '#fff',
  },

  result: {
    fontSize: 48,
    textAlign: 'center',
    marginTop: 25,
    fontWeight: 'bold',
    color: '#FFD700',
  },

  percent: {
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 10,
  },

  progressBar: {
    height: 8,
    backgroundColor: '#ffffff1a',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
  },

  button: {
    marginTop: 20,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  futureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },

  card: {
    backgroundColor: '#ffffff0d',
    padding: 12,
    borderRadius: 15,
    width: '30%',
    alignItems: 'center',
  },

  cardTime: {
    fontSize: 12,
    color: '#aaa',
  },

  cardValue: {
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#fff',
  },

  cardBar: {
    height: 4,
    width: '100%',
    backgroundColor: '#ffffff1a',
    borderRadius: 5,
    overflow: 'hidden',
  },

  cardFill: {
    width: '60%',
    height: '100%',
  },
});