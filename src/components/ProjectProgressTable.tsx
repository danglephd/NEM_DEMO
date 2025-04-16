import React from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CProgress,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react';
import { Project } from '../types/project';

interface ProjectProgressTableProps {
  projects: Project[];
}

const ProjectProgressTable: React.FC<ProjectProgressTableProps> = ({ projects }) => {
  return (
    <CCard>
      <div className="card-header bg-transparent">
        <strong>Project Progress</strong>
      </div>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Project</CTableHeaderCell>
              <CTableHeaderCell>Preparation</CTableHeaderCell>
              <CTableHeaderCell>Development</CTableHeaderCell>
              <CTableHeaderCell>Materials</CTableHeaderCell>
              <CTableHeaderCell>Construction</CTableHeaderCell>
              <CTableHeaderCell>Testing</CTableHeaderCell>
              <CTableHeaderCell>Approval</CTableHeaderCell>
              <CTableHeaderCell>Warranty</CTableHeaderCell>
              <CTableHeaderCell>Duration</CTableHeaderCell>
              <CTableHeaderCell>Start Date</CTableHeaderCell>
              <CTableHeaderCell>End Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {projects.map((project) => (
              <CTableRow key={project.id}>
                <CTableDataCell>{project.name}</CTableDataCell>
                <CTableDataCell>
                  <CProgress value={project.progress.preparation} />
                  {project.progress.preparation}%
                </CTableDataCell>
                <CTableDataCell>
                  <CProgress value={project.progress.development} />
                  {project.progress.development}%
                </CTableDataCell>
                <CTableDataCell>
                  <CProgress value={project.progress.materials} />
                  {project.progress.materials}%
                </CTableDataCell>
                <CTableDataCell>
                  <CProgress value={project.progress.construction} />
                  {project.progress.construction}%
                </CTableDataCell>
                <CTableDataCell>
                  <CProgress value={project.progress.testing} />
                  {project.progress.testing}%
                </CTableDataCell>
                <CTableDataCell>
                  <CProgress value={project.progress.approval} />
                  {project.progress.approval}%
                </CTableDataCell>
                <CTableDataCell>
                  <CProgress value={project.progress.warranty} />
                  {project.progress.warranty}%
                </CTableDataCell>
                <CTableDataCell>{project.duration} DAYS</CTableDataCell>
                <CTableDataCell>{project.startDate}</CTableDataCell>
                <CTableDataCell>{project.endDate}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default ProjectProgressTable; 