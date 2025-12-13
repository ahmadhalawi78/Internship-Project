'use client';

import { useState } from 'react';

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
        console.log('Found:', data.data.length, 'items');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Search Items</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type 'iphone', 'camera', etc..."
            className="flex-1 p-3 border rounded-lg"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>
      
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Searching...</p>
        </div>
      )}
      
      {!loading && results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Results ({results.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  {item.is_urgent && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">URGENT</span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <div className="flex gap-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{item.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!loading && results.length === 0 && search && (
        <div className="text-center py-8">
          <p className="text-gray-600">No results found for "{search}"</p>
        </div>
      )}
      
      {/* Test buttons */}
      <div className="mt-8 pt-8 border-t">
        <p className="text-sm text-gray-600 mb-2">Quick tests:</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSearch('iphone');
              handleSearch(new Event('submit'));
            }}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Test: iphone
          </button>
          <button
            onClick={() => {
              setSearch('camera');
              handleSearch(new Event('submit'));
            }}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Test: camera
          </button>
          <button
            onClick={() => {
              setSearch('');
              handleSearch(new Event('submit'));
            }}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Show All
          </button>
        </div>
      </div>
    </div>
  );
}