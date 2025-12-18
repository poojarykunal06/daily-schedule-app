// Daily Schedule App - Complete Standalone Version
const { useState, useEffect } = React;
const { Check, Droplets, Target, Plus, Trash2, Edit2, X } = lucide;

function DailyScheduleApp() {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [waterBottles, setWaterBottles] = useState({ morning: 0, afternoon: 0, evening: 0, night: 0 });

  const defaultSchedule = [
    // Morning (9 AM - 12 PM)
    { time: '9:00 – 9:20', task: 'Wake up, freshen up, light stretch', period: 'morning' },
    { time: '9:20 – 9:45', task: 'Breakfast / chill', period: 'morning' },
    { time: '9:45 – 10:45', task: 'SQL / Excel (alternate days)', period: 'morning' },
    { time: '10:45 – 11:00', task: 'Break (walk / music)', period: 'morning' },
    { time: '11:00 – 12:00', task: 'Power BI', period: 'morning' },
    
    // Afternoon (12 PM - 4 PM)
    { time: '12:00 – 12:15', task: 'Relax', period: 'afternoon' },
    { time: '1:00 – 1:30', task: 'Lunch', period: 'afternoon' },
    { time: '1:30 – 2:00', task: 'Stock Market Learning', period: 'afternoon' },
    { time: '2:00 – 4:00', task: 'Personal time / rest / errands', period: 'afternoon' },
    
    // Evening (4 PM - 8 PM)
    { time: '4:00 – 6:00', task: 'Python Study (Concepts + coding practice)', period: 'evening' },
    { time: '6:00 – 8:00', task: 'Python Deep Focus (Pandas, NumPy, EDA)', period: 'evening' },
    
    // Night (8 PM - 11 PM)
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

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

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

  return React.createElement('div', { 
    className: 'min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4' 
  },
    React.createElement('div', { className: 'max-w-4xl mx-auto space-y-6' },
      
      // Header Stats
      React.createElement('div', { className: 'bg-white rounded-2xl shadow-lg p-6' },
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-800 mb-4' }, '🗓️ DAILY SCHEDULE'),
        
        React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
          React.createElement('div', { className: 'bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', null,
                React.createElement('p', { className: 'text-sm text-gray-600' }, 'Tasks Done'),
                React.createElement('p', { className: 'text-2xl font-bold text-green-700' }, `${completedTasks} / ${tasks.length}`)
              ),
              React.createElement(Check, { className: 'text-green-600', size: 32 })
            )
          ),
          
          React.createElement('div', { className: 'bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', null,
                React.createElement('p', { className: 'text-sm text-gray-600' }, 'Water (750ml bottles)'),
                React.createElement('p', { className: 'text-2xl font-bold text-blue-700' }, `${totalWater.toFixed(1)} / 5.25`),
                React.createElement('p', { className: 'text-xs text-gray-500' }, `${totalWaterMl} ml / 4000 ml`)
              ),
              React.createElement(Droplets, { className: 'text-blue-600', size: 32 })
            )
          )
        )
      ),

      // Daily Rules
      React.createElement('div', { className: 'bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 shadow-md' },
        React.createElement('h3', { className: 'font-bold text-gray-800 mb-3' }, '🔑 DAILY RULES'),
        React.createElement('div', { className: 'grid grid-cols-2 gap-2 text-sm text-gray-700' },
          React.createElement('div', null, '• Min 3–4.5 hrs learning'),
          React.createElement('div', null, '• No zero days ❌'),
          React.createElement('div', null, '• Fun after effort'),
          React.createElement('div', null, '• Consistency > motivation')
        )
      ),

      // Schedule by Period
      ...periods.map(period => {
        const periodTasks = tasks.filter(t => t.period === period.id);
        const waterProgress = (waterBottles[period.id] / period.bottles) * 100;
        
        return React.createElement('div', { 
          key: period.id, 
          className: 'bg-white rounded-2xl shadow-lg p-6' 
        },
          React.createElement('div', { className: 'flex items-center justify-between mb-4' },
            React.createElement('div', null,
              React.createElement('h2', { className: 'text-xl font-bold text-gray-800' }, `${period.icon} ${period.title}`),
              React.createElement('p', { className: 'text-sm text-gray-500' }, period.time)
            ),
            React.createElement('div', { className: 'text-right' },
              React.createElement('p', { className: 'text-sm text-gray-600' }, 'Water Goal'),
              React.createElement('p', { className: 'font-semibold text-blue-700' }, `${period.bottles} bottles (${period.liters})`)
            )
          ),

          // Water Tracker
          React.createElement('div', { className: 'bg-blue-50 rounded-xl p-4 mb-4' },
            React.createElement('div', { className: 'flex items-center justify-between mb-2' },
              React.createElement('span', { className: 'text-sm font-medium text-gray-700' }, 'Water Progress'),
              React.createElement('span', { className: 'text-sm font-bold text-blue-700' }, 
                `${waterBottles[period.id].toFixed(1)} / ${period.bottles} bottles`
              )
            ),
            React.createElement('div', { className: 'bg-blue-200 rounded-full h-3 mb-3' },
              React.createElement('div', { 
                className: 'bg-blue-500 h-3 rounded-full transition-all',
                style: { width: `${waterProgress}%` }
              })
            ),
            React.createElement('div', { className: 'flex gap-2' },
              React.createElement('button', {
                onClick: () => addWater(period.id, 0.5),
                className: 'flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm'
              }, '+ ½ Bottle'),
              React.createElement('button', {
                onClick: () => addWater(period.id, 1),
                className: 'flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm'
              }, '+ 1 Bottle')
            )
          ),

          // Tasks
          React.createElement('div', { className: 'space-y-2' },
            ...periodTasks.map(task => 
              React.createElement('div', {
                key: task.id,
                className: `flex items-start gap-3 p-3 rounded-lg transition ${
                  task.completed ? 'bg-gray-50' : 'bg-indigo-50 hover:bg-indigo-100'
                }`
              },
                React.createElement('button', {
                  onClick: () => toggleTask(task.id),
                  className: `flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition ${
                    task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-green-400'
                  }`
                },
                  task.completed && React.createElement(Check, { size: 14, className: 'text-white' })
                ),
                
                React.createElement('div', { className: 'flex-1' },
                  editingId === task.id ? 
                    React.createElement('div', { className: 'flex gap-2' },
                      React.createElement('input', {
                        type: 'text',
                        value: editText,
                        onChange: (e) => setEditText(e.target.value),
                        onKeyPress: (e) => e.key === 'Enter' && saveEdit(),
                        className: 'flex-1 px-2 py-1 border border-indigo-300 rounded text-sm',
                        autoFocus: true
                      }),
                      React.createElement('button', {
                        onClick: saveEdit,
                        className: 'text-green-600 hover:text-green-700'
                      }, React.createElement(Check, { size: 18 })),
                      React.createElement('button', {
                        onClick: () => setEditingId(null),
                        className: 'text-red-600 hover:text-red-700'
                      }, React.createElement(X, { size: 18 }))
                    )
                  :
                    React.createElement('div', { className: 'flex items-start justify-between' },
                      React.createElement('div', null,
                        React.createElement('span', { 
                          className: `font-medium text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}` 
                        }, task.time),
                        React.createElement('p', { 
                          className: `text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-600'}` 
                        }, task.task)
                      ),
                      task.isCustom && React.createElement('div', { className: 'flex gap-1' },
                        React.createElement('button', {
                          onClick: () => startEdit(task.id, task.task),
                          className: 'text-indigo-600 hover:text-indigo-700 p-1'
                        }, React.createElement(Edit2, { size: 16 })),
                        React.createElement('button', {
                          onClick: () => deleteTask(task.id),
                          className: 'text-red-600 hover:text-red-700 p-1'
                        }, React.createElement(Trash2, { size: 16 }))
                      )
                    )
                )
              )
            ),
            
            React.createElement('button', {
              onClick: () => addCustomTask(period.id),
              className: 'w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition flex items-center justify-center gap-2 text-sm'
            },
              React.createElement(Plus, { size: 16 }),
              ' Add Task'
            )
          )
        );
      }),

      // Goals
      React.createElement('div', { className: 'bg-white rounded-2xl shadow-lg p-6' },
        React.createElement('h2', { className: 'text-xl font-bold text-gray-800 mb-4 flex items-center gap-2' },
          React.createElement(Target, { size: 24 }),
          ' 🎯 ACTIVE GOALS'
        ),
        React.createElement('div', { className: 'space-y-2' },
          ...goals.map(goal =>
            React.createElement('div', {
              key: goal.id,
              className: 'flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition'
            },
              React.createElement('button', {
                onClick: () => toggleGoal(goal.id),
                className: `flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  goal.completed ? 'bg-purple-500 border-purple-500' : 'border-gray-400 hover:border-purple-400'
                }`
              },
                goal.completed && React.createElement(Check, { size: 14, className: 'text-white' })
              ),
              React.createElement('span', { 
                className: `text-sm ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-700'}` 
              }, goal.text)
            )
          )
        )
      )
    )
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(DailyScheduleApp));