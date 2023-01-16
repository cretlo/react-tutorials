const SearchBar = ({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) => {
  return (
    <form>
      <input
        type='text'
        value={filterText}
        onChange={e => onFilterTextChange(e.target.value)}
        placeholder='Search...'
      />
      <label>
        <input
          type='checkbox'
          checked={inStockOnly}
          onChange={() => onInStockOnlyChange(!inStockOnly)}
        />{' '}
        Only show products in stock
      </label>
    </form>
  );
};

export default SearchBar;
