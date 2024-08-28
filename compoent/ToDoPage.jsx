import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageModal from './MessageModal';

const ToDoListPage = ({route}) => {
  const {userId} = route.params;
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({title: '', message: ''});

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const existingTasks = await AsyncStorage.getItem(`tasks_${userId}`);
      const parsedTasks = existingTasks ? JSON.parse(existingTasks) : [];

      if (parsedTasks.length === 0) {
        // Fetch default todos from a fake API (e.g., JSONPlaceholder)
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos?_limit=5',
        );
        const defaultTodos = await response.json();

        const formattedTodos = defaultTodos.map(todo => ({
          id: todo.id.toString(),
          title: todo.title,
          completed: todo.completed,
        }));

        // Save default todos to AsyncStorage
        await AsyncStorage.setItem(
          `tasks_${userId}`,
          JSON.stringify(formattedTodos),
        );
        setTasks(formattedTodos);
      } else {
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Load Tasks Error:', error);
      setModalData({
        title: 'Error',
        message: 'Failed to load tasks.',
      });
      setModalVisible(true);
    }
  };

  const saveTasks = async newTasks => {
    try {
      await AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify(newTasks));
    } catch (error) {
      console.error('Save Tasks Error:', error);
      setModalData({
        title: 'Error',
        message: 'Failed to save tasks.',
      });
      setModalVisible(true);
    }
  };

  const addTask = () => {
    if (!task.trim()) {
      setModalData({
        title: 'Validation Error',
        message: 'Task description cannot be empty.',
      });
      setModalVisible(true);
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      completed: false,
    };

    const newTasks = [newTask, ...tasks];
    setTasks(newTasks);
    setTask('');
    saveTasks(newTasks);
    Keyboard.dismiss();
  };

  const deleteTask = id => {
    const newTasks = tasks.filter(item => item.id !== id);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const toggleTaskCompletion = id => {
    const newTasks = tasks.map(item =>
      item.id === id ? {...item, completed: !item.completed} : item,
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const renderTaskItem = ({item}) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
        <Text
          style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, {color: 'black'}]}
          placeholder="Add a new task"
          value={task}
          onChangeText={setTask}
          returnKeyType="done"
          onSubmitEditing={addTask}
        />
        <Button title="Add" onPress={addTask} color="#1E90FF" />
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.tasksList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks added yet.</Text>
        }
      />

      <MessageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalData.title}
        message={modalData.message}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  tasksList: {
    paddingBottom: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskText: {
    fontSize: 18,
    color: '#333',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteText: {
    color: '#FF6347',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 18,
    marginTop: 50,
  },
});

export default ToDoListPage;
