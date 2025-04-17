import React, { useState, useEffect } from 'react';
import { Gantt, ViewMode, Task, OnDateChange, TaskOrEmpty, Dependency } from '@wamra/gantt-task-react';
import { Card, Row, Col, Button, Space, message, Dropdown, Menu, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { initializeTasks, updateTaskProgress, updateTaskDates, deleteTask, addNewTask, updateTask, handleSubmitNewTask as submitNewTask } from './services/ganttService';
import { addDependency, removeDependency, updateDependency, isValidDependency } from './services/dependencyService';
import { mockAssignees, Assignee } from './mock/ganttData';
import DependencyModal from './Modals/DependencyModal';
import NewTaskModal from './Modals/NewTaskModal';
import '@wamra/gantt-task-react/dist/style.css';
import './styles.css';
import { TaskListHeader, TaskListTable } from './components/GanttCustom';
import TooltipContent from './components/GanttTooltip';

type OnArrowDoubleClick = (taskFromIndex: number, taskToIndex: number) => void;

interface NewTaskForm {
    name: string;
    start: string;
    end: string;
    type: 'task' | 'project' | 'milestone';
    parent?: string;
    assignees?: string[];
    progress: number;
}

const BM02: React.FC<RouteComponentProps> = (props) => {
    const { history } = props;
    const [tasks, setTasks] = useState<Task[]>(initializeTasks());
    const [showDependencyModal, setShowDependencyModal] = useState(false);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedSourceTask, setSelectedSourceTask] = useState<string>('');
    const [dependencyType, setDependencyType] = useState<'startToStart' | 'startToEnd' | 'endToStart' | 'endToEnd'>('endToStart');
    const [newTaskForm, setNewTaskForm] = useState<NewTaskForm>({
        name: '',
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        type: 'task',
        assignees: [],
        progress: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState(ViewMode.Day);
    const [chartHeight, setChartHeight] = useState('600px');
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedTaskForMenu, setSelectedTaskForMenu] = useState<Task | null>(null);

    // Responsive adjustments
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setViewMode(ViewMode.Week);
                setChartHeight('400px');
            } else {
                setViewMode(ViewMode.Day);
                setChartHeight('600px');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const handleDelete = (tasksList: readonly TaskOrEmpty[], dependentTasks: readonly Task[], indexes: { task: TaskOrEmpty; index: number; }[]) => {
        const taskToDelete = indexes[0]?.task as Task;
        if (!taskToDelete) return;

        if (window.confirm(`Bạn có chắc chắn muốn xóa project "${taskToDelete.name}" không?`)) {
            const updatedTasks = deleteTask(tasks, taskToDelete.id);
            setTasks(updatedTasks);
        }
    };

    const handleEditTask = (task: TaskOrEmpty) => {
        console.log('onEditTask event triggered with task:', task);

        if (!('id' in task)) {
            return Promise.resolve(null);
        }

        const fullTask = task as Task;
        setSelectedTask(fullTask);
        setIsEditing(true);
        setShowNewTaskModal(true);

        setNewTaskForm({
            name: fullTask.name,
            start: fullTask.start.toISOString().split('T')[0],
            end: fullTask.end.toISOString().split('T')[0],
            type: fullTask.type as 'task' | 'project' | 'milestone',
            parent: fullTask.parent,
            assignees: fullTask.assignees || [],
            progress: fullTask.progress
        });

        return Promise.resolve(null);
    };

    const handleAddTask = (task: Task) => {
        console.log('onAddTask event triggered with task:', task);
        setShowNewTaskModal(true);

        setNewTaskForm(prev => ({
            ...prev,
            start: task.start.toISOString().split('T')[0],
            end: task.end.toISOString().split('T')[0],
            parent: task.type === 'project' ? task.id : task.parent
        }));

        return Promise.resolve(null);
    };

    const handleSubmitNewTask = () => {
        const result = submitNewTask(tasks, newTaskForm, isEditing, selectedTask);

        if (!result.success) {
            message.error(result.message || 'Có lỗi xảy ra!');
            return;
        }

        setTasks(result.updatedTasks);
        setShowNewTaskModal(false);
        setSelectedTask(null);
        setIsEditing(false);
        setNewTaskForm({
            name: '',
            start: new Date().toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0],
            type: 'task',
            assignees: [],
            progress: 0
        });
    };

    const handleFormChange = (updates: Partial<NewTaskForm>) => {
        setNewTaskForm(prev => ({ ...prev, ...updates }));
    };

    const handleTaskSelect = (task: TaskOrEmpty) => {
        if (!('id' in task)) {
            return;
        }
        setSelectedTask(task as Task);
    };

    const handleMenuClick = (key: string) => {
        if (!selectedTaskForMenu) return;

        switch (key) {
            case 'optionA':
                message.info(`Selected Option A for task: ${selectedTaskForMenu.name}`);
                break;
            case 'optionB':
                message.info(`Selected Option B for task: ${selectedTaskForMenu.name}`);
                break;
        }
        setMenuPosition(null);
    };

    const menu: MenuProps = {
        items: [
            {
                key: 'optionA',
                label: 'Option A',
                onClick: () => handleMenuClick('optionA')
            },
            {
                key: 'optionB',
                label: 'Option B',
                onClick: () => handleMenuClick('optionB')
            },
            {
                type: 'divider'
            },
            {
                key: 'assignees',
                label: 'Assignees',
                children: selectedTaskForMenu?.assignees?.map(assigneeId => {
                    const assignee = mockAssignees[assigneeId];
                    if (!assignee) return null;
                    
                    return {
                        key: `assignee-${assignee.id}`,
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Avatar src={assignee.avatar} size="small">
                                    {assignee.name.charAt(0)}
                                </Avatar>
                                <span>{assignee.name}</span>
                            </div>
                        )
                    };
                }).filter(Boolean) || []
            }
        ]
    };

    const handleClick = (task: TaskOrEmpty) => {
        if (!('id' in task)) {
            return;
        }
        const fullTask = task as Task;
        history.push(`/bm01?taskId=${fullTask.id}`);
    };

    return (
        <Row>
            <Col span={24}>
                <Card
                    title="Project list"
                    extra={
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => setShowNewTaskModal(true)}
                            >
                                Add New Project
                            </Button>
                            <Button
                                type="default"
                                onClick={() => selectedTask && history.push(`/bm01?taskId=${selectedTask.id}`)}
                                disabled={!selectedTask}
                            >
                                View Detail
                            </Button>
                            <Button
                                onClick={() => setViewMode(viewMode === ViewMode.Day ? ViewMode.Week : ViewMode.Day)}
                            >
                                {viewMode === ViewMode.Day ? 'Week View' : 'Day View'}
                            </Button>
                        </Space>
                    }
                >
                    <div className="gantt-container" style={{ height: chartHeight }}>
                        <div className="gantt-scroll-container">
                            <div>
                                <Gantt
                                    tasks={tasks}
                                    viewMode={viewMode}
                                    onDateChange={onDateChange}
                                    onProgressChange={onProgressChange}
                                    onDelete={handleDelete}
                                    onDoubleClick={(task) => openDependencyModal(task)}
                                    onArrowDoubleClick={handleArrowDoubleClick}
                                    onAddTaskClick={handleAddTask}
                                    onEditTaskClick={handleEditTask}
                                    isShowCriticalPath={true}
                                    isShowChildOutOfParentWarnings={true}
                                    isShowDependencyWarnings={true}
                                    isShowTaskNumbers={true}
                                    TooltipContent={TooltipContent}
                                    onClick={handleTaskSelect}
                                    // TaskListHeader={TaskListHeader}
                                    // TaskListTable={TaskListTable}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>

            {menuPosition && (
                <Dropdown 
                    menu={menu}
                    open={true} 
                    onOpenChange={() => setMenuPosition(null)}
                >
                    <div 
                        style={{ 
                            position: 'fixed', 
                            left: menuPosition.x, 
                            top: menuPosition.y,
                            width: 0,
                            height: 0
                        }} 
                    />
                </Dropdown>
            )}

            <DependencyModal
                visible={showDependencyModal}
                onClose={() => setShowDependencyModal(false)}
                tasks={tasks}
                selectedTask={selectedTask}
                selectedSourceTask={selectedSourceTask}
                dependencyType={dependencyType}
                onSourceTaskChange={setSelectedSourceTask}
                onDependencyTypeChange={setDependencyType}
                onAddDependency={handleAddDependency}
            />

            <NewTaskModal
                visible={showNewTaskModal}
                onClose={() => {
                    setShowNewTaskModal(false);
                    setSelectedTask(null);
                    setIsEditing(false);
                    setNewTaskForm({
                        name: '',
                        start: new Date().toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0],
                        type: 'task',
                        assignees: [],
                        progress: 0
                    });
                }}
                tasks={tasks}
                formData={newTaskForm}
                onFormChange={handleFormChange}
                onSubmit={handleSubmitNewTask}
                isEditing={isEditing}
            />
        </Row>
    );
};

export default BM02; 