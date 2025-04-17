import React, { useEffect } from 'react';
import { Task } from '@wamra/gantt-task-react';
import { Modal, Form, Input, Select, Button, Row, Col, DatePicker, Avatar, InputNumber } from 'antd';
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
    progress: number;
}

interface NewTaskModalProps {
    visible: boolean;
    onClose: () => void;
    tasks: Task[];
    formData: NewTaskForm;
    onFormChange: (updates: Partial<NewTaskForm>) => void;
    onSubmit: () => void;
    isEditing?: boolean;
    selectedParentId?: string;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({
    visible,
    onClose,
    tasks,
    formData,
    onFormChange,
    onSubmit,
    isEditing = false,
    selectedParentId
}) => {
    useEffect(() => {
        if (visible && selectedParentId && !isEditing) {
            onFormChange({ parent: selectedParentId });
        }
    }, [visible, selectedParentId]);

    const handleDateChange = (field: 'start' | 'end', date: DatePickerProps['value']) => {
        if (date) {
            onFormChange({ [field]: date.format('YYYY-MM-DD') });
        }
    };

    const handleProgressChange = (value: number | null) => {
        // Ensure value is between 0 and 100
        let progress = value || 0;
        if (progress < 0) progress = 0;
        if (progress > 100) progress = 100;
        onFormChange({ progress });
    };

    // Get available parent tasks based on task type and context
    const getAvailableParentTasks = () => {
        if (formData.type === 'project') {
            // Projects can't have parents
            return [];
        }

        // Get the current project ID if task has a parent
        const getCurrentProjectId = (taskId: string | undefined): string | undefined => {
            if (!taskId) return undefined;
            const task = tasks.find(t => t.id === taskId);
            if (!task) return undefined;
            if (task.type === 'project') return task.id;
            return getCurrentProjectId(task.parent);
        };

        // Get current project ID from either selected parent or form data
        const currentProjectId = getCurrentProjectId(selectedParentId) || getCurrentProjectId(formData.parent);

        // Filter tasks based on context
        const availableTasks = tasks.filter(task => {
            // If we have a current project context
            if (currentProjectId) {
                // Get the potential parent's project ID
                const taskProjectId = getCurrentProjectId(task.id);
                // Only include tasks from the same project
                return taskProjectId === currentProjectId && task.id !== formData.parent;
            }
            // If no project context (Add New Task from header), show all tasks
            return true;
        });

        if (formData.type === 'milestone') {
            // Milestones can only be children of projects
            return availableTasks.filter(task => task.type === 'project');
        }
        
        // Tasks can be children of projects or other tasks
        return availableTasks;
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
                                onChange={(value) => {
                                    onFormChange({ 
                                        type: value as 'task' | 'project' | 'milestone',
                                        // Reset progress to 0 if switching to milestone
                                        progress: value === 'milestone' ? 0 : formData.progress
                                    });
                                }}
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
                        <Form.Item 
                            label="Progress" 
                            help={formData.type === 'milestone' ? 'Milestones do not have progress' : 'Enter a value between 0% and 100%'}
                        >
                            <InputNumber
                                value={formData.progress}
                                onChange={handleProgressChange}
                                min={0}
                                max={100}
                                formatter={(value) => `${value}%`}
                                parser={(value) => Number(value!.replace('%', ''))}
                                style={{ width: '100%' }}
                                disabled={formData.type === 'milestone'}
                                step={10}
                            />
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
                                optionLabelProp="label"
                            >
                                {getAvailableParentTasks().map(task => (
                                    <Select.Option 
                                        key={task.id} 
                                        value={task.id}
                                        label={task.name}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>{task.name}</span>
                                            <span style={{ color: '#666', fontSize: '12px' }}>
                                                ({task.type})
                                            </span>
                                        </div>
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