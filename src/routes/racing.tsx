import { createFileRoute } from '@tanstack/react-router';
import Racing from '~/racing/Racing';

export const Route = createFileRoute('/racing')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Racing />;
}
