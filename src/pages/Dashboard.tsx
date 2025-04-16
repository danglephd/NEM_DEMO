import React, { useEffect } from 'react';
import { CContainer } from '@coreui/react';
import StatisticCards from '../components/StatisticCards';
import ProjectProgressTable from '../components/ProjectProgressTable';
import ProjectStatusChart from '../components/ProjectStatusChart';
import { getDataFromLocalStorage, saveDataToLocalStorage } from '../utils/mockData';

const Dashboard: React.FC = () => {
  const [data, setData] = React.useState(getDataFromLocalStorage());

  useEffect(() => {
    // Initialize localStorage with mock data if empty
    if (!localStorage.getItem('projects')) {
      saveDataToLocalStorage();
      setData(getDataFromLocalStorage());
    }
  }, []);

  return (
    <CContainer>
      <h1>TỔNG QUAN DỰ ÁN</h1>
      <StatisticCards summary={data.summary} />
      <ProjectStatusChart status={data.status} />
      <ProjectProgressTable projects={data.projects} />
    </CContainer>
  );
};

export default Dashboard; 