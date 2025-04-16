import React from 'react';
import { Task } from '@wamra/gantt-task-react';
import { Modal, Form, Select, Button, Row, Col } from 'antd';

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
        <Modal
            title="Add Dependency"
            open={visible}
            onCancel={onClose}
            width={600}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={onAddDependency}>
                    Add Dependency
                </Button>
            ]}
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Source Task">
                            <Select
                                value={selectedSourceTask}
                                onChange={onSourceTaskChange}
                                placeholder="Select a task"
                                style={{ width: '100%' }}
                            >
                                {tasks
                                    .filter(task => task.id !== selectedTask?.id)
                                    .map(task => (
                                        <Select.Option key={task.id} value={task.id}>
                                            {task.name}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Dependency Type">
                            <Select
                                value={dependencyType}
                                onChange={onDependencyTypeChange}
                                style={{ width: '100%' }}
                            >
                                <Select.Option value="endToStart">End to Start</Select.Option>
                                <Select.Option value="startToStart">Start to Start</Select.Option>
                                <Select.Option value="endToEnd">End to End</Select.Option>
                                <Select.Option value="startToEnd">Start to End</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default DependencyModal; 