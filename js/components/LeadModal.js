// js/components/LeadModal.js
const { useState, createElement: h } = React;

export function LeadModal({ categories, onSaveJob, onSaveCategory, onDeleteCategory, userRole, onClose }) {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [scope, setScope] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(1200);
  const [referralFeePct, setReferralFeePct] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || 'Taping & Finishing');
  const [status, setStatus] = useState('AVAILABLE'); // 'INCOMING' | 'AVAILABLE'

  // Category Management State
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !address || !scope) return;

    onSaveJob({
      title,
      address,
      scope,
      estimatedValue: Number(estimatedValue),
      referralFeePct: Number(referralFeePct),
      category: selectedCategory,
      status,
      siteVisitDone: false,
      siteNotes: ''
    });

    onClose();
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    onSaveCategory(newCategoryName.trim());
    setSelectedCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  return h('div', { className: 'fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto' }, [
    h('div', { className: 'bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-4 text-xs shadow-2xl relative my-8' }, [
      
      // HEADER
      h('div', { className: 'flex justify-between items-center pb-3 border-b border-slate-800' }, [
        h('h3', { className: 'text-base font-bold text-white flex items-center gap-2' }, '📋 Post New Drywall Lead'),
        h('button', { onClick: onClose, className: 'text-slate-400 hover:text-white text-lg font-bold' }, '✕')
      ]),

      // FORM
      h('form', { onSubmit: handleSubmit, className: 'space-y-3' }, [
        
        h('div', null, [
          h('label', { className: 'block text-slate-400 mb-1' }, 'Job Title / Client Name'),
          h('input', {
            required: true,
            type: 'text',
            value: title,
            onChange: (e) => setTitle(e.target.value),
            placeholder: 'e.g. Miller Residence - Living Room Ceiling Repair',
            className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500'
          })
        ]),

        h('div', null, [
          h('label', { className: 'block text-slate-400 mb-1' }, 'Job Site Address'),
          h('input', {
            required: true,
            type: 'text',
            value: address,
            onChange: (e) => setAddress(e.target.value),
            placeholder: 'e.g. 1420 S Glenstone Ave, Springfield, MO',
            className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500'
          })
        ]),

        // CATEGORY SELECTION & MANAGER TOGGLE
        h('div', null, [
          h('div', { className: 'flex justify-between items-center mb-1' }, [
            h('label', { className: 'text-slate-400' }, 'Job Category'),
            h('button', {
              type: 'button',
              onClick: () => setShowCategoryManager(!showCategoryManager),
              className: 'text-[11px] text-amber-400 hover:underline font-semibold'
            }, showCategoryManager ? 'Done Editing Categories' : '⚙️ Manage Categories')
          ]),

          !showCategoryManager ? (
            h('select', {
              value: selectedCategory,
              onChange: (e) => setSelectedCategory(e.target.value),
              className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500'
            }, categories.map(c => h('option', { key: c.id, value: c.name }, c.name)))
          ) : (
            // DYNAMIC CATEGORY MANAGER PANEL
            h('div', { className: 'bg-slate-950 p-3 rounded-xl border border-amber-500/30 space-y-2' }, [
              h('div', { className: 'flex gap-2' }, [
                h('input', {
                  type: 'text',
                  placeholder: 'Add new category (e.g. Level 5 Finish)...',
                  value: newCategoryName,
                  onChange: (e) => setNewCategoryName(e.target.value),
                  className: 'flex-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200 focus:outline-none'
                }),
                h('button', {
                  type: 'button',
                  onClick: handleAddCategory,
                  className: 'bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg font-bold'
                }, 'Add')
              ]),

              h('div', { className: 'flex flex-wrap gap-1.5 pt-1' }, 
                categories.map(c => 
                  h('span', { key: c.id, className: 'bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded-md flex items-center gap-1.5' }, [
                    c.name,
                    categories.length > 1 && h('button', {
                      type: 'button',
                      onClick: () => onDeleteCategory(c.id),
                      className: 'text-red-400 hover:text-red-300 font-bold ml-1'
                    }, '×')
                  ])
                )
              )
            ])
          )
        ]),

        h('div', null, [
          h('label', { className: 'block text-slate-400 mb-1' }, 'Scope of Work & Notes'),
          h('textarea', {
            required: true,
            rows: 3,
            value: scope,
            onChange: (e) => setScope(e.target.value),
            placeholder: 'Detail board count, mud coat requirements, water damage repair details...',
            className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500'
          })
        ]),

        h('div', { className: 'grid grid-cols-2 gap-2' }, [
          h('div', null, [
            h('label', { className: 'block text-slate-400 mb-1' }, 'Est. Job Value ($)'),
            h('input', {
              required: true,
              type: 'number',
              value: estimatedValue,
              onChange: (e) => setEstimatedValue(e.target.value),
              className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 font-mono'
            })
          ]),
          h('div', null, [
            h('label', { className: 'block text-slate-400 mb-1' }, 'FTD Fee (%)'),
            h('input', {
              required: true,
              type: 'number',
              value: referralFeePct,
              onChange: (e) => setReferralFeePct(e.target.value),
              className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 font-mono'
            })
          ])
        ]),

        h('div', null, [
          h('label', { className: 'block text-slate-400 mb-1' }, 'Dispatch Status'),
          h('select', {
            value: status,
            onChange: (e) => setStatus(e.target.value),
            className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200'
          }, [
            h('option', { value: 'AVAILABLE' }, '⚡ Publish Immediately to Live FCFS Queue'),
            h('option', { value: 'INCOMING' }, '🔍 Save as Incoming / Uninspected Call First')
          ])
        ]),

        h('div', { className: 'flex justify-end gap-2 pt-3 border-t border-slate-800' }, [
          h('button', {
            type: 'button',
            onClick: onClose,
            className: 'px-4 py-2 text-slate-400 hover:text-white'
          }, 'Cancel'),
          h('button', {
            type: 'submit',
            className: 'bg-amber-500 text-slate-950 font-black px-5 py-2 rounded-xl hover:bg-amber-400 transition-all'
          }, 'Publish Lead')
        ])

      ])
    ])
  ]);
}
