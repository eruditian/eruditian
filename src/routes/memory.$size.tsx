import { createFileRoute } from '@tanstack/react-router';
import Memory from '../memory/Memory';

export const Route = createFileRoute('/memory/$size')({
  component: RouteComponent,
});

const allowedSizes = [8, 12, 16, 18, 20, 24, 28];
const parseSize = (sizeParam: string): number => {
  const int = parseInt(sizeParam, 10);
  return allowedSizes.includes(int) ? int : 12;
};

function RouteComponent() {
  const { size } = Route.useParams();
  return <Memory count={parseSize(size)} />;
}
