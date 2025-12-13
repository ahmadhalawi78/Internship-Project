"use client";

import { useState, useEffect, useRef } from "react";

export default function SearchPanel() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef();
 const handleSearch = async () => {
    const res = await fetch(`/api/search?query=${query}`);
    const data = await res.json();
    setResults(data);
  };
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(1), 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  async function fetchResults(targetPage = 1) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search,
          category,
          page: targetPage,
          pageSize
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch");
      setResults(json.data || []);
      setTotal(json.total || 0);
      setPage(targetPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function onNext() {
    if (page * pageSize < total) fetchResults(page + 1);
  }
  function onPrev() {
    if (page > 1) fetchResults(page - 1);
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="makeup">Makeup</option>
          <option value="skincare">Skincare</option>
        </select>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        {results.length === 0 && !loading ? <div>No results</div> :
          results.map(item => (
            <div key={item.id} style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <small>{item.category} • ${item.price}</small>
            </div>
          ))
        }
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={onPrev} disabled={page === 1}>Prev</button>
        <span> Page {page} </span>
        <button onClick={onNext} disabled={(page * pageSize) >= total}>Next</button>
        <div>Total: {total}</div>
      </div>
    </div>
  );
}
