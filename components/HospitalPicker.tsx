import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ALL_HOSPITAL_NAMES } from '../constants/nhsData';

type Props = {
  value: string;
  onChange: (name: string) => void;
};

export default function HospitalPicker({ value, onChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = search.length >= 2
    ? ALL_HOSPITAL_NAMES.filter(h => h.toLowerCase().includes(search.toLowerCase()))
    : ALL_HOSPITAL_NAMES;

  function open() {
    setSearch('');
    setModalVisible(true);
  }

  function select(name: string) {
    onChange(name);
    setModalVisible(false);
  }

  return (
    <>
      {/* TRIGGER — looks like existing inputs */}
      <TouchableOpacity style={styles.input} onPress={open}>
        <Text style={{ color: value ? '#1C1C1E' : '#C7C7CC', fontSize: 15 }}>
          {value || 'Select your hospital'}
        </Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>

          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select hospital</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search hospitals..."
              placeholderTextColor="#C7C7CC"
              value={search}
              onChangeText={setSearch}
              autoFocus
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.hint}>
            {search.length === 0
              ? `${ALL_HOSPITAL_NAMES.length} NHS hospitals · Type to search`
              : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
          </Text>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={item => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isSelected = value === item;
              return (
                <TouchableOpacity
                  style={[styles.item, isSelected && styles.itemActive]}
                  onPress={() => select(item)}
                >
                  <Text style={[styles.itemText, isSelected && styles.itemTextActive]}>
                    {item}
                  </Text>
                  {isSelected && <Text style={styles.tick}>✓</Text>}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No hospitals found for "{search}"</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Trigger input — matches existing app input style
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    marginBottom: 16,
  },

  // Modal
  modal: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalClose: {
    fontSize: 15,
    color: '#8E8E93',
  },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1C1C1E',
  },
  clearBtn: {
    paddingLeft: 8,
  },
  clearBtnText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  hint: {
    fontSize: 11,
    color: '#8E8E93',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },

  // List items
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  itemActive: {
    backgroundColor: '#E6F1FB',
  },
  itemText: {
    fontSize: 15,
    color: '#1C1C1E',
    flex: 1,
  },
  itemTextActive: {
    color: '#005EB8',
    fontWeight: '500',
  },
  tick: {
    fontSize: 15,
    color: '#005EB8',
    fontWeight: '600',
    marginLeft: 8,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#F2F2F7',
  },

  // Empty
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
