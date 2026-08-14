// js/components/Analytics.js
const { createElement: h } = React;

export function Analytics({ jobs }) {
  const claimedJobs = jobs.filter(j => j.status === 'CLAIMED');
  
  const totalVolume = jobs.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const claimedVolume = claimedJobs.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  
  const projectedRevenue = claimedJobs.reduce((acc, curr) => {
    const feePct = curr.referralFeePct || 8;
    return acc + Math.round((curr.estimatedValue || 0) * (feePct / 100));
  }, 0);

  return h('div', { className: 'space-y-6' }, [
    h('div', { key: 'analytics-header' }, [
      h('h2', { className: 'text-lg font-bold text-white' }, 'Referral Revenue & Network Metrics'),
      h('p', { className: 'text-xs text-slate-400' }, 'Financial breakdown of job volume dispatched and incoming FTD referral cuts.')
    ]),

    // METRICS CARDS
    h('div', { key: 'metrics-grid', className: 'grid grid-cols-1 md:grid-cols-3 gap-4' }, [
      h('div', { className: 'bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1' }, [
        h('span', { className: 'text-xs text-slate-400 font-medium' }, 'Projected FTD Referral Cut'),
        h('p', { className: 'text-3xl font-black text-amber-400' }, `$${projectedRevenue.toLocaleString()}`),
        h('p', { className: 'text-[11px] text-slate-500' }, 'Earned from claimed sub leads')
      ]),

      h('div', { className: 'bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1' }, [
        h('span', { className: 'text-xs text-slate-400 font-medium' }, 'Claimed Job Volume'),
        h('p', { className: 'text-3xl font-black text-emerald-400' }, `$${claimedVolume.toLocaleString()}`),
        h('p', { className: 'text-[11px] text-slate-500' }, `${claimedJobs.length} active jobs handed off`)
      ]),

      h('div', { className: 'bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1' }, [
        h('span', { className: 'text-xs text-slate-400 font-medium' }, 'Total Pipeline Value'),
        h('p', { className: 'text-3xl font-black text-slate-200' }, `$${totalVolume.toLocaleString()}`),
        h('p', { className: 'text-[11px] text-slate-500' }, `${jobs.length} total leads logged across system`)
      ])
    ]),

    // CLAIMED LEADS REVENUE BREAKDOWN TABLE
    h('div', { key: 'revenue-table-card', className: 'bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4' }, [
      h('h3', { className: 'text-sm font-bold text-white' }, 'Claimed Referral Ledger'),

      claimedJobs.length === 0
        ? h('p', { className: 'text-xs text-slate-500 py-4 text-center' }, 'No claimed jobs to report in ledger yet.')
        : h('div', { className: 'overflow-x-auto' }, [
            h('table', { className: 'w-full text-left text-xs text-slate-300' }, [
              h('thead', { className: 'bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]' }, [
                h('tr', null, [
                  h('th', { className: 'p-3' }, 'Job Title / Address'),
                  h('th', { className: 'p-3' }, 'Assigned Sub'),
                  h('th', { className: 'p-3 text-right' }, 'Job Total'),
                  h('th', { className: 'p-3 text-right' }, 'FTD Fee %'),
                  h('th', { className: 'p-3 text-right' }, 'FTD Cut')
                ])
              ]),
              h('tbody', { className: 'divide-y divide-slate-800/60' }, 
                claimedJobs.map(job => {
                  const feePct = job.referralFeePct || 8;
                  const cut = Math.round((job.estimatedValue || 0) * (feePct / 100));

                  return h('tr', { key: job.id, className: 'hover:bg-slate-800/30' }, [
                    h('td', { className: 'p-3 font-medium text-white' }, job.title),
                    h('td', { className: 'p-3 text-slate-400' }, job.claimedBy || 'Assigned Partner'),
                    h('td', { className: 'p-3 text-right text-slate-200' }, `$${(job.estimatedValue || 0).toLocaleString()}`),
                    h('td', { className: 'p-3 text-right text-amber-400 font-mono' }, `${feePct}%`),
                    h('td', { className: 'p-3 text-right text-emerald-400 font-bold font-mono' }, `+$${cut.toLocaleString()}`)
                  ]);
                })
              )
            ])
          ])
    ])
  ]);
}
