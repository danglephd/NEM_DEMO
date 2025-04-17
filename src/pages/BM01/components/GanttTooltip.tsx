import React from 'react';
import { Task } from '@wamra/gantt-task-react';
import { Avatar, Tooltip } from 'antd';
import { mockAssignees } from '../mock/ganttData';

interface TooltipContentProps {
    task: Task;
    fontSize: string;
    fontFamily: string;
}

const TooltipContent: React.FC<TooltipContentProps> = ({
    task,
    fontSize,
    fontFamily
}) => {
    const duration = Math.ceil((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24));
    const today = new Date();
    const isOverdue = today > task.end && task.progress < 100;
    const isNearDeadline = !isOverdue && 
        today <= task.end && 
        today >= new Date(task.end.getTime() - (24 * 60 * 60 * 1000 * 2)) && // 2 days before deadline
        task.progress < 100;

    const commonRowStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minHeight: '24px'
    };

    const labelStyle = {
        width: '70px',
        flexShrink: 0
    };

    return (
        <div
            style={{
                backgroundColor: 'white',
                boxShadow: '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)',
                borderRadius: '2px',
                padding: '12px 16px',
                minWidth: '240px',
                fontFamily,
                fontSize
            }}
        >
            <div 
                style={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    marginBottom: '12px',
                    color: 'rgba(0, 0, 0, 0.85)'
                }}
            >
                {task.name}: {task.start.toLocaleDateString()} - {task.end.toLocaleDateString()}
            </div>
            <div
                style={{
                    fontSize: '12px',
                    color: 'rgba(0, 0, 0, 0.65)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}
            >
                <div style={commonRowStyle}>
                    <span style={labelStyle}>Duration:</span>
                    <span>{duration} day(s)</span>
                </div>
                <div style={commonRowStyle}>
                    <span style={labelStyle}>Progress:</span>
                    <span>{Math.round(task.progress)} %</span>
                </div>
                <div style={commonRowStyle}>
                    <span style={labelStyle}>Start:</span>
                    <span>{task.start.toLocaleDateString()}</span>
                </div>
                <div style={commonRowStyle}>
                    <span style={labelStyle}>End:</span>
                    <div 
                        style={{
                            padding: '2px 8px',
                            borderRadius: '2px',
                            ...(isOverdue && {
                                backgroundColor: '#fff1f0',
                                color: '#cf1322',
                                border: '1px solid #ffa39e'
                            }),
                            ...(isNearDeadline && {
                                backgroundColor: '#fffbe6',
                                color: '#d4b106',
                                border: '1px solid #ffe58f'
                            })
                        }}
                    >
                        {task.end.toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                        {isNearDeadline && ' (Near Deadline)'}
                    </div>
                </div>
            </div>
            {task.assignees && task.assignees.length > 0 && (
                <div>
                    <div style={{ marginBottom: '4px' }}>Assignees:</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {task.assignees.map(assigneeId => {
                            const assignee = mockAssignees[assigneeId];
                            if (!assignee) return null;
                            
                            return (
                                <div 
                                    key={assignee.id}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: '#f0f0f0',
                                        padding: '2px 8px',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <Avatar 
                                        src={assignee.avatar} 
                                        size="small"
                                        style={{
                                            width: 16,
                                            height: 16,
                                            fontSize: '10px',
                                            lineHeight: '16px'
                                        }}
                                    >
                                        {assignee.name.charAt(0)}
                                    </Avatar>
                                    <span style={{ fontSize: '12px' }}>{assignee.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TooltipContent; 