const { useState, useEffect } = React;
const { Check, Droplets, Target, Plus, Trash2, Edit2, X } = lucide;

function DailyScheduleApp() {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [waterBottles, setWaterBottles] = useState({ morning: 0, afternoon: 0, evening: 0, night: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const defaultSchedule = [
    { time: '9:00 – 9:20', task: 'Wake up, freshen up, light stretch', period: 'morning' },
    { time: '9:20 – 9:45', task: 'Breakfast / chill', period: 'morning' },
    { time: '9:45 – 10:45', task: 'SQL / Excel (alternate days)', period: 'morning' },
    { time: '10:45 – 11:00', task: 'Break (walk / music)', period: 'morning' },
    { time: '11:00 – 12:00', task: 'Power BI', period: 'morning' },
    { time: '12:00 – 12:15', task: 'Relax', period: 'afternoon' },
    { time: '1:00 – 1:30', task: 'Lunch', period: 'afternoon' },
    { time: '1:30 – 2:00', task: 'Stock Market Learning', period: 'afternoon' },
    { time: '2:00 – 4:00', task: 'Personal time / rest / errands', period: 'afternoon' },
    { time: '4:00 – 6:00', task: 'Python Study (Concepts + coding practice)', period: 'evening' },
    { time: '6:00 – 8:00', task: 'Python Deep Focus (Pandas, NumPy, EDA)', period: 'evening' },
    { time: '8:00 – 9:00', task: 'Dinner + fun', period: 'night' },
    { time: '9:30 – 9:45', task: 'Job application / quick revision', period: 'night' },
    { time: 'After 10:00', task: 'Sleep prep', period: 'night' }
  ];

  const defaultGoals = [
    'Get a job (Q1 / first half 2025)',
    'Strong Data Analyst by mid-2025',
    'Python mastery (daily practice)',
    'Weight gain to 65 kg (eat clean)',
    'Learn stock market (long-term investing)',
    'Drink 4 liters water daily'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const tasksData = localStorage.getItem('schedule-tasks');
      const goalsData = localStorage.getItem('schedule-goals');
      const waterData = localStorage.getItem('schedule-water');
      const dateData = localStorage.getItem('schedule-date');
      const today = new Date().toDateString();
      const lastDate = dateData ? JSON.parse(dateData) : null;
      if (lastDate !== today) {
        resetDay();
      } else {
        if (tasksData) setTasks(JSON.parse(tasksData));
        else initializeTasks();
        if (goalsData) setGoals(JSON.parse(goalsData));
        else initializeGoals();
        if (waterData) setWaterBottles(JSON.parse(waterData));
      }
    } catch (error) {
      initializeTasks();
      initializeGoals();
    }
  };

  const initializeTasks = () => {
    const initialized = defaultSchedule.map((item, i) => ({
      id: `task-${i}`,
      ...item,
      completed: false,
      isCustom: false
    }));
    setTasks(initialized);
    saveTasks(initialized);
  };

  const initializeGoals = () => {
    const initialized = defaultGoals.map((goal, i) => ({
      id: `goal-${i}`,
      text: goal,
      completed: false
    }));
    setGoals(initialized);
    saveGoals(initialized);
  };

  const resetDay = () => {
    const today = new Date().toDateString();
    initializeTasks();
    initializeGoals();
    const resetWater = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    setWaterBottles(resetWater);
    localStorage.setItem('schedule-water', JSON.stringify(resetWater));
    localStorage.setItem('schedule-date', JSON.stringify(today));
  };

  const saveTasks = (taskList) => {
    try {
      localStorage.setItem('schedule-tasks', JSON.stringify(taskList));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const saveGoals = (goalList) => {
    try {
      localStorage.setItem('schedule-goals', JSON.stringify(goalList));
    } catch (error) {
      console.error('Failed to save goals:', error);
    }
  };

  const saveWater = (water) => {
    try {
      localStorage.setItem('schedule-water', JSON.stringify(water));
    } catch (error) {
      console.error('Failed to save water:', error);
    }
  };

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    saveTasks(updated);
  };

  const toggleGoal = (id) => {
    const updated = goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    setGoals(updated);
    saveGoals(updated);
  };

  const addWater = (period, amount) => {
    const maxBottles = { morning: 2, afternoon: 1.5, evening: 1, night: 0.5 };
    const newValue = Math.min(waterBottles[period] + amount, maxBottles[period]);
    const updated = { ...waterBottles, [period]: newValue };
    setWaterBottles(updated);
    saveWater(updated);
  };

  const addCustomTask = (period) => {
    const newTask = {
      id: `custom-${Date.now()}`,
      time: 'Custom',
      task: 'New task - click edit to change',
      period,
      completed: false,
      isCustom: true
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveTasks(updated);
  };

  const editTask = (id, newText) => {
    const updated = tasks.map(t => t.id === id ? { ...t, task: newText } : t);
    setTasks(updated);
    saveTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      editTask(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  };

  const periods = [
    { id: 'morning', icon: '🌅', title: 'MORNING', time: '9:00 AM – 12:00 PM', bottles: 2, liters: '1.5 L' },
    { id: 'afternoon', icon: '☀️', title: 'AFTERNOON', time: '12:00 PM – 4:00 PM', bottles: 1.5, liters: '1.1 L' },
    { id: 'evening', icon: '🌆', title: 'EVENING', time: '4:00 PM – 8:00 PM', bottles: 1, liters: '750 ml' },
    { id: 'night', icon: '🌙', title: 'NIGHT', time: '8:00 PM – 11:00 PM', bottles: 0.5, liters: '375 ml' }
  ];

  const totalWater = Object.values(waterBottles).reduce((sum, val) => sum + val, 0);
  const totalWaterMl = Math.round(totalWater * 750);
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🗓️ DAILY SCHEDULE</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasks Done</p>
                  <p className="text-2xl font-bold text-green-700">{completedTasks} / {tasks.length}</p>
                </div>
                <Check className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Water (750ml bottles)</p>
                  <p className="text-2xl font-bold text-blue-700">{totalWater.toFixed(1)} / 5.25</p>
                  <p className="text-xs text-gray-500">{totalWaterMl} ml / 4000 ml</p>
                </div>
                <Droplets className="text-blue-600" size={32} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 shadow-md">
          <h3 className="font-bold text-gray-800 mb-3">🔑 DAILY RULES</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text
