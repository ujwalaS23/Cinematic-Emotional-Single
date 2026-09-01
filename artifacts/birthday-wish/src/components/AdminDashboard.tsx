import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Visitor = {
  id?: string | number;
  name: string;
  email: string;
  visited_at: string;
  user_agent: string;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function AdminDashboard() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([]);
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const query = activeSearch ? `?q=${encodeURIComponent(activeSearch)}` : '';

    fetch(`/api/admin/visitors${query}`, { credentials: 'include' })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          throw new Error('This private dashboard is only available to the owner.');
        }
        if (!response.ok) throw new Error('Visitors could not be loaded right now.');
        return (await response.json()) as {
          visitors: Visitor[];
          totalVisitors: number;
          totalVisits: number;
          recentVisitors: Visitor[];
        };
      })
      .then((data) => {
        if (!cancelled) {
          setVisitors(Array.isArray(data.visitors) ? data.visitors : []);
          setTotalVisitors(Number(data.totalVisitors || 0));
          setTotalVisits(Number(data.totalVisits || 0));
          setRecentVisitors(Array.isArray(data.recentVisitors) ? data.recentVisitors : []);
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : 'Visitors could not be loaded.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeSearch, refreshKey]);

  const displayedVisitors = [...visitors].sort((a, b) => {
    const difference = new Date(a.visited_at).getTime() - new Date(b.visited_at).getTime();
    return sortOrder === 'newest' ? -difference : difference;
  });

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.assign('/');
  };

  return (
    <section className="min-h-[100dvh] px-4 py-10 md:py-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="paper-card paper-grain px-6 py-8 md:px-10"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <p style={{ fontFamily: 'Caveat, cursive', color: '#C4906A', fontSize: '1.2rem' }}>
                private keepsake
              </p>
              <h1
                style={{
                  fontFamily: '"Playfair Display", serif',
                  color: '#3D2B1F',
                  fontSize: '2rem',
                  fontStyle: 'italic',
                }}
              >
                Visitor dashboard
              </h1>
              <p style={{ fontFamily: '"Crimson Pro", serif', color: '#9E7E6E', fontSize: '1.1rem', marginTop: '0.4rem' }}>
                Only your approved Google account can view these visits.
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="self-start md:self-auto rounded-full px-4 py-2 transition-colors hover:bg-[#F8DCC8]"
              style={{
                border: '1px solid rgba(184, 92, 92, 0.3)',
                color: '#9E3A3A',
                fontFamily: '"Crimson Pro", serif',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className="self-start md:self-auto rounded-full px-4 py-2 transition-colors hover:bg-[#F8DCC8]"
              style={{
                border: '1px solid rgba(184, 92, 92, 0.3)',
                color: '#9E3A3A',
                fontFamily: '"Crimson Pro", serif',
                cursor: 'pointer',
              }}
            >
              Refresh
            </button>
          </div>

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
              {[
                ['Total visitors', totalVisitors],
                ['Total visits', totalVisits],
                ['Recent visitors', recentVisitors.length],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl px-4 py-4"
                  style={{ backgroundColor: 'rgba(248, 220, 200, 0.36)', border: '1px solid rgba(217, 165, 165, 0.35)' }}
                >
                  <p style={{ fontFamily: 'Caveat, cursive', color: '#C4906A', fontSize: '1.15rem' }}>{label}</p>
                  <p style={{ fontFamily: '"Playfair Display", serif', color: '#3D2B1F', fontSize: '1.8rem' }}>{value}</p>
                </div>
              ))}
            </div>
          )}

          <form
            className="flex flex-col sm:flex-row gap-3 mb-7"
            onSubmit={(event) => {
              event.preventDefault();
              setActiveSearch(search.trim());
            }}
          >
            <label htmlFor="visitor-search" className="sr-only">Search visitors</label>
            <input
              id="visitor-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email"
              className="flex-1 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#D9A5A5]"
              style={{
                backgroundColor: '#FFF9F3',
                border: '1px solid rgba(217, 165, 165, 0.55)',
                color: '#4A3428',
                fontFamily: '"Crimson Pro", serif',
                fontSize: '1.05rem',
              }}
            />
            <button
              type="submit"
              className="rounded-full px-6 py-3"
              style={{
                backgroundColor: '#B85C5C',
                color: '#FFF9F3',
                fontFamily: '"Crimson Pro", serif',
                cursor: 'pointer',
              }}
            >
              Search
            </button>
            {activeSearch && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setActiveSearch('');
                }}
                className="rounded-full px-5 py-3"
                style={{
                  border: '1px solid rgba(184, 92, 92, 0.35)',
                  color: '#9E3A3A',
                  fontFamily: '"Crimson Pro", serif',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
            <label className="sr-only" htmlFor="visitor-sort">Sort visitors</label>
            <select
              id="visitor-sort"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as 'newest' | 'oldest')}
              className="rounded-full px-4 py-3 outline-none"
              style={{
                backgroundColor: '#FFF9F3',
                border: '1px solid rgba(217, 165, 165, 0.55)',
                color: '#4A3428',
                fontFamily: '"Crimson Pro", serif',
                fontSize: '1.05rem',
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </form>

          {loading && (
            <p style={{ fontFamily: '"Crimson Pro", serif', color: '#6B4C3B', fontSize: '1.1rem' }}>
              Gathering the visitor notes…
            </p>
          )}
          {error && (
            <p role="alert" style={{ fontFamily: '"Crimson Pro", serif', color: '#9E3A3A', fontSize: '1.1rem' }}>
              {error}
            </p>
          )}
          {!loading && !error && visitors.length === 0 && (
            <p style={{ fontFamily: '"Crimson Pro", serif', color: '#6B4C3B', fontSize: '1.1rem' }}>
              No visitors match this search yet.
            </p>
          )}
          {!loading && !error && visitors.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ fontFamily: '"Crimson Pro", serif', color: '#4A3428' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(217, 165, 165, 0.55)', color: '#9E7E6E' }}>
                    <th className="px-3 py-3 font-normal">Visitor name</th>
                    <th className="px-3 py-3 font-normal">Email address</th>
                    <th className="px-3 py-3 font-normal whitespace-nowrap">Visited at</th>
                    <th className="px-3 py-3 font-normal">Browser</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedVisitors.map((visitor) => (
                    <tr key={`${visitor.email}-${visitor.visited_at}`} style={{ borderBottom: '1px solid rgba(244, 233, 221, 0.9)' }}>
                      <td className="px-3 py-4">{visitor.name}</td>
                      <td className="px-3 py-4">{visitor.email}</td>
                      <td className="px-3 py-4 whitespace-nowrap">{formatDate(visitor.visited_at)}</td>
                      <td className="px-3 py-4 max-w-xs truncate" title={visitor.user_agent}>{visitor.user_agent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}