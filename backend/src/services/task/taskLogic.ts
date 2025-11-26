/**
 * @summary
 * Task business logic implementation.
 * Handles task creation with in-memory storage.
 *
 * @module services/task/taskLogic
 */

import { TaskCreateRequest, TaskEntity } from './taskTypes';

/**
 * @rule {be-database-requirement}
 * In-memory storage for tasks (no database persistence)
 */
const tasks: TaskEntity[] = [];
let nextId = 1;

/**
 * @summary
 * Creates a new task with system-generated fields
 *
 * @function taskCreate
 * @module services/task/taskLogic
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 * @param {string} params.titulo - Task title
 * @param {string|null} params.descricao - Task description
 * @param {string|null} params.data_vencimento - Due date
 * @param {string} params.prioridade - Priority level
 * @param {number} params.id_usuario - User identifier
 *
 * @returns {Promise<TaskEntity>} Created task entity
 *
 * @example
 * const task = await taskCreate({
 *   titulo: 'Complete project',
 *   descricao: 'Finish all pending tasks',
 *   data_vencimento: '2024-12-31',
 *   prioridade: 'alta',
 *   id_usuario: 1
 * });
 */
export async function taskCreate(params: TaskCreateRequest): Promise<TaskEntity> {
  /**
   * @rule {FI-008,RU-012,RU-013} Generate unique sequential ID
   */
  const id_tarefa = nextId++;

  /**
   * @rule {FI-005,RU-009} Set creation timestamp
   */
  const data_criacao = new Date().toISOString();

  /**
   * @rule {FI-006,RU-010,BR-002} Set initial status as pendente
   */
  const status = 'pendente';

  /**
   * @rule {BR-001} Associate task with user
   */
  const newTask: TaskEntity = {
    id_tarefa,
    id_usuario: params.id_usuario,
    titulo: params.titulo,
    descricao: params.descricao,
    data_vencimento: params.data_vencimento,
    prioridade: params.prioridade,
    status,
    data_criacao,
    data_conclusao: null,
  };

  /**
   * @rule {be-database-requirement}
   * Store in memory array
   */
  tasks.push(newTask);

  return newTask;
}

/**
 * @summary
 * Retrieves all tasks (utility function for testing)
 *
 * @function taskList
 * @module services/task/taskLogic
 *
 * @returns {TaskEntity[]} Array of all tasks
 */
export function taskList(): TaskEntity[] {
  return tasks;
}
