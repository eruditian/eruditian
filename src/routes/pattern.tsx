import { createFileRoute } from '@tanstack/react-router';
import Pattern from '~/pattern/Pattern';

export const Route = createFileRoute('/pattern')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Pattern />;
}
