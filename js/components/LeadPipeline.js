// js/components/LeadPipeline.js
const { createElement: h } = React;

export function LeadPipeline({ jobs, onSelectJob, onUpdateStatus, onDeleteJob }) {
  const incomingJobs = jobs.filter(j => j.status === 'INCOMING');
  const queueJobs = jobs.filter(j => j.status === 'AVAILABLE');
  const claimedJobs = jobs.filter(j => j.status === 'CLAIMED');

  return h('div', { className: 'space-y-6' }, [
    h('div', { key: 'pipeline-header', className: 'flex items-center justify-between' }, [
      h('div', null, [
        h('h2', { className: 'text-lg font-bold text-white' }, 'FTD Lead Dispatch Pipeline'),
        h('p', { className: 'text-xs text-slate-400' }, 'Qualify incoming phone volume, attach site inspection logs, and publish or reset leads.')
      ])
    ]),

    h('div', { key: 'kanban-board', className: 'grid grid-cols-1 md:grid-cols-3 gap-4' }, [
      
      // COLUMN 1: INCOMING CALLS
      h('div', { className: 'bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col' }, [
        h('div', { className: 'flex items-center justify-between mb-3 pb-2 border-b border-slate-800' }, [
          h('span', { className: 'text-xs font-bold text-slate-300 flex items-center gap-1.5' }, [
            h('span', { className: 'w-2 h-2 rounded-full bg-blue-400' }),
            'Incoming / Uninspected Calls'
          ]),
          h('span', { className: 'text-xs bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-400' }, incomingJobs.length)
        ]),

        h('div', { className: 'space-y-3 flex-1' }, 
          incomingJobs.length === 0 
            ? h('p', { className: 'text-xs text-slate-600 text-center py-6' }, 'No uninspected calls pending.')
            : incomingJobs.map(job => 
                h('div', { 
                  key: job.id, 
                  onClick: () => onSelectJob(job),
                  className: 'bg-slate-950 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl space-y-2 cursor-pointer transition-all' 
                }, [
                  h('div', { className: 'flex justify-between items-start gap-2' }, [
                    h('h4', { className: 'text-xs font-bold text-white' }, job.title),
                    h('span', { className: 'text-[10px] text-emerald-400 font-bold' }, `$${job.estimatedValue || 0}`)
                  ]),
                  h('p', { className: 'text-[11px] text-slate-400 line-clamp-2' }, job.address),
                  
                  h('div', { className: 'pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2' }, [
                    h('span', { className: 'text-[11px] text-blue-400 hover:underline' }, 'View & Edit Notes →'),
                    h('button', {
                      onClick: (e) => { e.stopPropagation(); onUpdateStatus(job.id, 'AVAILABLE'); },
                      className: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-1 rounded text-[10px] font-bold hover:bg-amber-500 hover:text-slate-950 transition-all'
                    }, 'Publish to Queue →')
                  ])
                ])
              )
        )
      ]),

      // COLUMN 2: LIVE FCFS QUEUE
      h('div', { className: 'bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col' }, [
        h('div', { className: 'flex items-center justify-between mb-3 pb-2 border-b border-slate-800' }, [
          h('span', { className: 'text-xs font-bold text-amber-400 flex items-center gap-1.5' }, [
            h('span', { className: 'w-2 h-2 rounded-full bg-amber-400 animate-pulse' }),
            'Live Sub Queue (FCFS)'
          ]),
          h('span', { className: 'text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold' }, queueJobs.length)
        ]),

        h('div', { className: 'space-y-3 flex-1' }, 
          queueJobs.length === 0 
            ? h('p', { className: 'text-xs text-slate-600 text-center py-6' }, 'No active leads in live queue.')
            : queueJobs.map(job => 
                h('div', { 
                  key: job.id, 
                  onClick: () => onSelectJob(job),
                  className: 'bg-slate-950 border border-amber-500/30 hover:border-amber-500 p-3.5 rounded-xl space-y-2 cursor-pointer transition-all' 
                }, [
                  h('div', { className: 'flex justify-between items-start gap-2' }, [
                    h('h4', { className: 'text-xs font-bold text-amber-300' }, job.title),
                    h('span', { className: 'text-[10px] text-emerald-400 font-bold' }, `$${job.estimatedValue || 0}`)
                  ]),
                  h('p', { className: 'text-[11px] text-slate-400' }, job.address),
                  
                  job.siteNotes && h('div', { className: 'bg-slate-900 p-2 rounded text-[10px] text-slate-300' }, [
                    h('strong', { className: 'text-slate-500 block' }, 'Site Visit Notes:'),
                    job.siteNotes
                  ]),

                  h('div', { className: 'pt-2 border-t border-slate-800 flex justify-between items-center' }, [
                    h('span', { className: 'text-[11px] text-amber-400 hover:underline' }, 'Inspect & Edit Details →'),
                    h('span', { className: 'text-[10px] text-slate-500 italic' }, 'Waiting for Sub...')
                  ])
                ])
              )
        )
      ]),

      // COLUMN 3: HANDED OFF / CLAIMED (NOW FULLY CLICKABLE)
      h('div', { className: 'bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col' }, [
        h('div', { className: 'flex items-center justify-between mb-3 pb-2 border-b border-slate-800' }, [
          h('span', { className: 'text-xs font-bold text-emerald-400 flex items-center gap-1.5' }, [
            h('span', { className: 'w-2 h-2 rounded-full bg-emerald-400' }),
            'Handed Off & Claimed'
          ]),
          h('span', { className: 'text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold' }, claimedJobs.length)
        ]),

        h('div', { className: 'space-y-3 flex-1' }, 
          claimedJobs.length === 0 
            ? h('p', { className: 'text-xs text-slate-600 text-center py-6' }, 'No claimed leads yet.')
            : claimedJobs.map(job => {
                const ftdCut = Math.round((job.estimatedValue || 0) * ((job.referralFeePct || 8) / 100));

                return h('div', { 
                  key: job.id, 
                  onClick: () => onSelectJob(job),
                  className: 'bg-slate-950 border border-emerald-500/30 hover:border-emerald-400 p-3.5 rounded-xl space-y-2 cursor-pointer transition-all group' 
                }, [
                  h('div', { className: 'flex justify-between items-start gap-2' }, [
                    h('h4', { className: 'text-xs font-bold text-white group-hover:text-emerald-300 transition-colors' }, job.title),
                    h('span', { className: 'text-[10px] text-emerald-400 font-bold' }, `$${job.estimatedValue || 0}`)
                  ]),
                  h('div', { className: 'bg-emerald-950/40 border border-emerald-800/40 p-2 rounded text-[10px] text-emerald-300' }, [
                    h('strong', { className: 'block text-slate-400' }, 'Assigned Subcontractor:'),
                    job.claimedBy || 'Assigned Partner'
                  ]),
                  h('div', { className: 'text-[10px] text-slate-400 flex justify-between items-center pt-1 border-t border-slate-800/60' }, [
                    h('span', { className: 'text-amber-400 font-bold group-hover:underline' }, '⚙️ Un-assign / Edit →'),
                    h('span', { className: 'font-bold text-emerald-400' }, `+$${ftdCut} FTD Cut`)
                  ])
                ]);
              })
        )
      ])

    ])
  ]);
}
