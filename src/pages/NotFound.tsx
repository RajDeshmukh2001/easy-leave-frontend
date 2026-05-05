import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function NotFound(): React.JSX.Element {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-2">
      <h1 className="text-6xl text-gray-500">404</h1>
      <h2 className="text-lg font-semibold text-gray-600">Page Not Found</h2>
      <p className="text-sm text-gray-600">We could not find the page you were looking for.</p>
      <Button onClick={handleBackToHome} className="cursor-pointer mt-4 bg-(--technogise-blue)">
        Back To Home
      </Button>
    </div>
  );
}

export default NotFound;
