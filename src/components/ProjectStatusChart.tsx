import React from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { CCard, CCardBody } from '@coreui/react';
import { CChart } from '@coreui/react-chartjs';
import { ProjectStatus } from '../types/project';

interface ProjectStatusChartProps {
  status: ProjectStatus;
}

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ status }) => {
  return (
    <CCard className="mb-4">
      <div className="card-header bg-transparent">Project Status</div>
      <CCardBody>
        <CChart
          type="bar"
          data={{
            labels: ['Project Status'],
            datasets: [
              {
                label: 'Active',
                backgroundColor: '#2eb85c',
                data: [status.active],
              },
              {
                label: 'Completed',
                backgroundColor: '#3399ff',
                data: [status.completed],
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            maintainAspectRatio: false,
          }}
          style={{ height: '300px' }}
        />
      </CCardBody>
    </CCard>
  );
};

export default ProjectStatusChart; 