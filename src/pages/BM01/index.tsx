import React, { useState, useEffect } from 'react';

import { Gantt, ViewMode, Task, OnDateChange, TaskOrEmpty, Dependency } from '@wamra/gantt-task-react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react';
import { initializeTasks, updateTaskProgress, updateTaskDates, deleteTask, addNewTask, updateTask } from './services/ganttService';
import { addDependency, removeDependency, updateDependency, isValidDependency } from './services/dependencyService';
import DependencyModal from './Modals/DependencyModal';
import NewTaskModal from './Modals/NewTaskModal';
import '@wamra/gantt-task-react/dist/style.css';
import './styles.css';

type OnArrowDoubleClick = (taskFromIndex: number, taskToIndex: number) => void;

interface NewTaskForm {
    name: string;
    start: string;
    end: string;
    type: 'task' | 'project' | 'milestone';
    parent?: string;
}

const BM01: React.FC = () => {
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
        type: 'task'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState(ViewMode.Day);
    const [chartHeight, setChartHeight] = useState('600px');

    // Responsive adjustments
    useEffect(() => {
        const handleResize = () => {
            // Adjust view mode based on screen width
            if (window.innerWidth < 768) {
                setViewMode(ViewMode.Week);
                setChartHeight('400px');
            } else {
                setViewMode(ViewMode.Day);
                setChartHeight('600px');
            }
        };

        // Initial call
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
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

        if (window.confirm(`Bạn có chắc chắn muốn xóa task "${taskToDelete.name}" không?`)) {
            console.log('Deleting task:', taskToDelete);
            const updatedTasks = deleteTask(tasks, taskToDelete.id);
            setTasks(updatedTasks);
            console.log('Task deleted successfully');
        }
    };

    const handleEditTask = (task: TaskOrEmpty) => {
        console.log('onEditTask event triggered with task:', task);
        
        // Kiểm tra xem task có phải là EmptyTask không
        if (!('id' in task)) {
            return Promise.resolve(null);
        }

        const fullTask = task as Task;
        setSelectedTask(fullTask);
        setIsEditing(true);
        setShowNewTaskModal(true);
        
        // Initialize form with task data
        setNewTaskForm({
            name: fullTask.name,
            start: fullTask.start.toISOString().split('T')[0],
            end: fullTask.end.toISOString().split('T')[0],
            type: fullTask.type as 'task' | 'project' | 'milestone',
            parent: fullTask.parent
        });

        return Promise.resolve(null);
    };

    const handleAddTask = (task: Task) => {
        console.log('onAddTask event triggered with task:', task);
        setShowNewTaskModal(true);
        
        // Initialize form with the clicked position's date and set parent
        setNewTaskForm(prev => ({
            ...prev,
            start: task.start.toISOString().split('T')[0],
            end: task.end.toISOString().split('T')[0],
            // Nếu task là project, set task đó làm parent
            // Nếu không, set parent là parent của task được click
            parent: task.type === 'project' ? task.id : task.parent
        }));

        return Promise.resolve(null);
    };

    const handleSubmitNewTask = () => {
        const { name, start, end, type, parent } = newTaskForm;
        
        if (!name || !start || !end) {
            alert('Vui lòng điền đầy đủ thông tin task!');
            return;
        }

        if (isEditing && selectedTask) {
            // Update existing task
            const updates: Partial<Task> = {
                name,
                start: new Date(start),
                end: new Date(end)
            };

            console.log('Updating task:', selectedTask.id, updates);
            const updatedTasks = updateTask(tasks, selectedTask.id, updates);
            setTasks(updatedTasks);
            console.log('Task updated successfully');
        } else {
            // Add new task
            const newTask: Omit<Task, 'id'> = {
                name,
                start: new Date(start),
                end: new Date(end),
                type,
                progress: 0,
                isDisabled: false,
                parent,
                styles: {
                    barProgressColor: '#2196F3',
                    barProgressSelectedColor: '#2196F3'
                }
            };

            console.log('Adding new task:', newTask);
            const updatedTasks = addNewTask(tasks, newTask);
            setTasks(updatedTasks);
            console.log('Task added successfully');
        }

        // Reset form and state
        setShowNewTaskModal(false);
        setSelectedTask(null);
        setIsEditing(false);
        setNewTaskForm({
            name: '',
            start: new Date().toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0],
            type: 'task'
        });
    };

    const handleFormChange = (updates: Partial<NewTaskForm>) => {
        setNewTaskForm(prev => ({ ...prev, ...updates }));
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <strong>BM01 - Gantt Chart</strong>
                        <div className="d-flex gap-2">
                            <CButton 
                                color="primary" 
                                size={window.innerWidth < 768 ? 'sm' : undefined}
                                onClick={() => setShowNewTaskModal(true)}
                            >
                                Add New Task
                            </CButton>
                            <CButton
                                color="secondary"
                                size={window.innerWidth < 768 ? 'sm' : undefined}
                                onClick={() => setViewMode(viewMode === ViewMode.Day ? ViewMode.Week : ViewMode.Day)}
                            >
                                {viewMode === ViewMode.Day ? 'Week View' : 'Day View'}
                            </CButton>
                        </div>
                    </CCardHeader>
                    <CCardBody className="gantt-container" style={{ height: chartHeight }}>
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
                                />
                            </div>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>

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
                        type: 'task'
                    });
                }}
                tasks={tasks}
                formData={newTaskForm}
                onFormChange={handleFormChange}
                onSubmit={handleSubmitNewTask}
                isEditing={isEditing}
            />
        </CRow>
    );
};

export default BM01; 