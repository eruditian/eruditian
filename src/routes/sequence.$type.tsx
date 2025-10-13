import { createFileRoute } from '@tanstack/react-router';
import Sequence from '~/sequence/Sequence';
import { sequence_types, SequenceType } from '~/sequence/sequence_extras';

export const Route = createFileRoute('/sequence/$type')({
  component: RouteComponent,
});

const parseType = (sizeParam: string): SequenceType => {
  return sequence_types.includes(sizeParam as SequenceType)
    ? (sizeParam as SequenceType)
    : 'numbers';
};

function RouteComponent() {
  const { type } = Route.useParams();
  return <Sequence type={parseType(type)} />;
}
