import { Task, Dependency } from '@wamra/gantt-task-react';

/**
 * Thêm dependency cho một task
 * @param tasks Danh sách tasks hiện tại
 * @param taskId ID của task cần thêm dependency
 * @param dependency Dependency cần thêm
 * @returns Danh sách tasks đã được cập nhật
 */
export const addDependency = (
    tasks: Task[],
    taskId: string,
    dependency: Dependency
): Task[] => {
    return tasks.map(task => {
        if (task.id === taskId) {
            const existingDependencies = task.dependencies || [];
            // Kiểm tra xem dependency đã tồn tại chưa
            const isDuplicate = existingDependencies.some(
                d => d.sourceId === dependency.sourceId && 
                     d.sourceTarget === dependency.sourceTarget && 
                     d.ownTarget === dependency.ownTarget
            );
            
            if (!isDuplicate) {
                return {
                    ...task,
                    dependencies: [...existingDependencies, dependency]
                };
            }
        }
        return task;
    });
};

/**
 * Xóa dependency của một task
 * @param tasks Danh sách tasks hiện tại
 * @param taskId ID của task cần xóa dependency
 * @param sourceId ID của task nguồn trong dependency cần xóa
 * @returns Danh sách tasks đã được cập nhật
 */
export const removeDependency = (
    tasks: Task[],
    taskId: string,
    sourceId: string
): Task[] => {
    return tasks.map(task => {
        if (task.id === taskId && task.dependencies) {
            return {
                ...task,
                dependencies: task.dependencies.filter(d => d.sourceId !== sourceId)
            };
        }
        return task;
    });
};

/**
 * Cập nhật dependency của một task
 * @param tasks Danh sách tasks hiện tại
 * @param taskId ID của task cần cập nhật dependency
 * @param oldSourceId ID của task nguồn cũ
 * @param newDependency Dependency mới
 * @returns Danh sách tasks đã được cập nhật
 */
export const updateDependency = (
    tasks: Task[],
    taskId: string,
    oldSourceId: string,
    newDependency: Dependency
): Task[] => {
    return tasks.map(task => {
        if (task.id === taskId && task.dependencies) {
            const updatedDependencies = task.dependencies.map(d => 
                d.sourceId === oldSourceId ? newDependency : d
            );
            return {
                ...task,
                dependencies: updatedDependencies
            };
        }
        return task;
    });
};

/**
 * Kiểm tra tính hợp lệ của dependency
 * @param tasks Danh sách tasks
 * @param taskId ID của task đích
 * @param sourceId ID của task nguồn
 * @returns true nếu dependency hợp lệ, false nếu không
 */
export const isValidDependency = (
    tasks: Task[],
    taskId: string,
    sourceId: string
): boolean => {
    // Không thể tạo dependency với chính nó
    if (taskId === sourceId) return false;

    const sourceTask = tasks.find(t => t.id === sourceId);
    const targetTask = tasks.find(t => t.id === taskId);

    // Kiểm tra cả hai task đều tồn tại
    if (!sourceTask || !targetTask) return false;

    // Kiểm tra không tạo dependency vòng
    const hasCircularDependency = checkCircularDependency(tasks, taskId, sourceId);
    if (hasCircularDependency) return false;

    return true;
};

/**
 * Kiểm tra dependency vòng
 * @param tasks Danh sách tasks
 * @param startId ID của task bắt đầu
 * @param targetId ID của task đích
 * @returns true nếu có dependency vòng, false nếu không
 */
const checkCircularDependency = (
    tasks: Task[],
    startId: string,
    targetId: string
): boolean => {
    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (currentId: string): boolean => {
        if (stack.has(currentId)) return true;
        if (visited.has(currentId)) return false;

        visited.add(currentId);
        stack.add(currentId);

        const currentTask = tasks.find(t => t.id === currentId);
        if (currentTask?.dependencies) {
            for (const dep of currentTask.dependencies) {
                if (dfs(dep.sourceId)) return true;
            }
        }

        stack.delete(currentId);
        return false;
    };

    return dfs(startId);
}; 