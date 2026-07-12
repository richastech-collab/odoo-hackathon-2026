/**
 * DataTable — reusable table with search, loading skeletons, empty state, pagination.
 *
 * Props:
 *   title        {string}       — toolbar heading
 *   columns      {Array}        — [{ key, header, render?, width?, align? }]
 *   data         {Array}        — rows of objects
 *   loading      {boolean}      — shows skeleton rows
 *   error        {string|null}  — shows error strip
 *   emptyIcon    {string}       — emoji for empty state
 *   emptyTitle   {string}
 *   emptyDesc    {string}
 *   actions      {ReactNode}    — toolbar right-side actions (buttons, etc.)
 *   searchable   {boolean}      — enables client-side search
 *   searchKeys   {string[]}     — which object keys to search against
 *   pageSize     {number}       — rows per page (default 10)
 *   rowKey       {string}       — key to use as React key (default 'id')
 *   onRowClick   {function}     — optional row click handler
 */
import React, { useState, useMemo } from 'react';

const SKELETON_ROWS = 6;

const DataTable = ({
  title,
  columns = [],
  data = [],
  loading = false,
  error = null,
  emptyIcon = '📋',
  emptyTitle = 'No records found',
  emptyDesc = 'There is nothing to display here yet.',
  actions,
  searchable = false,
  searchKeys = [],
  pageSize = 10,
  rowKey = 'id',
  onRowClick,
}) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)),
    );
  }, [data, query, searchable, searchKeys]);

  // Reset to page 1 on search
  const rows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="d-table-wrap">
      {/* Toolbar */}
      <div className="d-table-toolbar">
        <span className="d-table-title">{title}</span>
        <div className="d-table-actions">
          {searchable && (
            <div className="d-table-search">
              <span className="d-table-search-icon">🔍</span>
              <input
                className="d-input"
                placeholder="Search…"
                value={query}
                onChange={handleSearch}
                aria-label="Search table"
              />
            </div>
          )}
          {actions}
        </div>
      </div>

      {/* Error strip */}
      {error && (
        <div className="d-alert d-alert-error" style={{ margin: '12px 20px', borderRadius: 10 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Table */}
      <div className="d-table-container">
        <table className="d-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    textAlign: col.align || 'left',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, ri) => (
                <tr key={ri}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      <div
                        className="d-skeleton"
                        style={{ height: 16, width: col.skeletonWidth || '80%' }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 0 }}>
                  <div className="d-empty-state">
                    <span className="d-empty-icon">{emptyIcon}</span>
                    <span className="d-empty-title">{emptyTitle}</span>
                    <span className="d-empty-desc">{emptyDesc}</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row[rowKey] ?? JSON.stringify(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / pagination */}
      {!loading && data.length > 0 && (
        <div className="d-table-footer">
          <span>
            {filtered.length === 0
              ? 'No results'
              : `Showing ${Math.min((page - 1) * pageSize + 1, filtered.length)}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}`}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="d-btn d-btn-secondary d-btn-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span style={{
              display: 'flex', alignItems: 'center',
              padding: '0 12px', fontWeight: 600, fontSize: '0.8rem',
            }}>
              {page} / {totalPages}
            </span>
            <button
              className="d-btn d-btn-secondary d-btn-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
