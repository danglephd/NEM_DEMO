import React from 'react';
import { Task } from '@wamra/gantt-task-react';
import { Modal, Form, Input, Select, Button, Row, Col, DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';

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
    const handleDateChange = (field: 'start' | 'end', date: DatePickerProps['value']) => {
        if (date) {
            onFormChange({ [field]: date.format('YYYY-MM-DD') });
        }
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
                        <Form.Item label="Parent Task (Optional)">
                            <Select
                                value={formData.parent || undefined}
                                onChange={(value) => onFormChange({ parent: value || undefined })}
                                    disabled={isEditing}
                                style={{ width: '100%' }}
                                allowClear
                                >
                                    {tasks
                                        .filter(task => task.type === 'project')
                                        .map(task => (
                                        <Select.Option key={task.id} value={task.id}>
                                                {task.name}
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