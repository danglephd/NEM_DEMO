import React from 'react';
import { Task } from '@wamra/gantt-task-react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormSelect, CFormInput, CContainer, CRow, CCol } from '@coreui/react';

interface NewTaskForm {
    name: string;
    start: string;
    end: string;
    type: 'task' | 'project' | 'milestone';
    parent?: string;
}

interface NewTaskModalProps {
    visible: boolean;
    onClose: () => void;
    tasks: Task[];
    formData: NewTaskForm;
    onFormChange: (updates: Partial<NewTaskForm>) => void;
    onSubmit: () => void;
    isEditing?: boolean;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({
    visible,
    onClose,
    tasks,
    formData,
    onFormChange,
    onSubmit,
    isEditing = false
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
                <CModalTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer fluid>
                    <CRow>
                        <CCol xs={12}>
                            <div className="mb-3">
                                <label className="form-label">Task Name</label>
                                <CFormInput
                                    value={formData.name}
                                    onChange={(e) => onFormChange({ name: e.target.value })}
                                    placeholder="Enter task name"
                                />
                            </div>
                        </CCol>
                        <CCol xs={12} md={6}>
                            <div className="mb-3">
                                <label className="form-label">Start Date</label>
                                <CFormInput
                                    type="date"
                                    value={formData.start}
                                    onChange={(e) => onFormChange({ start: e.target.value })}
                                />
                            </div>
                        </CCol>
                        <CCol xs={12} md={6}>
                            <div className="mb-3">
                                <label className="form-label">End Date</label>
                                <CFormInput
                                    type="date"
                                    value={formData.end}
                                    onChange={(e) => onFormChange({ end: e.target.value })}
                                />
                            </div>
                        </CCol>
                        <CCol xs={12} md={6}>
                            <div className="mb-3">
                                <label className="form-label">Task Type</label>
                                <CFormSelect
                                    value={formData.type}
                                    onChange={(e) => onFormChange({ type: e.target.value as 'task' | 'project' | 'milestone' })}
                                    disabled={isEditing}
                                >
                                    <option value="task">Task</option>
                                    <option value="project">Project</option>
                                    <option value="milestone">Milestone</option>
                                </CFormSelect>
                            </div>
                        </CCol>
                        <CCol xs={12} md={6}>
                            <div className="mb-3">
                                <label className="form-label">Parent Task (Optional)</label>
                                <CFormSelect
                                    value={formData.parent || ''}
                                    onChange={(e) => onFormChange({ parent: e.target.value || undefined })}
                                    disabled={isEditing}
                                >
                                    <option value="">No Parent</option>
                                    {tasks
                                        .filter(task => task.type === 'project')
                                        .map(task => (
                                            <option key={task.id} value={task.id}>
                                                {task.name}
                                            </option>
                                        ))}
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
                <CButton color="primary" onClick={onSubmit}>
                    {isEditing ? 'Save Changes' : 'Add Task'}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default NewTaskModal; 