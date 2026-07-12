/**
 * DataTable — reusable table with search, sorting, loading skeletons, empty state,
 * pagination, and PDF export.
 *
 * Props:
 *   title        {string}       — toolbar heading
 *   columns      {Array}        — [{ key, header, render?, width?, align?, sortable? }]
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
 *   pdfTitle     {string}       — title used in the PDF report header
 */
import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  pdfTitle,
}) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, dir: 'asc' });

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)),
    );
  }, [data, query, searchable, searchKeys]);

  // Column sorting
  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? '';
      const bVal = b[sortConfig.key] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortConfig.dir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortConfig]);

  // Paginate
  const rows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleSort = (col) => {
    if (!col.sortable) return;
    setSortConfig((prev) =>
      prev.key === col.key
        ? { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key: col.key, dir: 'asc' },
    );
    setPage(1);
  };

  const getSortIcon = (col) => {
    if (!col.sortable) return null;
    if (sortConfig.key !== col.key) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
    return <span style={{ marginLeft: 4, color: 'var(--d-accent)' }}>{sortConfig.dir === 'asc' ? '↑' : '↓'}</span>;
  };

  // PDF Export — uses the currently filtered + sorted data
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const exportTitle = pdfTitle || title || 'Report';

    // Header
    doc.setFontSize(18);
    doc.setTextColor(44, 38, 64);
    doc.text(exportTitle, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(120, 113, 142);
    doc.text(`Generated: ${new Date().toLocaleString()}  |  Total records: ${sorted.length}`, 14, 27);

    // Build table columns (skip columns without a plain key-based value)
    const pdfCols = columns
      .filter((c) => !c.pdfSkip)
      .map((c) => ({ header: c.header, dataKey: c.key }));

    // Build table rows from raw data (skip render functions for PDF)
    const pdfRows = sorted.map((row) =>
      Object.fromEntries(
        pdfCols.map((c) => [c.dataKey, String(row[c.dataKey] ?? '')])
      )
    );

    autoTable(doc, {
      startY: 33,
      columns: pdfCols,
      body: pdfRows,
      headStyles: {
        fillColor: [123, 159, 232],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      alternateRowStyles: { fillColor: [245, 243, 255] },
      styles: { fontSize: 8.5, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    doc.save(`${exportTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
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
          {/* PDF Export Button */}
          {!loading && data.length > 0 && (
            <button
              className="d-btn d-btn-secondary d-btn-sm"
              onClick={handleExportPDF}
              title="Export to PDF"
              style={{ gap: 6 }}
            >
              📄 PDF
            </button>
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
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: col.sortable ? 'none' : undefined,
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => handleSort(col)}
                >
                  {col.header}
                  {getSortIcon(col)}
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
