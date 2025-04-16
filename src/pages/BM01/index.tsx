import React, { useState } from 'react';
import { Gantt, ViewMode, Task, OnDateChange, TaskOrEmpty, Dependency } from '@wamra/gantt-task-react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormSelect } from '@coreui/react';
import { initializeTasks, updateTaskProgress, updateTaskDates } from '../../services/ganttService';
import { addDependency, removeDependency, updateDependency, isValidDependency } from '../../services/dependencyService';
import '@wamra/gantt-task-react/dist/style.css';

type OnArrowDoubleClick = (taskFromIndex: number, taskToIndex: number) => void;

const BM01: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initializeTasks());
    const [showDependencyModal, setShowDependencyModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedSourceTask, setSelectedSourceTask] = useState<string>('');
    const [dependencyType, setDependencyType] = useState<'startToStart' | 'startToEnd' | 'endToStart' | 'endToEnd'>('endToStart');

    const onProgressChange = (task: Task) => {
        const updatedTasks = updateTaskProgress(tasks, task);
        setTasks(updatedTasks);
    };

    const onDateChange: OnDateChange = (task: TaskOrEmpty) => {
        const updatedTasks = updateTaskDates(tasks, task);
        setTasks(updatedTasks);
    };

    const handleAddDependency = () => {
        if (selectedTask && selectedSourceTask) {
            if (isValidDependency(tasks, selectedTask.id, selectedSourceTask)) {
                const newDependency: Dependency = {
                    sourceId: selectedSourceTask,
                    sourceTarget: dependencyType.includes('end') ? 'endOfTask' : 'startOfTask',
                    ownTarget: dependencyType.includes('Start') ? 'startOfTask' : 'endOfTask'
                };

                const updatedTasks = addDependency(tasks, selectedTask.id, newDependency);
                setTasks(updatedTasks);
                setShowDependencyModal(false);
            } else {
                alert('Invalid dependency! Cannot create circular dependencies or self-dependencies.');
            }
        }
    };

    const handleRemoveDependency = (taskId: string, sourceId: string) => {
        const updatedTasks = removeDependency(tasks, taskId, sourceId);
        setTasks(updatedTasks);
    };

    const handleUpdateDependency = (taskId: string, oldSourceId: string, newDependency: Dependency) => {
        const updatedTasks = updateDependency(tasks, taskId, oldSourceId, newDependency);
        setTasks(updatedTasks);
    };

    const openDependencyModal = (task: Task) => {
        setSelectedTask(task);
        setSelectedSourceTask('');
        setShowDependencyModal(true);
    };

    const handleArrowDoubleClick = (taskFrom: Task, taskFromIndex: number, taskTo: Task, taskToIndex: number) => {
        if (taskFrom && taskTo && window.confirm('Bạn có chắc chắn muốn xóa dependency này?')) {
            handleRemoveDependency(taskTo.id, taskFrom.id);
        }
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
                                onDoubleClick={(task) => openDependencyModal(task)}
                                onArrowDoubleClick={handleArrowDoubleClick}
                            />
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>

            {/* Dependency Modal */}
            <CModal visible={showDependencyModal} onClose={() => setShowDependencyModal(false)}>
                <CModalHeader>
                    <CModalTitle>Add Dependency</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <label className="form-label">Source Task</label>
                        <CFormSelect
                            value={selectedSourceTask}
                            onChange={(e) => setSelectedSourceTask(e.target.value)}
                        >
                            <option value="">Select a task</option>
                            {tasks
                                .filter(task => task.id !== selectedTask?.id)
                                .map(task => (
                                    <option key={task.id} value={task.id}>
                                        {task.name}
                                    </option>
                                ))}
                        </CFormSelect>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Dependency Type</label>
                        <CFormSelect
                            value={dependencyType}
                            onChange={(e) => setDependencyType(e.target.value as any)}
                        >
                            <option value="endToStart">End to Start</option>
                            <option value="startToStart">Start to Start</option>
                            <option value="endToEnd">End to End</option>
                            <option value="startToEnd">Start to End</option>
                        </CFormSelect>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDependencyModal(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={handleAddDependency}>
                        Add Dependency
                    </CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default BM01; 