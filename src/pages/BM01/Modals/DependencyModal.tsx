import React from 'react';
import { Task } from '@wamra/gantt-task-react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormSelect, CContainer, CRow, CCol } from '@coreui/react';

interface DependencyModalProps {
    visible: boolean;
    onClose: () => void;
    tasks: Task[];
    selectedTask: Task | null;
    selectedSourceTask: string;
    dependencyType: 'startToStart' | 'startToEnd' | 'endToStart' | 'endToEnd';
    onSourceTaskChange: (value: string) => void;
    onDependencyTypeChange: (value: 'startToStart' | 'startToEnd' | 'endToStart' | 'endToEnd') => void;
    onAddDependency: () => void;
}

const DependencyModal: React.FC<DependencyModalProps> = ({
    visible,
    onClose,
    tasks,
    selectedTask,
    selectedSourceTask,
    dependencyType,
    onSourceTaskChange,
    onDependencyTypeChange,
    onAddDependency
}) => {
    return (
        <CModal 
            visible={visible} 
            onClose={onClose}
            size="lg"
            alignment="center"
            scrollable
        >
            <CModalHeader>
                <CModalTitle>Add Dependency</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer fluid>
                    <CRow>
                        <CCol xs={12}>
                            <div className="mb-3">
                                <label className="form-label">Source Task</label>
                                <CFormSelect
                                    value={selectedSourceTask}
                                    onChange={(e) => onSourceTaskChange(e.target.value)}
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
                        </CCol>
                        <CCol xs={12}>
                            <div className="mb-3">
                                <label className="form-label">Dependency Type</label>
                                <CFormSelect
                                    value={dependencyType}
                                    onChange={(e) => onDependencyTypeChange(e.target.value as any)}
                                >
                                    <option value="endToStart">End to Start</option>
                                    <option value="startToStart">Start to Start</option>
                                    <option value="endToEnd">End to End</option>
                                    <option value="startToEnd">Start to End</option>
                                </CFormSelect>
                            </div>
                        </CCol>
                    </CRow>
                </CContainer>
            </CModalBody>
            <CModalFooter className="d-flex justify-content-between">
                <CButton color="secondary" onClick={onClose}>
                    Cancel
                </CButton>
                <CButton color="primary" onClick={onAddDependency}>
                    Add Dependency
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default DependencyModal; 