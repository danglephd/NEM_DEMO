import React from 'react';
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
    // parent?: string;
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

    const handleProgressChange = (value: number | null) => {
        // Ensure value is between 0 and 100
        let progress = value || 0;
        if (progress < 0) progress = 0;
        if (progress > 100) progress = 100;
        onFormChange({ progress });
    };

    return (
        <Modal
            title={isEditing ? 'Edit Project' : 'Add New Project'}
            open={visible}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={onSubmit}>
                    {isEditing ? 'Save Changes' : 'Add Project'}
                </Button>
            ]}
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Project Name">
                            <Input
                                value={formData.name}
                                onChange={(e) => onFormChange({ name: e.target.value })}
                                placeholder="Enter project name"
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
                        <Form.Item 
                            label="Progress" 
                            help="Enter a value between 0% and 100%"
                        >
                            <InputNumber
                                value={formData.progress}
                                onChange={handleProgressChange}
                                min={0}
                                max={100}
                                formatter={(value) => `${value}%`}
                                parser={(value) => Number(value!.replace('%', ''))}
                                style={{ width: '100%' }}
                                step={10}
                            />
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