import { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { AppColors, DarkColors, LightColors } from '../constants/Colors';
import { ALL_HOSPITAL_NAMES } from '../constants/nhsData';

type Props = { value: string; onChange: (name: string) => void; };

export default function HospitalPicker({ value, onChange }: Props) {
  const scheme = useColorScheme();
  const C = scheme === 'dark' ? DarkColors : LightColors;
  const styles = makeStyles(C);

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = search.length >= 2
    ? ALL_HOSPITAL_NAMES.filter(h => h.toLowerCase().includes(search.toLowerCase()))
    : ALL_HOSPITAL_NAMES;

  function open() { setSearch(''); setModalVisible(true); }
  function select(name: string) { onChange(name); setModalVisible(false); }

  return (
    <>
      <TouchableOpacity style={styles.input} onPress={open}>
        <Text style={{ color: value ? C.textPrimary : C.textTertiary, fontSize: 15 }}>
          {value || 'Select your hospital'}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} animationType="slide"
        presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select hospital</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search hospitals..."
              placeholderTextColor={C.textTertiary}
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
                  <Text style={[styles.itemText, isSelected && styles.itemTextActive]}>{item}</Text>
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

function makeStyles(C: AppColors) {
  return StyleSheet.create({
    input: { backgroundColor: C.input, borderRadius: 12, padding: 14, fontSize: 15, borderWidth: 0.5, borderColor: C.border, marginBottom: 16 },
    modal: { flex: 1, backgroundColor: C.bg },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, backgroundColor: C.surface, borderBottomWidth: 0.5, borderBottomColor: C.border },
    modalTitle: { fontSize: 17, fontWeight: '600', color: C.textPrimary },
    modalClose: { fontSize: 15, color: C.textSecondary },
    searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, marginHorizontal: 16, marginTop: 16, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, paddingHorizontal: 14 },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: C.textPrimary },
    clearBtn: { paddingLeft: 8 },
    clearBtnText: { fontSize: 13, color: C.textSecondary },
    hint: { fontSize: 11, color: C.textSecondary, paddingHorizontal: 20, marginTop: 8, marginBottom: 4 },
    item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface, paddingHorizontal: 20, paddingVertical: 14 },
    itemActive: { backgroundColor: C.blueLight },
    itemText: { fontSize: 15, color: C.textPrimary, flex: 1 },
    itemTextActive: { color: C.blueText, fontWeight: '500' },
    tick: { fontSize: 15, color: C.blueText, fontWeight: '600', marginLeft: 8 },
    separator: { height: 0.5, backgroundColor: C.bg },
    empty: { padding: 32, alignItems: 'center' },
    emptyText: { fontSize: 14, color: C.textSecondary, textAlign: 'center' },
  });
}
