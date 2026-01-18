import { createFileRoute } from '@tanstack/react-router';
import Geo from '~/geo/Geo';

export const Route = createFileRoute('/geo')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Geo />;
}
