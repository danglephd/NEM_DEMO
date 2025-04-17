import React from 'react';
import { Task, TaskOrEmpty } from '@wamra/gantt-task-react';
import { mockAssignees } from '../mock/ganttData';
import { Avatar, Tooltip } from 'antd';
import { SortAscendingOutlined, ArrowsAltOutlined, ColumnHeightOutlined } from '@ant-design/icons';

interface TaskListHeaderProps {
    headerHeight: number;
    fontFamily: string;
    fontSize: string;
}

interface TaskListTableProps {
    tasks: readonly TaskOrEmpty[];
    fontFamily: string;
    fontSize: string;
}

export const TaskListHeader: React.FC<TaskListHeaderProps> = ({ 
    headerHeight,
    fontFamily,
    fontSize
}) => {
    return (
        <div
            className="gantt-table-header"
            style={{
                height: headerHeight,
                fontFamily,
                fontSize,
                display: 'flex',
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #e8e8e8'
            }}
        >
            <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <div 
                    className="gantt-table-header-cell" 
                    style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <span>Name</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <SortAscendingOutlined style={{ fontSize: '12px', cursor: 'pointer' }} />
                        <ArrowsAltOutlined style={{ fontSize: '12px', cursor: 'pointer' }} />
                        <ColumnHeightOutlined style={{ fontSize: '12px', cursor: 'pointer' }} />
                    </div>
                </div>
                <div 
                    className="gantt-table-header-cell" 
                    style={{ 
                        width: 120,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <span>From</span>
                </div>
                <div 
                    className="gantt-table-header-cell" 
                    style={{ 
                        width: 120,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <span>To</span>
                </div>
                <div 
                    className="gantt-table-header-cell" 
                    style={{ 
                        width: 120,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <span>Dependencies</span>
                </div>
            </div>
        </div>
    );
};

export const TaskListTable: React.FC<TaskListTableProps> = ({ 
    tasks, 
    fontFamily,
    fontSize
}) => {
    return (
        <div>
            {tasks.map((task) => {
                if (!('id' in task)) return null;
                const fullTask = task as Task;
                
                return (
                    <div
                        key={fullTask.id}
                        className="gantt-table-row"
                        style={{
                            // height: rowHeight,
                            fontFamily,
                            fontSize,
                            display: 'flex'
                        }}
                    >
                        <div style={{ display: 'flex', width: '100%' }}>
                            <div 
                                className="gantt-table-cell" 
                                style={{ 
                                    flex: 1,
                                    paddingLeft: fullTask.type === 'project' ? 10 : 30
                                }}
                            >
                                {fullTask.name}
                            </div>
                            <div className="gantt-table-cell" style={{ width: 120 }}>
                                {fullTask.start.toLocaleDateString()}
                            </div>
                            <div className="gantt-table-cell" style={{ width: 120 }}>
                                {fullTask.end.toLocaleDateString()}
                            </div>
                            <div className="gantt-table-cell" style={{ width: 120 }}>
                                {fullTask.assignees && fullTask.assignees.length > 0 ? (
                                    <Avatar.Group maxCount={3} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                        {fullTask.assignees.map(assigneeId => {
                                            const assignee = mockAssignees[assigneeId];
                                            if (!assignee) return null;
                                            
                                            return (
                                                <Tooltip key={assignee.id} title={assignee.name}>
                                                    <Avatar src={assignee.avatar} size="small">
                                                        {assignee.name.charAt(0)}
                                                    </Avatar>
                                                </Tooltip>
                                            );
                                        })}
                                    </Avatar.Group>
                                ) : null}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}; 