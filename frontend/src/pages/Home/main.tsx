import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';
import { PlusIcon } from 'lucide-react';

function HomePage() {
  const { navigate } = useNavigation();

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Gerenciador de Tarefas</h1>
        <p className="text-muted-foreground text-lg">Organize suas tarefas de forma eficiente</p>
      </div>
      <Button size="lg" onClick={() => navigate('/tasks/create')}>
        <PlusIcon />
        Nova Tarefa
      </Button>
    </div>
  );
}

export { HomePage };
