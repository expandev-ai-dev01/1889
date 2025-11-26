import { z } from 'zod';

export const taskSchema = z.object({
  titulo: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título não pode exceder 100 caracteres')
    .refine((val) => val.trim().length > 0, 'O título não pode conter apenas espaços em branco'),
  descricao: z
    .string()
    .max(500, 'A descrição não pode exceder 500 caracteres')
    .transform((val) => (val && val.trim().length > 0 ? val : null))
    .nullable(),
  data_vencimento: z
    .string()
    .refine(
      (dateStr) => {
        if (!dateStr) return true;
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: 'A data de vencimento não pode ser anterior à data atual' }
    )
    .nullable(),
  prioridade: z.enum(['alta', 'média', 'baixa']),
});
