import { createFileRoute } from '@tanstack/react-router';
import Piano from '~/notes/Piano';

export const Route = createFileRoute('/piano')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Piano />;
}
