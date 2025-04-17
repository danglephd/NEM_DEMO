import { Task, Dependency } from '@wamra/gantt-task-react';

const STORAGE_KEY = 'gantt_tasks';

// Utility function to load tasks from localStorage
export const loadTasksFromStorage = (): Task[] => {
  const storedTasks = localStorage.getItem(STORAGE_KEY);
  if (!storedTasks) {
    // Save mockTasks to localStorage when no data exists
    saveTasksToStorage(mockTasks);
    // Filter to only return project tasks without parents
    return mockTasks.filter((task: Task) => task.type === 'project' && !task.parent);
  }
  
  try {
    const parsedTasks = JSON.parse(storedTasks);
    // Convert string dates back to Date objects and ensure assignees field exists
    const tasks = parsedTasks.map((task: Task) => ({
      ...task,
      start: new Date(task.start),
      end: new Date(task.end),
      assignees: task.assignees || [] // Ensure assignees field exists
    }));
    
    // Filter to only return project tasks without parents
    return tasks.filter((task: Task) => task.type === 'project' && !task.parent);
  } catch (error) {
    console.error('Error loading tasks from storage:', error);
    // If there's an error parsing, save mockTasks as fallback
    saveTasksToStorage(mockTasks);
    // Filter to only return project tasks without parents
    return mockTasks.filter((task: Task) => task.type === 'project' && !task.parent);
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
    avatar: string;
    role: string;
    department: string;
    color: string;
}

export const mockAssignees: Record<string, Assignee> = {
    'user1': {
        id: 'user1',
        name: 'John Smith',
        avatar: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#4CAF50"/>
                <text x="50%" y="50%" dy=".1em" fill="white" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">JS</text>
            </svg>
        `)}`,
        role: 'Project Manager',
        department: 'Management',
        color: '#4CAF50'
    },
    'user2': {
        id: 'user2',
        name: 'Emma Davis',
        avatar: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#2196F3"/>
                <text x="50%" y="50%" dy=".1em" fill="white" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">ED</text>
            </svg>
        `)}`,
        role: 'Lead Developer',
        department: 'Development',
        color: '#2196F3'
    },
    'user3': {
        id: 'user3',
        name: 'Michael Chen',
        avatar: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#9C27B0"/>
                <text x="50%" y="50%" dy=".1em" fill="white" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">MC</text>
            </svg>
        `)}`,
        role: 'Senior Developer',
        department: 'Development',
        color: '#9C27B0'
    },
    'user4': {
        id: 'user4',
        name: 'Sarah Wilson',
        avatar: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#FF5722"/>
                <text x="50%" y="50%" dy=".1em" fill="white" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">SW</text>
            </svg>
        `)}`,
        role: 'UI/UX Designer',
        department: 'Design',
        color: '#FF5722'
    },
    'user5': {
        id: 'user5',
        name: 'David Brown',
        avatar: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#795548"/>
                <text x="50%" y="50%" dy=".1em" fill="white" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">DB</text>
            </svg>
        `)}`,
        role: 'QA Engineer',
        department: 'Quality Assurance',
        color: '#795548'
    },
    'user6': {
        id: 'user6',
        name: 'Lisa Anderson',
        avatar: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#009688"/>
                <text x="50%" y="50%" dy=".1em" fill="white" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">LA</text>
            </svg>
        `)}`,
        role: 'Business Analyst',
        department: 'Business',
        color: '#009688'
    },
    'user7': {
        id: 'user7',
        name: 'James Taylor',
        avatar: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#FF9800"/>
                <text x="50%" y="50%" dy=".1em" fill="white" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">JT</text>
            </svg>
        `)}`,
        role: 'DevOps Engineer',
        department: 'Operations',
        color: '#FF9800'
    },
    'user8': {
        id: 'user8',
        name: 'Maria Garcia',
        avatar: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#E91E63"/>
                <text x="50%" y="50%" dy=".1em" fill="white" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">MG</text>
            </svg>
        `)}`,
        role: 'Frontend Developer',
        department: 'Development',
        color: '#E91E63'
    },
    'user9': {
        id: 'user9',
        name: 'Robert Lee',
        avatar: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#673AB7"/>
                <text x="50%" y="50%" dy=".1em" fill="white" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">RL</text>
            </svg>
        `)}`,
        role: 'Backend Developer',
        department: 'Development',
        color: '#673AB7'
    },
    'user10': {
        id: 'user10',
        name: 'Emily White',
        avatar: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#3F51B5"/>
                <text x="50%" y="50%" dy=".1em" fill="white" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">EW</text>
            </svg>
        `)}`,
        role: 'System Architect',
        department: 'Architecture',
        color: '#3F51B5'
    }
};

export const mockTasks: Task[] = [
  {
    start: new Date(2025, 3, 2), // 2025-04-02
    end: new Date(2025, 3, 17),  // 2025-04-17
    name: "Project planning",
    id: "project_planning",
    type: "project",
    progress: 100,
    isDisabled: false,
    styles: {
      barProgressColor: "#00BF96",
      barProgressSelectedColor: "#00BF96"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 2), // 2025-04-02
    end: new Date(2025, 3, 7),   // 2025-04-07
    name: "Marketing analysis",
    id: "marketing_analysis",
    type: "task",
    progress: 99,
    isDisabled: false,
    parent: "project_planning",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: ["user1", "user2"]
  },
  {
    start: new Date(2025, 3, 4), // 2025-04-04
    end: new Date(2025, 3, 15),  // 2025-04-15
    name: "Discussions",
    id: "discussions",
    type: "project",
    progress: 100,
    isDisabled: false,
    parent: "project_planning",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: ["user2"],
    dependencies: [{
      sourceId: "marketing_analysis",
      sourceTarget: "endOfTask",
      ownTarget: "startOfTask"
    }]
  },
  {
    start: new Date(2025, 3, 4), // 2025-04-04
    end: new Date(2025, 3, 8),   // 2025-04-08
    name: "Initial design",
    id: "initial_design",
    type: "task",
    progress: 100,
    isDisabled: false,
    parent: "discussions",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 9), // 2025-04-09
    end: new Date(2025, 3, 9),   // 2025-04-09
    name: "Presentation",
    id: "presentation",
    type: "task",
    progress: 100,
    isDisabled: false,
    parent: "discussions",
    dependencies: [{
      sourceId: "initial_design",
      sourceTarget: "endOfTask",
      ownTarget: "startOfTask"
    }],
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 7), // 2025-04-07
    end: new Date(2025, 3, 12),  // 2025-04-12
    name: "Prototyping",
    id: "prototyping",
    type: "task",
    progress: 100,
    isDisabled: false,
    parent: "discussions",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 8), // 2025-04-08
    end: new Date(2025, 3, 17),  // 2025-04-17
    name: "User testing",
    id: "user_testing",
    type: "task",
    progress: 100,
    isDisabled: false,
    parent: "discussions",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 17), // 2025-04-17
    end: new Date(2025, 3, 17),   // 2025-04-17
    name: "Approval of strategy",
    id: "approval",
    type: "milestone",
    progress: 0,
    isDisabled: false,
    parent: "project_planning",
    dependencies: [{
      sourceId: "discussions",
      sourceTarget: "endOfTask",
      ownTarget: "startOfTask"
    }],
    styles: {
      barProgressColor: "#9C27B0",
      barProgressSelectedColor: "#9C27B0"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 2), // 2025-04-02
    end: new Date(2025, 3, 12),  // 2025-04-12
    name: "Project management",
    id: "project_management",
    type: "project",
    progress: 10,
    isDisabled: false,
    styles: {
      barProgressColor: "#00BF96",
      barProgressSelectedColor: "#00BF96"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 2), // 2025-04-02
    end: new Date(2025, 3, 6),   // 2025-04-06
    name: "Resource planning",
    id: "resource_planning",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "project_management",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 6), // 2025-04-06
    end: new Date(2025, 3, 8),   // 2025-04-08
    name: "Getting approval",
    id: "getting_approval",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "project_management",
    dependencies: [{
      sourceId: "resource_planning",
      sourceTarget: "endOfTask",
      ownTarget: "startOfTask"
    }],
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 8), // 2025-04-08
    end: new Date(2025, 3, 10),  // 2025-04-10
    name: "Team introduction",
    id: "team_introduction",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "project_management",
    dependencies: [{
      sourceId: "getting_approval",
      sourceTarget: "endOfTask",
      ownTarget: "startOfTask"
    }],
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 10), // 2025-04-10
    end: new Date(2025, 3, 12),   // 2025-04-12
    name: "Resource management",
    id: "resource_management",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "project_management",
    dependencies: [{
      sourceId: "team_introduction",
      sourceTarget: "endOfTask",
      ownTarget: "startOfTask"
    }],
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 9), // 2025-04-09
    end: new Date(2025, 4, 15),  // 2025-05-15
    name: "Development",
    id: "development",
    type: "project",
    progress: 0,
    isDisabled: false,
    styles: {
      barProgressColor: "#00BF96",
      barProgressSelectedColor: "#00BF96"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 9), // 2025-04-09
    end: new Date(2025, 3, 15),  // 2025-04-15
    name: "Prototyping",
    id: "dev_prototyping",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "development",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 15), // 2025-04-15
    end: new Date(2025, 3, 30),   // 2025-04-30
    name: "Basic functionality",
    id: "basic_functionality",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "development",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 30), // 2025-04-30
    end: new Date(2025, 4, 15),   // 2025-05-15
    name: "Finalizing MVA",
    id: "finalizing_mva",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "development",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 9), // 2025-04-09
    end: new Date(2025, 4, 25),  // 2025-05-25
    name: "Testing",
    id: "testing",
    type: "project",
    progress: 0,
    isDisabled: false,
    styles: {
      barProgressColor: "#00BF96",
      barProgressSelectedColor: "#00BF96"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 9), // 2025-04-09
    end: new Date(2025, 3, 15),  // 2025-04-15
    name: "Testing prototype",
    id: "testing_prototype",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "testing",
    dependencies: [{
      sourceId: "dev_prototyping",
      sourceTarget: "endOfTask",
      ownTarget: "startOfTask"
    }],
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 15), // 2025-04-15
    end: new Date(2025, 3, 30),   // 2025-04-30
    name: "Testing basic functionality",
    id: "testing_basic_functionality",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "testing",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 3, 30), // 2025-04-30
    end: new Date(2025, 4, 15),   // 2025-05-15
    name: "Testing MVA",
    id: "testing_mva",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "testing",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 4, 15), // 2025-05-15
    end: new Date(2025, 4, 25),   // 2025-05-25
    name: "Beta testing",
    id: "beta_testing",
    type: "task",
    progress: 0,
    isDisabled: false,
    parent: "testing",
    styles: {
      barProgressColor: "#2196F3",
      barProgressSelectedColor: "#2196F3"
    },
    assignees: []
  },
  {
    start: new Date(2025, 4, 25), // 2025-05-25
    end: new Date(2025, 4, 25),   // 2025-05-25
    name: "Release 1.0.0",
    id: "release",
    type: "milestone",
    progress: 0,
    isDisabled: false,
    dependencies: [{
      sourceId: "testing_mva",
      sourceTarget: "endOfTask",
      ownTarget: "startOfTask"
    }],
    styles: {
      barProgressColor: "#9C27B0",
      barProgressSelectedColor: "#9C27B0"
    },
    assignees: []
  }
];