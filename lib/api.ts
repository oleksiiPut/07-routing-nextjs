import axios from 'axios';
import type { Note, NoteTag } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';

const noteApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export type DeleteNoteResponse = Note;

export const fetchNotes = async ({
  page,
  perPage = 12,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await noteApi.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await noteApi.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (newNote: CreateNoteParams): Promise<Note> => {
  const { data } = await noteApi.post<Note>('/notes', newNote);
  return data;
};

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const { data } = await noteApi.delete<DeleteNoteResponse>(`/notes/${id}`);
  return data;
};