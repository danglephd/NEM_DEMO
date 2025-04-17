import { Task, Dependency } from '@wamra/gantt-task-react';

const STORAGE_KEY = 'gantt_tasks';

// Utility function to load tasks from localStorage
export const loadTasksFromStorage = (): Task[] => {
  const storedTasks = localStorage.getItem(STORAGE_KEY);
  if (!storedTasks) {
    // Save mockTasks to localStorage when no data exists
    saveTasksToStorage(mockTasks);
    return mockTasks;
  }
  
  try {
    const parsedTasks = JSON.parse(storedTasks);
    // Convert string dates back to Date objects and ensure assignees field exists
    return parsedTasks.map((task: any) => ({
      ...task,
      start: new Date(task.start),
      end: new Date(task.end),
      assignees: task.assignees || [] // Ensure assignees field exists
    }));
  } catch (error) {
    console.error('Error loading tasks from storage:', error);
    // If there's an error parsing, save mockTasks as fallback
    saveTasksToStorage(mockTasks);
    return mockTasks;
  }
};

// Utility function to save tasks to localStorage
export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    // Ensure assignees field exists before saving
    const tasksToSave = tasks.map(task => ({
      ...task,
      assignees: task.assignees || []
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
};

export interface Assignee {
    id: string;
    name: string;
    avatar?: string;
}

export const mockAssignees: Record<string, Assignee> = {
    'user1': { id: 'user1', name: 'John Doe', avatar: 'https://example.com/avatar1.jpg' },
    'user2': { id: 'user2', name: 'Jane Smith', avatar: 'https://example.com/avatar2.jpg' },
    'user3': { id: 'user3', name: 'Bob Johnson', avatar: 'https://example.com/avatar3.jpg' }
};

export const mockTasks: Task[] = [
  {
    start: new Date(2025, 3, 2), // 02-04-2025
    end: new Date(2025, 3, 17),  // +15 days
    name: 'Project planning',
    id: 'project_planning',
    type: 'project',
    progress: 15,
    isDisabled: false,
    styles: { barProgressColor: '#00BF96', barProgressSelectedColor: '#00BF96' }
  },
  {
    start: new Date(2025, 3, 2), // 02-04-2025
    end: new Date(2025, 3, 5),   // +3 days
    name: 'Marketing analysis',
    id: 'marketing_analysis',
    type: 'task',
    progress: 3,
    isDisabled: false,
    parent: 'project_planning',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 5), // 05-04-2025
    end: new Date(2025, 3, 7),   // +2 days
    name: 'Discussions',
    id: 'discussions',
    type: 'project',
    progress: 2,
    isDisabled: false,
    parent: 'project_planning',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 6), // 06-04-2025
    end: new Date(2025, 3, 9),   // +3 days
    name: 'Initial design',
    id: 'initial_design',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'discussions',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 9), // 09-04-2025
    end: new Date(2025, 3, 9),   // 0 days
    name: 'Presentation',
    id: 'presentation',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'discussions',
    dependencies: [{    sourceId: 'initial_design',
      sourceTarget: 'endOfTask',
      ownTarget: 'startOfTask'
    }],
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 7), // 07-04-2025
    end: new Date(2025, 3, 12),  // +5 days
    name: 'Prototyping',
    id: 'prototyping',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'discussions',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 8), // 08-04-2025
    end: new Date(2025, 3, 17),  // +9 days
    name: 'User testing',
    id: 'user_testing',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'discussions',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 8), // 08-04-2025
    end: new Date(2025, 3, 8),   // 0 days
    name: 'Approval of strategy',
    id: 'approval',
    type: 'milestone',
    progress: 0,
    isDisabled: false,
    parent: 'project_planning',
    dependencies: [{    sourceId: 'discussions',
      sourceTarget: 'endOfTask',
      ownTarget: 'startOfTask'
    }],
    styles: { barProgressColor: '#9C27B0', barProgressSelectedColor: '#9C27B0' }
  },
  {
    start: new Date(2025, 3, 2), // 02-04-2025
    end: new Date(2025, 3, 12),  // +10 days
    name: 'Project management',
    id: 'project_management',
    type: 'project',
    progress: 10,
    isDisabled: false,
    styles: { barProgressColor: '#00BF96', barProgressSelectedColor: '#00BF96' }
  },
  {
    start: new Date(2025, 3, 2), // 02-04-2025
    end: new Date(2025, 3, 6),   // +4 days
    name: 'Resource planning',
    id: 'resource_planning',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'project_management',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 6), // 06-04-2025
    end: new Date(2025, 3, 8),   // +2 days
    name: 'Getting approval',
    id: 'getting_approval',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'project_management',
    dependencies: [{    sourceId: 'resource_planning',
      sourceTarget: 'endOfTask',
      ownTarget: 'startOfTask'
    }],
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 8), // 08-04-2025
    end: new Date(2025, 3, 10),  // +2 days
    name: 'Team introduction',
    id: 'team_introduction',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'project_management',
    dependencies: [{    sourceId: 'getting_approval',
      sourceTarget: 'endOfTask',
      ownTarget: 'startOfTask'
    }],
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 10), // 10-04-2025
    end: new Date(2025, 3, 12),   // +2 days
    name: 'Resource management',
    id: 'resource_management',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'project_management',
    dependencies: [{    sourceId: 'team_introduction',
      sourceTarget: 'endOfTask',
      ownTarget: 'startOfTask'
    }],
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 9), // 09-04-2025
    end: new Date(2025, 4, 15),  // +36 days
    name: 'Development',
    id: 'development',
    type: 'project',
    progress: 0,
    isDisabled: false,
    styles: { barProgressColor: '#00BF96', barProgressSelectedColor: '#00BF96' }
  },
  {
    start: new Date(2025, 3, 9), // 09-04-2025
    end: new Date(2025, 3, 15),  // +6 days
    name: 'Prototyping',
    id: 'dev_prototyping',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'development',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 15), // 15-04-2025
    end: new Date(2025, 3, 30),   // +15 days
    name: 'Basic functionality',
    id: 'basic_functionality',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'development',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 30), // 30-04-2025
    end: new Date(2025, 4, 15),   // +15 days
    name: 'Finalizing MVA',
    id: 'finalizing_mva',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'development',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 9), // 09-04-2025
    end: new Date(2025, 4, 25),  // +46 days
    name: 'Testing',
    id: 'testing',
    type: 'project',
    progress: 0,
    isDisabled: false,
    styles: { barProgressColor: '#00BF96', barProgressSelectedColor: '#00BF96' }
  },
  {
    start: new Date(2025, 3, 9), // 09-04-2025
    end: new Date(2025, 3, 15),  // +6 days
    name: 'Testing prototype',
    id: 'testing_prototype',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'testing',
    dependencies: [{
      sourceId: 'dev_prototyping',
      sourceTarget: 'endOfTask',
      ownTarget: 'startOfTask'
    }],
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 15), // 15-04-2025
    end: new Date(2025, 3, 30),   // +15 days
    name: 'Testing basic functionality',
    id: 'testing_basic_functionality',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'testing',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 3, 30), // 30-04-2025
    end: new Date(2025, 4, 15),   // +15 days
    name: 'Testing MVA',
    id: 'testing_mva',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'testing',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 4, 15), // 15-05-2025
    end: new Date(2025, 4, 25),   // +10 days
    name: 'Beta testing',
    id: 'beta_testing',
    type: 'task',
    progress: 0,
    isDisabled: false,
    parent: 'testing',
    styles: { barProgressColor: '#2196F3', barProgressSelectedColor: '#2196F3' }
  },
  {
    start: new Date(2025, 4, 25), // 25-05-2025
    end: new Date(2025, 4, 25),   // 0 days (milestone)
    name: 'Release 1.0.0',
    id: 'release',
    type: 'milestone',
    progress: 0,
    isDisabled: false,
    dependencies: [{
      sourceId: 'testing_mva',
      sourceTarget: 'endOfTask',
      ownTarget: 'startOfTask'
    }],
    styles: { barProgressColor: '#9C27B0', barProgressSelectedColor: '#9C27B0' }
  }
];
