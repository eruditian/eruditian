import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Button } from '~/components/ui/button';
import { XIcon } from 'lucide-react';

const RootLayout = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed top-2 right-2 z-30 flex gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => navigate({ to: '/' })}
        >
          <XIcon />
        </Button>
        {/* <Button size="icon" variant="ghost">
          <MaximizeIcon />
        </Button> */}
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
