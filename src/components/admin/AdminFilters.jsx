const AdminFilters = ({
  search,
  setSearch,
  searchPlaceholder = "Search...",
  filters = [],
}) => {
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {filters.map((filter) => (
        <select
          key={filter.name}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          style={styles.select}
        >
          {filter.options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
    width: "100%",
  },

  input: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    minWidth: "250px",
  },

  select: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
  },
};

export default AdminFilters;