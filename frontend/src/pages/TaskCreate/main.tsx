import { TaskForm } from '@/domain/task/_module';
import { useNavigation } from '@/core/hooks/useNavigation';

function TaskCreatePage() {
  const { navigate } = useNavigation();

  const handleSuccess = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto py-8">
      <TaskForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}

export { TaskCreatePage };
