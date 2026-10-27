import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NotesByTagProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesByTag({ params }: NotesByTagProps) {
  const { slug } = await params;
  const isAll = slug[0] === 'all';

  if (slug.length !== 1 || (!isAll && !TAGS.includes(slug[0] as NoteTag))) {
    notFound();
  }
  const tag = isAll ? undefined : (slug[0] as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag ?? 'all', 1, ''],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={slug[0]} tag={tag} />
    </HydrationBoundary>
  );
}