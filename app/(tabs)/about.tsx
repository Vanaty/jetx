import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert as AlertTriangle, Info, Shield, Sparkles } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <LinearGradient
      colors={['#0a0015', '#1a0030', '#0a0015']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            style={styles.iconContainer}
          >
            <Info color="#fff" size={32} />
          </LinearGradient>
          <Text style={styles.title}>À propos de l'application</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles color="#FFD700" size={20} />
            <Text style={styles.sectionTitle}>JetX Predictor</Text>
          </View>
          <Text style={styles.sectionText}>
            JetX Predictor est une application de prédiction pour le jeu JetX. Elle utilise des algorithmes
            personnalisés pour générer des prédictions à des fins éducatives et de
            divertissement uniquement.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield color="#00ff88" size={20} />
            <Text style={styles.sectionTitle}>Fonctionnalités</Text>
          </View>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>
              • Prédictions générées en temps réel
            </Text>
            <Text style={styles.featureItem}>
              • Historique des prédictions récentes
            </Text>
            <Text style={styles.featureItem}>
              • Système de comptes utilisateurs sécurisé
            </Text>
          </View>
        </View>

        <View style={styles.warningCard}>
          <LinearGradient
            colors={['#ff4444', '#cc0000']}
            style={styles.warningGradient}
          >
            <AlertTriangle color="#fff" size={24} />
            <Text style={styles.warningTitle}>Avertissement Important</Text>
            <Text style={styles.warningText}>
              Mahaiza milalao mise, tsy preci be io fa prediction 80% zany hoe tsy possible ho gains foana. Fa rehefa perte dia atao X2 ny mise ary milalao intelo misesy (3 fois), dia mety hahazo gains ianao. Antony: indraindray tara kely ilay système 🤘 Rehefa misy cote +7 eo alohany ilay heure dia tsy miditra intsony. 👉 ×2 no assuré 90% ka mila miala ×2 ianao 🚀
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info color="#8B5CF6" size={20} />
            <Text style={styles.sectionTitle}>Technologies utilisées</Text>
          </View>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• React Native & Expo</Text>
            <Text style={styles.featureItem}>• TypeScript</Text>
            <Text style={styles.featureItem}>• Supabase (Base de données)</Text>
            <Text style={styles.featureItem}>• Expo Crypto (Cryptographie)</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>© 2026 JetX Predictor</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  warningCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  warningGradient: {
    padding: 16,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});
