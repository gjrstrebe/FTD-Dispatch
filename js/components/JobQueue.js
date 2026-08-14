// js/components/JobQueue.js
const { useState, createElement: h } = React;

export function JobQueue({ jobs, categories, userRole, currentSub, onSelectJob, onClaimJob }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const availableQueue = jobs.filter(j => j.status === 'AVAILABLE');
  
  const filteredQueue = availableQueue.filter(j => {
    const matchesSearch = (j.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (j.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (j.scope || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || j.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalValueAvailable = availableQueue.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  return h('div', { className: 'space-y-6' }, [
    
    // STATS BAR
    h('div', { key: 'stats-bar', className: 'grid grid-cols-2 md:grid-cols-3 gap-3' }, [
      h('div', { className: 'bg-slate-900 border border-slate-800 rounded-2xl p-4' }, [
        h('span', { className: 'text-xs text-slate-400' }, 'Ready in Queue'),
        h('p', { className: 'text-2xl font-black text-amber-400 mt-1' }, `${availableQueue.length} Jobs`),
        h('p', { className: 'text-[11px] text-slate-500 mt-0.5' }, `$${totalValueAvailable.toLocaleString()} Total Value`)
      ]),
      h('div', { className: 'bg-slate-900 border border-slate-800 rounded-2xl p-4' }, [
        h('span', { className: 'text-xs text-slate-400' }, 'Handed Off to Subs'),
        h('p', { className: 'text-2xl font-black text-emerald-400 mt-1' }, `${jobs.filter(j => j.status === 'CLAIMED').length} Claimed`),
        h('p', { className: 'text-[11px] text-slate-500 mt-0.5' }, 'Self-Managed by Partners')
      ]),
      h('div', { className: 'bg-slate-900 border border-slate-800 rounded-2xl p-4 col-span-2 md:col-span-1' }, [
        h('span', { className: 'text-xs text-slate-400 font-medium' }, 'Sync Status'),
        h('p', { className: 'text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1.5' }, [
          h('span', { className: 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse' }),
          'Cloud Firestore Live'
        ])
      ])
    ]),

    // SEARCH & CATEGORY FILTER BAR
    h('div', { key: 'filter-bar', className: 'flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800' }, [
      h('h2', { className: 'text-base font-bold text-white flex items-center gap-2' }, '⚡ First-Come, First-Serve Job Board'),
      
      h('div', { className: 'flex items-center gap-2 w-full sm:w-auto' }, [
        h('input', {
          type: 'text',
          placeholder: 'Search location, scope...',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: 'bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 w-full sm:w-48 focus:outline-none focus:border-amber-500'
        }),

        h('select', {
          value: categoryFilter,
          onChange: (e) => setCategoryFilter(e.target.value),
          className: 'bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none focus:border-amber-500'
        }, [
          h('option', { key: 'cat-all', value: 'ALL' }, 'All Categories'),
          categories.map(c => h('option', { key: c.id, value: c.name }, c.name))
        ])
      ])
    ]),

    // QUEUE CARDS GRID
    filteredQueue.length === 0 
      ? h('div', { key: 'empty-queue', className: 'bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center' }, [
          h('p', { className: 'text-sm font-semibold text-slate-400' }, 'No jobs currently available in queue'),
          h('p', { className: 'text-xs text-slate-600 mt-1' }, 'New incoming leads will appear here in real time as they are dispatched.')
        ])
      : h('div', { key: 'cards-grid', className: 'grid grid-cols-1 md:grid-cols-2 gap-5' }, 
          filteredQueue.map(job => {
            const ftdCut = Math.round((job.estimatedValue || 0) * ((job.referralFeePct || 8) / 100));
            
            return h('div', { key: job.id, className: 'bg-slate-900 border border-amber-500/30 hover:border-amber-500 rounded-2xl p-5 space-y-3 relative transition-all' }, [
              
              h('div', { className: 'flex justify-between items-start gap-2' }, [
                h('div', null, [
                  h('span', { className: 'text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase' }, job.category || 'Drywall'),
                  h('h3', { className: 'text-base font-bold text-white mt-1.5' }, job.title),
                  h('p', { className: 'text-xs text-slate-400 mt-0.5' }, job.address)
                ]),
                h('div', { className: 'bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-right flex-shrink-0' }, [
                  h('span', { className: 'text-[10px] text-slate-400 block uppercase font-bold' }, 'Job Payout'),
                  h('span', { className: 'text-lg font-black text-emerald-400' }, `$${(job.estimatedValue || 0).toLocaleString()}`)
                ])
              ]),

              h('div', { className: 'bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300' }, [
                h('strong', { className: 'text-slate-400 block mb-0.5 text-[10px] uppercase font-bold' }, 'Scope of Work'),
                job.scope
              ]),

              job.siteNotes && h('div', { className: 'bg-slate-800/40 p-2 rounded-lg text-[11px] text-slate-400 italic' }, `"${job.siteNotes}"`),

              h('div', { className: 'pt-2 border-t border-slate-800 flex justify-between items-center' }, [
                h('button', {
                  onClick: () => onSelectJob(job),
                  className: 'text-xs text-slate-400 hover:text-white underline'
                }, 'View Details & Notes'),

                userRole === 'sub' 
                  ? h('button', {
                      onClick: () => onClaimJob(job),
                      className: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all'
                    }, '⚡ CLAIM THIS JOB NOW')
                  : h('span', { className: 'text-xs text-emerald-400 font-bold' }, `FTD Cut: +$${ftdCut}`)
              ])

            ]);
          })
        )

  ]);
}
