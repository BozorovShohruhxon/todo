import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Check, 
  Trash2, 
  Edit2, 
  X, 
  ListTodo, 
  CheckCircle2, 
  Circle, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // State for tasks loaded from localStorage if available
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('modern_todo_tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
      }
    }
    // Default initial tasks if none exist
    return [
      { id: '1', text: 'Design the new landing page UI', completed: false, createdAt: Date.now() - 3600000, priority: 'high' },
      { id: '2', text: 'Review pull requests for authentication module', completed: true, createdAt: Date.now() - 7200000, priority: 'medium' },
      { id: '3', text: 'Prepare notes for weekly team sync', completed: false, createdAt: Date.now() - 86400000, priority: 'low' }
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [toast, setToast] = useState(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('modern_todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Show a temporary toast message
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
      priority: priority
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
    showToast('Task added successfully!');
  };

  // Toggle task completion status
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete a specific task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    showToast('Task removed.');
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  // Save edited task
  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: editText.trim() } : task
    ));
    setEditingId(null);
    setEditText('');
    showToast('Task updated!');
  };

  // Clear all completed tasks
  const clearCompleted = () => {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) return;
    setTasks(tasks.filter(task => !task.completed));
    showToast(`Cleared ${completedCount} completed task(s).`);
  };

  // Filter tasks based on current filter state
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 md:p-10 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-600/90 text-white px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-2 border border-indigo-400/30 animate-bounce duration-300">
          <Sparkles className="w-5 h-5 text-indigo-200" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col z-10">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-300 bg-clip-text text-transparent">
                Taskify
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Organize your workflow, boost your daily productivity.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50 text-xs font-medium text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAddTask} className="p-6 sm:p-8 border-b border-slate-800/80 flex flex-col gap-4 bg-slate-900/20">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done today?..."
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl px-4 py-3.5 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all shadow-inner"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl px-3 py-3.5 text-xs font-medium text-slate-300 outline-none transition-all cursor-pointer"
              >
                <option value="low" className="bg-slate-900">Low Priority</option>
                <option value="medium" className="bg-slate-900">Medium</option>
                <option value="high" className="bg-slate-900">High Priority</option>
              </select>

              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-5 py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95 cursor-pointer flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </div>
        </form>

        {/* Filter & Counter Bar */}
        <div className="px-6 py-4 bg-slate-950/30 border-b border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Filters */}
          <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 w-full sm:w-auto justify-center">
            {['all', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 cursor-pointer ${
                  filter === tab
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Task Counter */}
          <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
            <span><strong className="text-indigo-400">{activeCount}</strong> active</span>
            <span>•</span>
            <span><strong className="text-purple-400">{completedCount}</strong> completed</span>
          </div>
        </div>

        {/* Task List */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto max-h-[420px] space-y-3 custom-scrollbar">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 border border-slate-800">
                <AlertCircle className="w-8 h-8" />
              </div>
              <p className="text-slate-400 font-medium text-sm">No tasks found in this view.</p>
              <p className="text-slate-600 text-xs max-w-xs">Add a new task above or switch filters to see your items.</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isEditing = editingId === task.id;

              return (
                <div
                  key={task.id}
                  className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                    task.completed
                      ? 'bg-slate-950/30 border-slate-800/40 opacity-75'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 shadow-lg shadow-black/20'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0 mr-3">
                    {/* Checkbox Toggle */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                        task.completed
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 border border-indigo-500'
                          : 'border-2 border-slate-700 hover:border-indigo-500 bg-slate-950/50 text-transparent'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 stroke-[3] transition-transform ${task.completed ? 'scale-100' : 'scale-0'}`} />
                    </button>

                    {/* Task Content or Edit Mode */}
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                          autoFocus
                          className="w-full bg-slate-950 border border-indigo-500 rounded-xl px-3 py-1.5 text-sm text-slate-100 outline-none"
                        />
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow transition-all cursor-pointer flex-shrink-0"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-xl transition-all cursor-pointer flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col min-w-0 flex-1">
                        <span
                          className={`text-sm font-medium transition-all truncate ${
                            task.completed
                              ? 'line-through text-slate-500'
                              : 'text-slate-200'
                          }`}
                        >
                          {task.text}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!isEditing && (
                    <div className="flex items-center space-x-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(task)}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Clear Completed */}
        {completedCount > 0 && (
          <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800/80 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {completedCount} completed task{completedCount > 1 ? 's' : ''} available to clear
            </span>
            <button
              onClick={clearCompleted}
              className="text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Clear Completed
            </button>
          </div>
        )}

      </div>
      
      {/* Sub-footer signature */}
      <footer className="mt-6 text-center text-xs text-slate-500">
        Built with React & Tailwind CSS • Data persisted locally
      </footer>

    </div>
  );
}