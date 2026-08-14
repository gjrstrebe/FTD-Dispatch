// js/components/DetailsModal.js
const { useState, createElement: h } = React;

export function DetailsModal({ job, userRole, currentSub, onClaim, onSaveNotes, onDeleteJob, onClose }) {
  const [siteNotes, setSiteNotes] = useState(job.siteNotes || '');
  const [siteVisitDone, setSiteVisitDone] = useState(job.siteVisitDone || false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const ftdCut = Math.round((job.estimatedValue || 0) * ((job.referralFeePct || 8) / 100));

  const handleSaveNotes = (e) => {
    e.preventDefault();
    onSaveNotes(job.id, siteNotes, siteVisitDone);
    onClose();
  };

  return h('div', { className: 'fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto' }, [
    h('div', { className: 'bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-4 text-xs shadow-2xl relative my-8' }, [
      
      // HEADER
      h('div', { className: 'flex justify-between items-start border-b border-slate-800 pb-3' }, [
        h('div', null, [
          h('span', { className: 'text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase' }, job.category || 'Drywall'),
          h('h3', { className: 'text-base font-bold text-white mt-1' }, job.title),
          h('p', { className: 'text-xs text-slate-400 mt-0.5' }, job.address)
        ]),
        h('button', { onClick: onClose, className: 'text-slate-400 hover:text-white text-lg font-bold' }, '✕')
      ]),

      // FINANCIAL & DISPATCH SUMMARY
      h('div', { className: 'grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800' }, [
        h('div', null, [
          h('span', { className: 'text-[10px] text-slate-500 font-bold uppercase block' }, 'Est. Job Value'),
          h('span', { className: 'text-base font-black text-emerald-400 font-mono' }, `$${(job.estimatedValue || 0).toLocaleString()}`)
        ]),
        h('div', { className: 'text-right' }, [
          h('span', { className: 'text-[10px] text-slate-500 font-bold uppercase block' }, `FTD Referral Fee (${job.referralFeePct || 8}%)`),
          h('span', { className: 'text-base font-black text-amber-400 font-mono' }, `+$${ftdCut.toLocaleString()}`)
        ])
      ]),

      // SCOPE OF WORK
      h('div', { className: 'space-y-1' }, [
        h('h4', { className: 'text-xs font-bold text-slate-300' }, 'Scope of Work'),
        h('div', { className: 'bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed' }, job.scope)
      ]),

      // CLAIM STATUS / CLAIM BUTTON FOR SUBS
      job.status === 'CLAIMED' ? (
        h('div', { className: 'bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-xl space-y-1' }, [
          h('span', { className: 'text-[10px] text-emerald-400 font-bold uppercase block' }, '✓ Claimed & Assigned Subcontractor'),
          h('p', { className: 'text-xs text-white font-medium' }, job.claimedBy || 'Assigned Partner')
        ])
      ) : userRole === 'sub' && (
        h('button', {
          onClick: () => onClaim(job),
          className: 'w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg transition-all active:scale-95'
        }, '⚡ CLAIM THIS JOB NOW')
      ),

      // SITE INSPECTOR NOTES (ADMIN & EDITABLE)
      userRole === 'admin' && h('form', { onSubmit: handleSaveNotes, className: 'space-y-3 pt-2 border-t border-slate-800' }, [
        h('div', { className: 'flex justify-between items-center' }, [
          h('h4', { className: 'text-xs font-bold text-slate-300' }, 'Site Visit & Inspector Log'),
          h('label', { className: 'flex items-center gap-2 text-xs text-slate-400 cursor-pointer' }, [
            h('input', {
              type: 'checkbox',
              checked: siteVisitDone,
              onChange: (e) => setSiteVisitDone(e.target.checked),
              className: 'rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0'
            }),
            'Site Visit Completed'
          ])
        ]),

        h('textarea', {
          rows: 3,
          value: siteNotes,
          onChange: (e) => setSiteNotes(e.target.value),
          placeholder: 'Log ceiling heights, framing conditions, moisture readings, or prep needed before sub arrives...',
          className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500'
        }),

        h('div', { className: 'flex justify-between items-center pt-2' }, [
          h('button', {
            type: 'button',
            onClick: () => setShowDeleteConfirm(true),
            className: 'text-xs text-red-400 hover:underline'
          }, 'Delete Job Record'),

          h('button', {
            type: 'submit',
            className: 'bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs border border-slate-700'
          }, 'Save Inspection Notes')
        ])
      ]),

      // DELETE CONFIRMATION OVERLAY
      showDeleteConfirm && h('div', { className: 'bg-slate-950 p-4 rounded-xl border border-red-500/50 space-y-3 text-center' }, [
        h('p', { className: 'text-xs text-red-300 font-bold' }, 'Permanently delete this job from Firestore?'),
        h('div', { className: 'flex gap-2' }, [
          h('button', {
            type: 'button',
            onClick: () => setShowDeleteConfirm(false),
            className: 'w-1/2 py-2 text-xs text-slate-400 hover:text-white'
          }, 'Cancel'),
          h('button', {
            type: 'button',
            onClick: () => onDeleteJob(job.id),
            className: 'w-1/2 bg-red-500 text-white font-bold py-2 rounded-xl text-xs'
          }, 'Confirm Delete')
        ])
      ])

    ])
  ]);
}
