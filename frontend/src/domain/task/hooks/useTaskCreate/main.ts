import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { CreateTaskDto } from '../../types/task';

export const useTaskCreate = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createTask,
    isPending,
    error,
  } = useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    createTask,
    isPending,
    error,
  };
};
