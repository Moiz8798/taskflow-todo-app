import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, KeyboardAvoidingView,
  Platform, RefreshControl, Alert, Animated, Dimensions, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const STORAGE_KEY = '@taskflow_todos_v2';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function loadTodos() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultTodos();
  } catch {
    return getDefaultTodos();
  }
}

async function saveTodos(todos) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {}
}

function getDefaultTodos() {
  return [
    { id: uid(), title: 'Buy groceries 🛒', completed: false, priority: 'high', category: 'personal', createdAt: new Date().toISOString(), dueDate: null },
    { id: uid(), title: 'Read a book 📚', completed: true, priority: 'low', category: 'personal', createdAt: new Date().toISOString(), dueDate: null },
    { id: uid(), title: 'Finish project report', completed: false, priority: 'high', category: 'work', createdAt: new Date().toISOString(), dueDate: null },
    { id: uid(), title: 'Go for a walk 🚶', completed: false, priority: 'medium', category: 'health', createdAt: new Date().toISOString(), dueDate: null },
  ];
}

const PRIORITY = {
  high:   { color: '#FF5C5C', bg: '#FF5C5C18', label: 'High',   dot: '🔴' },
  medium: { color: '#FFB547', bg: '#FFB54718', label: 'Medium', dot: '🟡' },
  low:    { color: '#4CD97B', bg: '#4CD97B18', label: 'Low',    dot: '🟢' },
};

const CATEGORIES = [
  { key: 'all',      label: 'All',      icon: 'apps',           color: '#7C6FFF' },
  { key: 'work',     label: 'Work',     icon: 'briefcase',      color: '#FF7CAC' },
  { key: 'personal', label: 'Personal', icon: 'person',         color: '#7CC8FF' },
  { key: 'health',   label: 'Health',   icon: 'fitness',        color: '#4CD97B' },
  { key: 'shopping', label: 'Shopping', icon: 'cart',           color: '#FFB547' },
  { key: 'other',    label: 'Other',    icon: 'ellipsis-horizontal', color: '#B47CFF' },
];

const SORT_OPTIONS = [
  { key: 'newest',   label: 'Newest first' },
  { key: 'oldest',   label: 'Oldest first' },
  { key: 'priority', label: 'By priority' },
  { key: 'alpha',    label: 'A → Z' },
];

// ── Swipeable Todo Item ─────────────────────────────────────────────────────
function TodoItem({ item, onToggle, onDelete, onEdit, index }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.title);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(item.completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, delay: index * 50, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(checkAnim, { toValue: item.completed ? 1 : 0, tension: 150, friction: 8, useNativeDriver: true }).start();
  }, [item.completed]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.95, tension: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 300, useNativeDriver: true }),
    ]).start(() => onToggle(item.id, !item.completed));
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', `Remove "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => {
          Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: -width, duration: 250, useNativeDriver: true }),
          ]).start(() => onDelete(item.id));
        },
      },
    ]);
  };

  const handleEditDone = () => {
    if (text.trim() && text.trim() !== item.title) onEdit(item.id, text.trim());
    setEditing(false);
  };

  const p = PRIORITY[item.priority || 'medium'];
  const cat = CATEGORIES.find(c => c.key === item.category) || CATEGORIES[0];

  const checkScale = checkAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.3, 1] });

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }}>
      <View style={[styles.card, item.completed && styles.cardDone]}>
        {/* Priority stripe */}
        <LinearGradient
          colors={item.completed ? ['#1E1E35', '#1E1E35'] : [p.color + '99', p.color + '33']}
          style={styles.stripe}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        />

        <View style={styles.cardInner}>
          {/* Checkbox */}
          <TouchableOpacity onPress={handleToggle} activeOpacity={0.8} style={styles.checkWrap}>
            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
              <LinearGradient
                colors={item.completed ? [p.color, p.color + 'AA'] : ['#1A1A2E', '#1A1A2E']}
                style={[styles.checkbox, item.completed && { borderColor: p.color }]}
              >
                {item.completed && (
                  <Ionicons name="checkmark" size={15} color="#fff" />
                )}
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.cardContent}>
            {editing ? (
              <TextInput
                style={styles.editInput}
                value={text}
                onChangeText={setText}
                onBlur={handleEditDone}
                onSubmitEditing={handleEditDone}
                autoFocus
                selectionColor="#7C6FFF"
              />
            ) : (
              <TouchableOpacity onLongPress={() => setEditing(true)} activeOpacity={0.8}>
                <Text style={[styles.cardTitle, item.completed && styles.cardTitleDone]} numberOfLines={2}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}

            {/* Meta row */}
            <View style={styles.cardMeta}>
              <View style={[styles.catBadge, { backgroundColor: cat.color + '22' }]}>
                <Ionicons name={cat.icon} size={10} color={cat.color} />
                <Text style={[styles.catBadgeText, { color: cat.color }]}>{cat.label}</Text>
              </View>
              {!item.completed && (
                <View style={[styles.prioBadge, { backgroundColor: p.bg }]}>
                  <Text style={[styles.prioBadgeText, { color: p.color }]}>{p.dot} {p.label}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setEditing(!editing)} activeOpacity={0.7}>
              <Ionicons name={editing ? 'close' : 'pencil-outline'} size={15} color="#7C6FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRed]} onPress={handleDelete} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={15} color="#FF5C5C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// ── Add / Edit Sheet ────────────────────────────────────────────────────────
function TaskSheet({ visible, onAdd, onClose }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: height, duration: 300, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => { setText(''); setPriority('medium'); setCategory('personal'); });
    }
  }, [visible]);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), priority, category);
    setText('');
    setPriority('medium');
    setCategory('personal');
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} pointerEvents="auto">
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={styles.sheetHandle} />

        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>✦ New Task</Text>
          <TouchableOpacity onPress={onClose} style={styles.sheetClose}>
            <Ionicons name="close" size={20} color="#5A5A8A" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.sheetInput}
          placeholder="What needs to be done?"
          placeholderTextColor="#3A3A5C"
          value={text}
          onChangeText={setText}
          selectionColor="#7C6FFF"
          autoFocus
          multiline
          maxLength={200}
        />
        <Text style={styles.charCount}>{text.length}/200</Text>

        {/* Priority */}
        <Text style={styles.sheetLabel}>PRIORITY</Text>
        <View style={styles.priorityRow}>
          {Object.entries(PRIORITY).map(([key, val]) => (
            <TouchableOpacity
              key={key}
              style={[styles.priorityChip, priority === key && { backgroundColor: val.color, borderColor: val.color }]}
              onPress={() => setPriority(key)}
            >
              <Text style={[styles.priorityChipText, priority === key && { color: '#fff' }]}>
                {val.dot} {val.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text style={styles.sheetLabel}>CATEGORY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.catChip, category === cat.key && { backgroundColor: cat.color, borderColor: cat.color }]}
              onPress={() => setCategory(cat.key)}
            >
              <Ionicons name={cat.icon} size={13} color={category === cat.key ? '#fff' : cat.color} />
              <Text style={[styles.catChipText, category === cat.key && { color: '#fff' }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity onPress={handleAdd} activeOpacity={0.85} disabled={!text.trim()} style={styles.addBtnWrap}>
          <LinearGradient
            colors={text.trim() ? ['#7C6FFF', '#B47CFF'] : ['#1A1A2E', '#1A1A2E']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.addBtn}
          >
            <Ionicons name="add-circle-outline" size={20} color={text.trim() ? '#fff' : '#3A3A5C'} />
            <Text style={[styles.addBtnText, !text.trim() && { color: '#3A3A5C' }]}>Add Task</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ── Sort Sheet ──────────────────────────────────────────────────────────────
function SortSheet({ visible, current, onSelect, onClose }) {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : height,
      tension: 70, friction: 12, useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <TouchableOpacity style={[StyleSheet.absoluteFillObject, styles.backdrop]} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.sortSheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Sort By</Text>
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortOption, current === opt.key && styles.sortOptionActive]}
            onPress={() => { onSelect(opt.key); onClose(); }}
          >
            <Text style={[styles.sortOptionText, current === opt.key && styles.sortOptionTextActive]}>{opt.label}</Text>
            {current === opt.key && <Ionicons name="checkmark" size={18} color="#7C6FFF" />}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

// ── Stats Card ──────────────────────────────────────────────────────────────
function StatsBar({ todos }) {
  const total = todos.length;
  const done = todos.filter(t => t.completed).length;
  const active = total - done;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, { toValue: pct, duration: 600, useNativeDriver: false }).start();
  }, [pct]);

  return (
    <View style={styles.statsWrap}>
      <View style={styles.statsCards}>
        {[
          { label: 'Total', val: total, color: '#7C6FFF', icon: 'list-outline' },
          { label: 'Active', val: active, color: '#FF7CAC', icon: 'time-outline' },
          { label: 'Done', val: done, color: '#4CD97B', icon: 'checkmark-done-outline' },
          { label: 'Done %', val: `${pct}%`, color: '#FFB547', icon: 'analytics-outline' },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <LinearGradient colors={[s.color + '22', s.color + '08']} style={styles.statCardGrad}>
              <Ionicons name={s.icon} size={18} color={s.color} />
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </LinearGradient>
          </View>
        ))}
      </View>

      {total > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressPct}>{pct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, {
              width: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
            }]}>
              <LinearGradient colors={['#7C6FFF', '#FF7CAC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFillObject} />
            </Animated.View>
          </View>
        </View>
      )}
    </View>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');   // category filter
  const [statusFilter, setStatusFilter] = useState('all');   // all/active/done
  const [sortBy, setSortBy] = useState('newest');
  const [showStats, setShowStats] = useState(true);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    (async () => {
      const data = await loadTodos();
      setTodos(data);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback((next) => {
    setTodos(next);
    saveTodos(next);
  }, []);

  const handleAdd = (title, priority, category) => {
    const t = { id: uid(), title, completed: false, priority, category, createdAt: new Date().toISOString(), dueDate: null };
    persist([t, ...todos]);
    setShowSheet(false);
  };

  const handleToggle = (id, completed) => persist(todos.map(t => t.id === id ? { ...t, completed } : t));
  const handleDelete = (id) => persist(todos.filter(t => t.id !== id));
  const handleEdit   = (id, title) => persist(todos.map(t => t.id === id ? { ...t, title } : t));

  const handleClearCompleted = () => {
    const count = todos.filter(t => t.completed).length;
    if (!count) { Alert.alert('Nothing to clear', 'No completed tasks.'); return; }
    Alert.alert('Clear Completed', `Remove ${count} completed task${count > 1 ? 's' : ''}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => persist(todos.filter(t => !t.completed)) },
    ]);
  };

  const handleMarkAllDone = () => {
    const hasActive = todos.some(t => !t.completed);
    if (!hasActive) { Alert.alert('All done!', 'Every task is already completed.'); return; }
    Alert.alert('Mark All Done', 'Mark all tasks as completed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Mark All', onPress: () => persist(todos.map(t => ({ ...t, completed: true }))) },
    ]);
  };

  const PRIO_ORDER = { high: 0, medium: 1, low: 2 };

  const filtered = todos
    .filter(t => activeFilter === 'all' || t.category === activeFilter)
    .filter(t => statusFilter === 'active' ? !t.completed : statusFilter === 'done' ? t.completed : true)
    .filter(t => !searchText.trim() || t.title.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'oldest')   return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') return PRIO_ORDER[a.priority] - PRIO_ORDER[b.priority];
      if (sortBy === 'alpha')    return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt); // newest
    });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning ☀️';
    if (h < 17) return 'Good afternoon 🌤';
    return 'Good evening 🌙';
  };

  return (
    <View style={styles.bg}>
      <StatusBar style="dark" />

      <View style={styles.mesh1} />
      <View style={styles.mesh2} />
      <View style={styles.mesh3} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

          {/* ── Header ── */}
          <Animated.View style={[styles.header, {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>{greeting()}</Text>
              <Text style={styles.appName}>TaskFlow</Text>
            </View>
            <View style={styles.headerBtns}>
              <TouchableOpacity style={styles.hBtn} onPress={() => setShowSearch(s => !s)}>
                <Ionicons name={showSearch ? 'close' : 'search-outline'} size={19} color="#A090FF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.hBtn} onPress={() => setShowStats(s => !s)}>
                <Ionicons name="analytics-outline" size={19} color="#FF7CAC" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.hBtn} onPress={() => setShowSort(true)}>
                <Ionicons name="funnel-outline" size={19} color="#4CD97B" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ── Search Bar ── */}
          {showSearch && (
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#5A5A8A" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tasks..."
                placeholderTextColor="#3A3A5C"
                value={searchText}
                onChangeText={setSearchText}
                selectionColor="#7C6FFF"
                autoFocus
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle" size={16} color="#5A5A8A" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ── Stats ── */}
          {showStats && !loading && <StatsBar todos={todos} />}

          {/* ── Category Filter ── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catFilterScroll} contentContainerStyle={styles.catFilterContent}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[styles.catFilter, activeFilter === cat.key && { backgroundColor: cat.color, borderColor: cat.color }]}
                onPress={() => setActiveFilter(cat.key)}
              >
                <Ionicons name={cat.icon} size={13} color={activeFilter === cat.key ? '#fff' : cat.color} />
                <Text style={[styles.catFilterText, activeFilter === cat.key && { color: '#fff' }]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Status Filter ── */}
          <View style={styles.statusTabs}>
            {[['all', 'All'], ['active', 'Active'], ['done', 'Done']].map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.statusTab, statusFilter === key && styles.statusTabActive]}
                onPress={() => setStatusFilter(key)}
              >
                {statusFilter === key
                  ? <LinearGradient colors={['#7C6FFF', '#B47CFF']} style={styles.statusTabGrad}>
                      <Text style={styles.statusTabTextActive}>{label}</Text>
                    </LinearGradient>
                  : <Text style={styles.statusTabText}>{label}</Text>
                }
              </TouchableOpacity>
            ))}
            {/* Quick actions */}
            <TouchableOpacity style={styles.quickBtn} onPress={handleMarkAllDone}>
              <Ionicons name="checkmark-done-circle-outline" size={16} color="#4CD97B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={handleClearCompleted}>
              <Ionicons name="trash-outline" size={16} color="#FF5C5C" />
            </TouchableOpacity>
          </View>

          {/* ── List ── */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color="#7C6FFF" size="large" />
              <Text style={styles.centerText}>Loading your tasks...</Text>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.center}>
              <LinearGradient colors={['#12122A', '#1A1A35']} style={styles.emptyBox}>
                <Text style={styles.emptyEmoji}>
                  {searchText ? '🔍' : statusFilter === 'done' ? '🎯' : statusFilter === 'active' ? '🎉' : '✦'}
                </Text>
                <Text style={styles.emptyTitle}>
                  {searchText ? 'No results' : statusFilter === 'done' ? 'Nothing completed yet' : statusFilter === 'active' ? 'All caught up!' : 'No tasks here'}
                </Text>
                <Text style={styles.emptySub}>
                  {searchText ? `No tasks match "${searchText}"` : 'Tap the + button to add a task'}
                </Text>
              </LinearGradient>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={i => i.id}
              renderItem={({ item, index }) => (
                <TodoItem item={item} index={index} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
              )}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={async () => {
                    setRefreshing(true);
                    const data = await loadTodos();
                    setTodos(data);
                    setRefreshing(false);
                  }}
                  tintColor="#7C6FFF"
                />
              }
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowSheet(true)} activeOpacity={0.9}>
        <LinearGradient colors={['#7C6FFF', '#B47CFF']} style={styles.fabGrad}>
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* ── Sheets ── */}
      <TaskSheet visible={showSheet} onAdd={handleAdd} onClose={() => setShowSheet(false)} />
      <SortSheet visible={showSort} current={sortBy} onSelect={setSortBy} onClose={() => setShowSort(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#F6F8FF' },

  mesh1: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: '#7C6FFF10', top: -100, right: -80 },
  mesh2: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: '#FF7CAC12', bottom: 60, left: -70 },
  mesh3: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#4CD97B10', top: height * 0.42, right: -20 },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  greeting: { fontSize: 12, color: '#7A7D94', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  appName: { fontSize: 30, fontWeight: '800', color: '#222639', letterSpacing: -0.8, marginTop: 2 },
  headerBtns: { flexDirection: 'row', gap: 8 },
  hBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8EAF4', alignItems: 'center', justifyContent: 'center' },

  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: '#E8EAF4' },
  searchInput: { flex: 1, color: '#222639', fontSize: 14 },

  statsWrap: { marginHorizontal: 20, marginBottom: 14 },
  statsCards: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statCard: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  statCardGrad: { padding: 12, alignItems: 'center', gap: 4, borderRadius: 14, borderWidth: 1, borderColor: '#F0F2F8', backgroundColor: '#FFFFFF' },
  statVal: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 9, color: '#7A7D94', textTransform: 'uppercase', letterSpacing: 0.6 },
  progressSection: { gap: 8 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 11, color: '#7A7D94', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  progressPct: { fontSize: 11, color: '#7C6FFF', fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: '#E8EBF6', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, overflow: 'hidden' },

  catFilterScroll: { marginBottom: 10 },
  catFilterContent: { paddingHorizontal: 20, gap: 8 },
  catFilter: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8EAF4' },
  catFilterText: { fontSize: 12, fontWeight: '600', color: '#5A5A75' },

  statusTabs: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 4, marginBottom: 14, borderWidth: 1, borderColor: '#E8EAF4', gap: 4 },
  statusTab: { flex: 1, borderRadius: 10, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  statusTabActive: { overflow: 'hidden' },
  statusTabGrad: { width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 10 },
  statusTabText: { fontSize: 12, color: '#7A7D94', fontWeight: '600' },
  statusTabTextActive: { fontSize: 12, color: '#fff', fontWeight: '700' },
  quickBtn: { width: 32, height: 32, borderRadius: 9, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E8EAF4' },

  list: { paddingHorizontal: 20, paddingBottom: 110 },

  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 18, marginBottom: 10, borderWidth: 1, borderColor: '#EEF0F8', overflow: 'hidden', shadowColor: '#A3A6C1', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 18, elevation: 4 },
  cardDone: { opacity: 0.75 },
  stripe: { width: 4 },
  cardInner: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingRight: 12 },
  checkWrap: { paddingHorizontal: 14 },
  checkbox: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#DDE1F0', backgroundColor: '#F8F9FF' },
  cardContent: { flex: 1, gap: 6 },
  cardTitle: { fontSize: 15, color: '#222639', fontWeight: '600', lineHeight: 21 },
  cardTitleDone: { textDecorationLine: 'line-through', color: '#9BA1B9' },
  editInput: { fontSize: 15, color: '#222639', padding: 0, borderBottomWidth: 1.5, borderBottomColor: '#B5B8FF' },
  cardMeta: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  catBadgeText: { fontSize: 10, fontWeight: '700' },
  prioBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  prioBadgeText: { fontSize: 10, fontWeight: '700' },
  cardActions: { gap: 6, marginLeft: 8 },
  actionBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F2F3FF', alignItems: 'center', justifyContent: 'center' },
  actionBtnRed: { backgroundColor: '#FFECEE' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  centerText: { color: '#7A7D94', marginTop: 14, fontSize: 14 },
  emptyBox: { width: '100%', borderRadius: 24, padding: 40, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E8EAF4', backgroundColor: '#FFFFFF' },
  emptyEmoji: { fontSize: 54, marginBottom: 6 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#222639' },
  emptySub: { fontSize: 13, color: '#7A7D94', textAlign: 'center', lineHeight: 20 },

  fab: { position: 'absolute', bottom: 36, right: 24, borderRadius: 22, shadowColor: '#A3A6C1', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 18, elevation: 12 },
  fabGrad: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000030' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: Platform.OS === 'ios' ? 44 : 32, borderTopWidth: 1, borderColor: '#EEF0F8' },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#E1E4F5', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: '#222639' },
  sheetClose: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F2F3FF', alignItems: 'center', justifyContent: 'center' },
  sheetInput: { backgroundColor: '#F4F6FF', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, color: '#222639', fontSize: 15, borderWidth: 1, borderColor: '#E8EAF4', minHeight: 80, textAlignVertical: 'top', marginBottom: 4 },
  charCount: { fontSize: 10, color: '#9BA1B9', textAlign: 'right', marginBottom: 18 },
  sheetLabel: { fontSize: 10, color: '#7A7D94', fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  priorityChip: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: '#F4F6FF', borderWidth: 1.5, borderColor: '#E8EAF4' },
  priorityChipText: { fontSize: 11, fontWeight: '700', color: '#5A5A75' },
  catScroll: { marginBottom: 20 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: '#F4F6FF', borderWidth: 1.5, borderColor: '#E8EAF4', marginRight: 8 },
  catChipText: { fontSize: 12, fontWeight: '600', color: '#5A5A75' },
  addBtnWrap: { borderRadius: 16, overflow: 'hidden' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 16, paddingVertical: 16, gap: 8 },
  addBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  sortSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: Platform.OS === 'ios' ? 44 : 32, borderTopWidth: 1, borderColor: '#EEF0F8' },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#F0F2F8' },
  sortOptionActive: { borderBottomColor: '#D8D9FF' },
  sortOptionText: { fontSize: 15, color: '#5A5A75', fontWeight: '500' },
  sortOptionTextActive: { color: '#7C6FFF', fontWeight: '700' },
});