// Daily Schedule App - Fixed Version
const { useState, useEffect } = React;

function DailyScheduleApp() {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [waterBottles, setWaterBottles] = useState({ morning: 0, afternoon: 0, evening: 0, night: 0 });

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
      console.error('Error loading data:', error);
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
    const newVal
