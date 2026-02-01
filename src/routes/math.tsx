import { createFileRoute } from '@tanstack/react-router';
import MathA from '~/math/a/MathA';

export const Route = createFileRoute('/math')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full">
      <MathA />
    </div>
  );
}
