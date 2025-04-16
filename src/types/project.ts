export interface Project {
  id: string;
  name: string;
  progress: {
    preparation: number;
    development: number;
    materials: number;
    construction: number;
    testing: number;
    approval: number;
    warranty: number;
  };
  startDate: string;
  endDate: string;
  duration: number;
  status: 'active' | 'completed' | 'pending';
}

export interface ProjectSummary {
  totalProjects: number;
  totalRevenue: number;
  completedQuantity: number;
  claims: number;
  completionRate: number;
}

export interface ProjectStatus {
  active: number;
  completed: number;
} 