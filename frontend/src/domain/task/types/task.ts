export interface Task {
  id_tarefa: number;
  titulo: string;
  descricao: string | null;
  data_vencimento: string | null;
  prioridade: 'alta' | 'média' | 'baixa';
  status: 'pendente' | 'concluída';
  data_criacao: string;
  id_usuario: number;
}

export interface CreateTaskDto {
  titulo: string;
  descricao: string | null;
  data_vencimento: string | null;
  prioridade: 'alta' | 'média' | 'baixa';
}

export interface TaskFormInput {
  titulo: string;
  descricao: string | null;
  data_vencimento: string | null;
  prioridade: 'alta' | 'média' | 'baixa';
}
