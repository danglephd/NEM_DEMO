import React, { useState } from 'react';
import { Gantt, ViewMode, Task, OnDateChange, TaskOrEmpty } from '@wamra/gantt-task-react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { initializeTasks, updateTaskProgress, updateTaskDates } from '../../services/ganttService';
import '@wamra/gantt-task-react/dist/style.css';

const BM01: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initializeTasks());

    const onProgressChange = (task: Task) => {
        const updatedTasks = updateTaskProgress(tasks, task);
        setTasks(updatedTasks);
    };

    const onDateChange: OnDateChange = (task: TaskOrEmpty) => {
        const updatedTasks = updateTaskDates(tasks, task);
        setTasks(updatedTasks);
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>BM01 - Gantt Chart</strong>
                    </CCardHeader>
                    <CCardBody>
                        <div style={{ height: '600px', width: '100%' }}>
                            <Gantt
                                tasks={tasks}
                                viewMode={ViewMode.Day}
                                onDateChange={onDateChange}
                                onProgressChange={onProgressChange}
                                onDelete={() => {}}
                                onDoubleClick={() => {}}
                            />
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default BM01; 