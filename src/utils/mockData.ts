import { Project, ProjectSummary, ProjectStatus } from '../types/project';

export const mockProjects: Project[] = [
  {
    id: 'BG',
    name: 'BG',
    progress: {
      preparation: 90,
      development: 80,
      materials: 90,
      construction: 85,
      testing: 85,
      approval: 0,
      warranty: 0
    },
    startDate: '2/1/2024',
    endDate: '3/22/2024',
    duration: 50,
    status: 'active'
  },
  {
    id: 'CELADON',
    name: 'CELADON',
    progress: {
      preparation: 90,
      development: 20,
      materials: 15,
      construction: 2,
      testing: 0,
      approval: 0,
      warranty: 0
    },
    startDate: '3/12/2024',
    endDate: '5/1/2024',
    duration: 50,
    status: 'active'
  },
  {
    id: 'PARK-HYATT',
    name: 'PARK HYATT',
    progress: {
      preparation: 80,
      development: 35,
      materials: 20,
      construction: 15,
      testing: 2,
      approval: 0,
      warranty: 0
    },
    startDate: '3/22/2024',
    endDate: '10/8/2024',
    duration: 200,
    status: 'active'
  },
  {
    id: 'LAO-CAI',
    name: 'LAO CAI',
    progress: {
      preparation: 70,
      development: 10,
      materials: 7,
      construction: 5,
      testing: 0,
      approval: 0,
      warranty: 0
    },
    startDate: '4/5/2024',
    endDate: '7/14/2024',
    duration: 100,
    status: 'pending'
  },
  {
    id: 'DOJI',
    name: 'DOJI',
    progress: {
      preparation: 66,
      development: 10,
      materials: 5,
      construction: 8,
      testing: 0,
      approval: 0,
      warranty: 0
    },
    startDate: '4/20/2024',
    endDate: '2/14/2025',
    duration: 300,
    status: 'pending'
  }
];

export const mockProjectSummary: ProjectSummary = {
  totalProjects: 20,
  totalRevenue: 900,
  completedQuantity: 612,
  claims: 269,
  completionRate: 75
};

export const mockProjectStatus: ProjectStatus = {
  active: 1,
  completed: 1
};

// Function to save data to localStorage
export const saveDataToLocalStorage = () => {
  localStorage.setItem('projects', JSON.stringify(mockProjects));
  localStorage.setItem('projectSummary', JSON.stringify(mockProjectSummary));
  localStorage.setItem('projectStatus', JSON.stringify(mockProjectStatus));
};

// Function to get data from localStorage
export const getDataFromLocalStorage = () => {
  const projects = JSON.parse(localStorage.getItem('projects') || JSON.stringify(mockProjects));
  const summary = JSON.parse(localStorage.getItem('projectSummary') || JSON.stringify(mockProjectSummary));
  const status = JSON.parse(localStorage.getItem('projectStatus') || JSON.stringify(mockProjectStatus));
  
  return { projects, summary, status };
}; 