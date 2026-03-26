import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/database';
import { supabase } from '@/utils/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Calendar, CreditCard as Edit, Trash2, UserPlus, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface UserFormData {
  email: string;
  password: string;
  displayName: string;
  expirationDate: string;
  isAdmin: boolean;
}

export default function AdminScreen() {
  const { profile,refreshProfile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    displayName: '',
    expirationDate: '',
    isAdmin: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (profile && !profile.is_admin) {
      Alert.alert('Accès refusé', 'Vous n\'avez pas les droits pour accéder à cette page.');
      router.push("/(tabs)");
    }
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      displayName: '',
      expirationDate: '',
      isAdmin: false,
    });
    setError('');
    setModalVisible(true);
  };

  const openEditModal = (user: Profile) => {
    setEditingUser(user);
    setFormData({
      email: '',
      password: '',
      displayName: user.display_name,
      expirationDate: user.expiration_date
        ? new Date(user.expiration_date).toISOString().split('T')[0]
        : '',
      isAdmin: user.is_admin,
    });
    setError('');
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    setError('');

    if (editingUser) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  const handleCreate = async () => {
    if (!formData.email || !formData.password || !formData.displayName) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setFormLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              display_name: formData.displayName,
            },
          },
        });

      if (authError) throw authError;

      if (authData.user) {
        const updateData: {
          display_name: string;
          is_admin: boolean;
          expiration_date: string | null;
        } = {
          display_name: formData.displayName,
          is_admin: formData.isAdmin,
          expiration_date: formData.expirationDate || null,
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      setModalVisible(false);
      await loadUsers();
      await refreshProfile();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingUser || !formData.displayName) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setFormLoading(true);

    try {
      const updateData: {
        display_name: string;
        is_admin: boolean;
        expiration_date: string | null;
      } = {
        display_name: formData.displayName,
        is_admin: formData.isAdmin,
        expiration_date: formData.expirationDate || null,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', editingUser.id);

      if (error) throw error;

      setModalVisible(false);
      await loadUsers();
      await refreshProfile();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.admin.deleteUser(userId);
              if (error) throw error;
              await loadUsers();
              await refreshProfile();
            } catch (err: any) {
              console.error('Delete error:', err);
              Alert.alert('Erreur', 'Impossible de supprimer cet utilisateur');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#0a0015', '#1a0030', '#0a0015']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0a0015', '#1a0030', '#0a0015']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des utilisateurs</Text>
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            style={styles.addButtonGradient}
          >
            <UserPlus color="#fff" size={20} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.display_name}</Text>
              {user.is_admin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>Admin</Text>
                </View>
              )}
              {user.expiration_date && (
                <View style={styles.expirationContainer}>
                  <Calendar color="#FFD700" size={14} />
                  <Text style={styles.expirationText}>
                    Expire: {new Date(user.expiration_date).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              )}
              <Text style={styles.userDate}>
                Créé le: {new Date(user.created_at).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={styles.userActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openEditModal(user)}
              >
                <Edit color="#8B5CF6" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDelete(user.id)}
              >
                <Trash2 color="#ff4444" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingUser ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#fff" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {!editingUser && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.email}
                      onChangeText={(text) =>
                        setFormData({ ...formData, email: text })
                      }
                      placeholder="email@example.com"
                      placeholderTextColor="#666"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mot de passe *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.password}
                      onChangeText={(text) =>
                        setFormData({ ...formData, password: text })
                      }
                      placeholder="••••••••"
                      placeholderTextColor="#666"
                      secureTextEntry
                    />
                  </View>
                </>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom d&apo;affichage *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.displayName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, displayName: text })
                  }
                  placeholder="Nom de l'utilisateur"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date d&apo;spiration</Text>
                <TextInput
                  style={styles.input}
                  value={formData.expirationDate}
                  onChangeText={(text) =>
                    setFormData({ ...formData, expirationDate: text })
                  }
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  setFormData({ ...formData, isAdmin: !formData.isAdmin })
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.isAdmin && styles.checkboxChecked,
                  ]}
                >
                  {formData.isAdmin && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Administrateur</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={formLoading}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#6D28D9']}
                  style={styles.submitButtonGradient}
                >
                  {formLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {editingUser ? 'Mettre à jour' : 'Créer'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  userCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  adminBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expirationText: {
    fontSize: 12,
    color: '#FFD700',
  },
  userDate: {
    fontSize: 12,
    color: '#666',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0a0015',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8B5CF6',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#fff',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorContainer: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});
