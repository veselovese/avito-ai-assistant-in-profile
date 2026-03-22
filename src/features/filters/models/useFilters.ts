import { create } from 'zustand';

type State = {
  search: string;
  categories: string[];
  needsRevision: boolean;
  sortColumn: 'title' | 'createdAt';
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
};

type Actions = {
  setSearch: (v: string) => void;
  setCategories: (v: string[]) => void;
  setNeedsRevision: (v: boolean) => void;
  setSort: (column: State['sortColumn'], direction: State['sortDirection']) => void;
  setPage: (page: number) => void;
  reset: () => void;
};

export const useFilters = create<State & Actions>((set) => ({
  search: '',
  categories: [],
  needsRevision: false,
  sortColumn: 'createdAt',
  sortDirection: 'desc',
  page: 1,
  pageSize: 10,

  setSearch: (search) => set({ search, page: 1 }),
  setCategories: (categories) => set({ categories, page: 1 }),
  setNeedsRevision: (needsRevision) => set({ needsRevision, page: 1 }),
  setSort: (sortColumn, sortDirection) => set({ sortColumn, sortDirection }),
  setPage: (page) => set({ page }),

  reset: () =>
    set({
      search: '',
      categories: [],
      needsRevision: false,
      sortColumn: 'createdAt',
      sortDirection: 'desc',
      page: 1,
    }),
}));