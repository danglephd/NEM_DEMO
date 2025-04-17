import React from 'react';
import { Task } from '@wamra/gantt-task-react';
import { Modal, Form, Input, Select, Button, Row, Col, DatePicker, Avatar } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import { mockAssignees, Assignee } from '../mock/ganttData';

interface NewTaskForm {
    name: string;
    start: string;
    end: string;
    type: 'task' | 'project' | 'milestone';
    parent?: string;
    assignees?: string[];
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
    const handleDateChange = (field: 'start' | 'end', date: DatePickerProps['value']) => {
        if (date) {
            onFormChange({ [field]: date.format('YYYY-MM-DD') });
        }
    };

    // Get available parent tasks based on task type
    const getAvailableParentTasks = () => {
        if (formData.type === 'project') {
            // Projects can't have parents
            return [];
        }
        
        if (formData.type === 'milestone') {
            // Milestones can only be children of projects
            return tasks.filter(task => task.type === 'project');
        }
        
        // Tasks can be children of projects or other tasks
        return tasks.filter(task => task.type === 'project' || task.type === 'task');
    };

    return (
        <Modal
            title={isEditing ? 'Edit Task' : 'Add New Task'}
            open={visible}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={onSubmit}>
                    {isEditing ? 'Save Changes' : 'Add Task'}
                </Button>
            ]}
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Task Name">
                            <Input
                                value={formData.name}
                                onChange={(e) => onFormChange({ name: e.target.value })}
                                placeholder="Enter task name"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Start Date">
                            <DatePicker
                                value={formData.start ? dayjs(formData.start) : null}
                                onChange={(date) => handleDateChange('start', date)}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="End Date">
                            <DatePicker
                                value={formData.end ? dayjs(formData.end) : null}
                                onChange={(date) => handleDateChange('end', date)}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Task Type">
                            <Select
                                value={formData.type}
                                onChange={(value) => onFormChange({ type: value as 'task' | 'project' | 'milestone' })}
                                disabled={isEditing}
                                style={{ width: '100%' }}
                            >
                                <Select.Option value="task">Task</Select.Option>
                                <Select.Option value="project">Project</Select.Option>
                                <Select.Option value="milestone">Milestone</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Parent Task">
                            <Select
                                value={formData.parent}
                                onChange={(value) => onFormChange({ parent: value })}
                                disabled={isEditing || formData.type === 'project'}
                                style={{ width: '100%' }}
                                allowClear
                                placeholder="Select parent task (optional)"
                            >
                                {getAvailableParentTasks().map(task => (
                                    <Select.Option key={task.id} value={task.id}>
                                        {task.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Assignees">
                            <Select
                                mode="multiple"
                                value={formData.assignees}
                                onChange={(values) => onFormChange({ assignees: values })}
                                style={{ width: '100%' }}
                                optionLabelProp="label"
                            >
                                {Object.values(mockAssignees).map(assignee => (
                                    <Select.Option 
                                        key={assignee.id} 
                                        value={assignee.id}
                                        label={assignee.name}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Avatar src={assignee.avatar} size="small">
                                                {assignee.name.charAt(0)}
                                            </Avatar>
                                            <span>{assignee.name}</span>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default NewTaskModal; 