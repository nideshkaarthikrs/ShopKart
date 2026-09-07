function SearchBar({ search, setSearch, category, setCategory, sort, setSort }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      <input 
        type="text" 
        placeholder="Search products..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <select 
        value={category} 
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Books">Books</option>
        <option value="Home">Home</option>
      </select>
      <select 
        value={sort} 
        onChange={(e) => setSort(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="">Sort By</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  )
}

export default SearchBar
