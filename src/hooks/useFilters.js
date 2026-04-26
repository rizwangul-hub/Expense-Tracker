import { useSelector, useDispatch } from 'react-redux';
import { setFilters, setSearchTerm, setSortBy, resetFilters } from '../store/slices/filterSlice';

export const useFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.filters);

  return {
    ...filters,
    updateFilters: (newFilters) => dispatch(setFilters(newFilters)),
    updateSearch: (term) => dispatch(setSearchTerm(term)),
    updateSort: (sort) => dispatch(setSortBy(sort)),
    clearFilters: () => dispatch(resetFilters())
  };
};
