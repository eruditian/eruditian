import { createFileRoute } from '@tanstack/react-router';
import Catch from '~/catch/Catch';

export const Route = createFileRoute('/catch')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Catch />;
}
