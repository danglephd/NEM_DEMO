import { Task, TaskOrEmpty } from '@wamra/gantt-task-react';
import { loadTasksFromStorage, saveTasksToStorage } from '../mock/ganttData';

export const updateTaskProgress = (tasks: Task[], task: Task): Task[] => {
    const updatedTasks = tasks.map((t) => {
        if (t.id === task.id) {
            return {
                ...t,
                progress: task.progress
            };
        }
        return t;
    });
    
    // Save to localStorage
    saveTasksToStorage(updatedTasks);
    return updatedTasks;
};

export const updateTaskDates = (tasks: Task[], task: TaskOrEmpty): Task[] => {
    // Type guard to check if task is a full Task
    if ('id' in task && 'start' in task && 'end' in task) {
        const fullTask = task as Task;
        const updatedTasks = tasks.map((t) => {
            if (t.id === fullTask.id) {
                return {
                    ...t,
                    start: fullTask.start,
                    end: fullTask.end
                };
            }
            return t;
        });
        
        // Save to localStorage
        saveTasksToStorage(updatedTasks);
        return updatedTasks;
    }
    
    return tasks; // Return original tasks if no update was made
};

// Helper function to initialize tasks
export const initializeTasks = (): Task[] => {
    return loadTasksFromStorage();
}; 