/**
 * @summary
 * Task service type definitions.
 * Defines interfaces for task entities and operations.
 *
 * @module services/task/taskTypes
 */

/**
 * @interface TaskEntity
 * @description Represents a task entity in the system
 *
 * @property {number} id_tarefa - Unique task identifier
 * @property {number} id_usuario - User identifier (task owner)
 * @property {string} titulo - Task title
 * @property {string|null} descricao - Task description
 * @property {string|null} data_vencimento - Due date (AAAA-MM-DD format)
 * @property {string} prioridade - Priority level: alta, média, baixa
 * @property {string} status - Task status: pendente, concluída
 * @property {string} data_criacao - Creation timestamp (ISO format)
 * @property {string|null} data_conclusao - Completion timestamp (ISO format)
 */
export interface TaskEntity {
  id_tarefa: number;
  id_usuario: number;
  titulo: string;
  descricao: string | null;
  data_vencimento: string | null;
  prioridade: 'alta' | 'média' | 'baixa';
  status: 'pendente' | 'concluída';
  data_criacao: string;
  data_conclusao: string | null;
}

/**
 * @interface TaskCreateRequest
 * @description Request parameters for task creation
 *
 * @property {string} titulo - Task title (3-100 characters)
 * @property {string|null} descricao - Task description (max 500 characters)
 * @property {string|null} data_vencimento - Due date (AAAA-MM-DD format)
 * @property {string} prioridade - Priority level: alta, média, baixa
 * @property {number} id_usuario - User identifier
 */
export interface TaskCreateRequest {
  titulo: string;
  descricao: string | null;
  data_vencimento: string | null;
  prioridade: 'alta' | 'média' | 'baixa';
  id_usuario: number;
}
