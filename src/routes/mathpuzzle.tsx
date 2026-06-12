import { createFileRoute } from '@tanstack/react-router';
import MathPuzzle from '~/math/puzzle/MathPuzzle';

export const Route = createFileRoute('/mathpuzzle')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full">
      <MathPuzzle />
    </div>
  );
}
