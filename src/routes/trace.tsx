import { createFileRoute } from '@tanstack/react-router';
import Trace from '~/trace/Trace';

export const Route = createFileRoute('/trace')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Trace />;
}
