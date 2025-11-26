import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';
import { taskSchema } from '../../validations/task';
import { useTaskCreate } from '../../hooks/useTaskCreate';
import type { TaskFormInput } from '../../types/task';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { DatePicker } from '@/core/components/date-picker';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/core/components/card';
import { useNavigation } from '@/core/hooks/useNavigation';
import { LoadingSpinner } from '@/core/components/loading-spinner';

interface TaskFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const { createTask, isPending } = useTaskCreate();
  const { goBack } = useNavigation();

  const form = useForm<TaskFormInput>({
    resolver: zodResolver(taskSchema),
    mode: 'onBlur',
    defaultValues: {
      titulo: '',
      descricao: null,
      data_vencimento: null,
      prioridade: 'média',
    },
  });

  const onSubmit = async (data: TaskFormInput) => {
    try {
      const sanitizedData = {
        titulo: DOMPurify.sanitize(data.titulo),
        descricao: data.descricao ? DOMPurify.sanitize(data.descricao) : null,
        data_vencimento: data.data_vencimento,
        prioridade: data.prioridade,
      };

      await createTask(sanitizedData);
      toast.success('Tarefa criada com sucesso!');
      form.reset();
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error.response as { data?: { message?: string } })?.data?.message
          : 'Erro ao criar tarefa';
      toast.error(errorMessage || 'Erro ao criar tarefa');
    }
  };

  const handleCancel = () => {
    if (form.formState.isDirty) {
      const confirmed = window.confirm(
        'Você tem alterações não salvas. Deseja realmente cancelar?'
      );
      if (!confirmed) return;
    }
    form.reset();
    onCancel ? onCancel() : goBack();
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Nova Tarefa</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o título da tarefa"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Título que identifica o objetivo da tarefa</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes da tarefa"
                      disabled={isPending}
                      className="min-h-[100px] resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>Informações adicionais sobre a tarefa</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="data_vencimento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Vencimento</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value ? new Date(field.value) : undefined}
                        onDateChange={(date) =>
                          field.onChange(date ? date.toISOString().split('T')[0] : null)
                        }
                        disabled={isPending}
                        placeholder="Selecione uma data"
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>Data limite para conclusão</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prioridade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="média">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Nível de importância da tarefa</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingSpinner />
                  Criando...
                </>
              ) : (
                'Criar Tarefa'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export { TaskForm };
