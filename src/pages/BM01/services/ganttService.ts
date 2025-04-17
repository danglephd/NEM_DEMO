import { Task, TaskOrEmpty } from '@wamra/gantt-task-react';
import { loadTasksFromStorage, saveTasksToStorage } from '../mock/ganttData';

interface NewTaskForm {
    name: string;
    start: string;
    end: string;
    type: 'task' | 'project' | 'milestone';
    parent?: string;
    assignees?: string[];
}

// Helper function to calculate parent task progress
const calculateParentProgress = (tasks: Task[], parentId: string): number => {
    // Filter out milestones and get only direct child tasks
    const childTasks = tasks.filter(t => t.parent === parentId && t.type !== 'milestone');
    if (childTasks.length === 0) return 0;

    const totalProgress = childTasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / childTasks.length);
};

// Helper function to update all ancestor tasks' progress
const updateAncestorsProgress = (tasks: Task[], taskId: string): Task[] => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.parent) return tasks;

    const updatedTasks = [...tasks];
    let currentParentId: string | undefined = task.parent;

    while (currentParentId) {
        const parentIndex = updatedTasks.findIndex(t => t.id === currentParentId);
        if (parentIndex === -1) break;

        const newProgress = calculateParentProgress(updatedTasks, currentParentId);
        updatedTasks[parentIndex] = {
            ...updatedTasks[parentIndex],
            progress: newProgress
        };

        currentParentId = updatedTasks[parentIndex].parent;
    }

    return updatedTasks;
};

export const updateTaskProgress = (tasks: Task[], task: Task): Task[] => {
    // Don't update progress for milestones
    if (task.type === 'milestone') {
        return tasks;
    }

    // First update the task's progress
    let updatedTasks = tasks.map((t) => {
        if (t.id === task.id) {
            return {
                ...t,
                progress: task.progress
            };
        }
        return t;
    });

    // Then update all ancestor tasks' progress
    updatedTasks = updateAncestorsProgress(updatedTasks, task.id);
    
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

export const deleteTask = (tasks: Task[], taskId: string): Task[] => {
    // First, remove all dependencies that reference this task
    const tasksWithoutDependencies = tasks.map(task => {
        if (task.dependencies) {
            return {
                ...task,
                dependencies: task.dependencies.filter(d => d.sourceId !== taskId)
            };
        }
        return task;
    });

    // Then remove the task itself and its subtasks
    const updatedTasks = tasksWithoutDependencies.filter(task => {
        // Remove the task and any tasks that have it as a parent
        const isNotTarget = task.id !== taskId;
        const isNotChild = task.parent !== taskId;
        return isNotTarget && isNotChild;
    });
    
    // Save to localStorage
    saveTasksToStorage(updatedTasks);
    return updatedTasks;
};

export const addNewTask = (tasks: Task[], newTask: Omit<Task, 'id'>): Task[] => {
    // Generate a unique ID for the new task
    const taskId = `task_${Date.now()}`;
    
    const taskToAdd: Task = {
        ...newTask,
        id: taskId,
        // Ensure required properties have default values if not provided
        type: newTask.type || 'task',
        progress: newTask.progress || 0,
        isDisabled: newTask.isDisabled || false,
        styles: newTask.styles || { 
            barProgressColor: '#2196F3',
            barProgressSelectedColor: '#2196F3'
        },
        assignees: newTask.assignees || [] // Ensure assignees field exists
    };

    const updatedTasks = [...tasks, taskToAdd];
    
    // Save to localStorage
    saveTasksToStorage(updatedTasks);
    return updatedTasks;
};

export const updateTask = (tasks: Task[], taskId: string, updates: Partial<Task>): Task[] => {
    const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
            return {
                ...task,
                ...updates,
                assignees: updates.assignees || task.assignees || [] // Ensure assignees field exists
            };
        }
        return task;
    });
    
    // Save to localStorage
    saveTasksToStorage(updatedTasks);
    return updatedTasks;
};

export const handleSubmitNewTask = (
    tasks: Task[],
    newTaskForm: NewTaskForm,
    isEditing: boolean,
    selectedTask: Task | null
): { updatedTasks: Task[]; success: boolean; message?: string } => {
    const { name, start, end, type, parent, assignees } = newTaskForm;
    
    if (!name || !start || !end) {
        return {
            updatedTasks: tasks,
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin task!'
        };
    }

    try {
        if (isEditing && selectedTask) {
            const updates: Partial<Task> = {
                name,
                start: new Date(start),
                end: new Date(end),
                assignees: assignees || [] // Ensure assignees field exists
            };

            const updatedTasks = updateTask(tasks, selectedTask.id, updates);
            return {
                updatedTasks,
                success: true
            };
        } else {
            const newTask: Omit<Task, 'id'> = {
                name,
                start: new Date(start),
                end: new Date(end),
                type,
                progress: 0,
                isDisabled: false,
                parent,
                assignees: assignees || [], // Ensure assignees field exists
                styles: {
                    barProgressColor: '#2196F3',
                    barProgressSelectedColor: '#2196F3'
                }
            };

            const updatedTasks = addNewTask(tasks, newTask);
            return {
                updatedTasks,
                success: true
            };
        }
    } catch (error) {
        return {
            updatedTasks: tasks,
            success: false,
            message: 'Có lỗi xảy ra khi thêm/cập nhật task!'
        };
    }
}; 