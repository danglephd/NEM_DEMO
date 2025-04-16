import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react';
import { ProjectSummary } from '../types/project';

interface StatisticCardsProps {
  summary: ProjectSummary;
}

const StatisticCards: React.FC<StatisticCardsProps> = ({ summary }) => {
  return (
    <CRow>
      <CCol sm={6} lg>
        <CCard className="mb-4">
          <CCardBody>
            <div className="fs-4 fw-semibold">{summary.totalProjects}</div>
            <div>Total Projects</div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm={6} lg>
        <CCard className="mb-4">
          <CCardBody>
            <div className="fs-4 fw-semibold">{summary.totalRevenue}</div>
            <div>Revenue (tỷ)</div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm={6} lg>
        <CCard className="mb-4">
          <CCardBody>
            <div className="fs-4 fw-semibold">{summary.completedQuantity}</div>
            <div>Completed Quantity (tỷ)</div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm={6} lg>
        <CCard className="mb-4">
          <CCardBody>
            <div className="fs-4 fw-semibold">{summary.claims}</div>
            <div>Claims (tỷ)</div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm={6} lg>
        <CCard className="mb-4">
          <CCardBody>
            <div className="fs-4 fw-semibold">{summary.completionRate}%</div>
            <div>Completion Rate</div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default StatisticCards; 