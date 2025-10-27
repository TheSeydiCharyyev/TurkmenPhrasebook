// src/features/text-translator/components/LanguagePicker.tsx
// Компонент для выбора языка

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { TranslatorLanguage } from '../types/text-translator.types';

interface LanguagePickerProps {
  visible: boolean;
  languages: TranslatorLanguage[];
  selectedLanguage: string;
  onSelect: (languageCode: string) => void;
  onClose: () => void;
  title?: string;
}

export default function LanguagePicker({
  visible,
  languages,
  selectedLanguage,
  onSelect,
  onClose,
  title = 'Select Language',
}: LanguagePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтруем языки по поисковому запросу
  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code: string) => {
    onSelect(code);
    setSearchQuery('');
    onClose();
  };

  const renderLanguageItem = ({ item }: { item: TranslatorLanguage }) => {
    const isSelected = item.code === selectedLanguage;

    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.selectedItem]}
        onPress={() => handleSelect(item.code)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.languageInfo}>
          <Text style={[styles.languageName, isSelected && styles.selectedText]}>
            {item.name}
          </Text>
          <Text style={[styles.nativeName, isSelected && styles.selectedNative]}>
            {item.nativeName}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search languages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Language List */}
        <FlatList
          data={filteredLanguages}
          renderItem={renderLanguageItem}
          keyExtractor={item => item.code}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No languages found</Text>
              <Text style={styles.emptySubtext}>Try a different search</Text>
            </View>
          }
        />

        {/* Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''} available
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  selectedItem: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
  },
  flag: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  selectedText: {
    color: '#10B981',
  },
  nativeName: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedNative: {
    color: '#059669',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
