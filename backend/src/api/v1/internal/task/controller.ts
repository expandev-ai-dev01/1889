/**
 * @summary
 * Task creation controller handling HTTP requests for creating new tasks.
 * Validates user input, applies business rules, and stores task data.
 *
 * @module api/v1/internal/task/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { taskCreate } from '@/services/task';

/**
 * @validation Request body schema for task creation
 * @rule {RU-001,RU-002,RU-003} Title validation: 3-100 characters, no whitespace-only
 * @rule {RU-004} Description validation: max 500 characters
 * @rule {RU-005,RU-006,RU-007} Due date validation: valid date format, not in past
 * @rule {RU-008} Priority validation: alta, média, baixa
 */
const bodySchema = z.object({
  titulo: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título não pode exceder 100 caracteres')
    .refine((val) => val.trim().length > 0, 'O título não pode conter apenas espaços em branco'),
  descricao: z
    .string()
    .max(500, 'A descrição não pode exceder 500 caracteres')
    .nullable()
    .optional(),
  data_vencimento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido. Use AAAA-MM-DD')
    .nullable()
    .optional(),
  prioridade: z.enum(['alta', 'média', 'baixa'], {
    errorMap: () => ({ message: 'Selecione uma prioridade válida: alta, média ou baixa' }),
  }),
});

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with the specified parameters
 *
 * @apiParam {String} titulo Task title (3-100 characters)
 * @apiParam {String} [descricao] Task description (max 500 characters)
 * @apiParam {String} [data_vencimento] Due date in AAAA-MM-DD format
 * @apiParam {String} prioridade Priority level: alta, média, baixa
 *
 * @apiSuccess {Number} id_tarefa Task identifier
 * @apiSuccess {String} titulo Task title
 * @apiSuccess {String} descricao Task description
 * @apiSuccess {String} data_vencimento Due date
 * @apiSuccess {String} prioridade Priority level
 * @apiSuccess {String} status Task status (pendente)
 * @apiSuccess {String} data_criacao Creation timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} BusinessRuleError Business rule violation
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @validation Validate request body against schema
     * @throw {ValidationError}
     */
    const validated = bodySchema.parse(req.body);

    /**
     * @validation Check if due date is not in the past
     * @rule {RU-007} Due date must be equal or after current date
     * @throw {BusinessRuleError}
     */
    if (validated.data_vencimento) {
      const dueDate = new Date(validated.data_vencimento);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        res
          .status(400)
          .json(
            errorResponse(
              'A data de vencimento não pode ser anterior à data atual',
              'INVALID_DUE_DATE'
            )
          );
        return;
      }
    }

    /**
     * @rule {BR-001,BR-002} Create task with user association and pendente status
     * @rule {FI-005,FI-006,FI-007,FI-008} System-filled fields
     */
    const taskData = await taskCreate({
      titulo: validated.titulo,
      descricao: validated.descricao || null,
      data_vencimento: validated.data_vencimento || null,
      prioridade: validated.prioridade,
      id_usuario: 1,
    });

    /**
     * @output {TaskCreated, 1, 1}
     * @column {Number} id_tarefa - Task identifier
     * @column {String} titulo - Task title
     * @column {String} descricao - Task description
     * @column {String} data_vencimento - Due date
     * @column {String} prioridade - Priority level
     * @column {String} status - Task status
     * @column {String} data_criacao - Creation timestamp
     */
    res.status(201).json(successResponse(taskData));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR', error.errors));
    } else {
      next(error);
    }
  }
}
