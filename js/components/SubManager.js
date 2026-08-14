// js/components/SubManager.js
const { useState, createElement: h } = React;

export function SubManager({ partners, userRole, onSavePartner, onDeletePartner }) {
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [partnerToDelete, setPartnerToDelete] = useState(null);

  const handleOpenAdd = () => {
    setEditingPartner({
      name: '',
      contact: '',
      phone: '',
      status: 'Active',
      rating: 5.0,
      completedJobs: 0,
      specialties: ['Taping & Finishing']
    });
    setShowModal(true);
  };

  const handleOpenEdit = (partner) => {
    setEditingPartner({ ...partner });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingPartner.name || !editingPartner.contact || !editingPartner.phone) return;
    onSavePartner(editingPartner);
    setShowModal(false);
    setEditingPartner(null);
  };

  return h('div', { className: 'space-y-6' }, [
    
    // HEADER
    h('div', { key: 'sub-header', className: 'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4' }, [
      h('div', null, [
        h('h2', { className: 'text-lg font-bold text-white' }, 'FTD Certified Subcontractor Network'),
        h('p', { className: 'text-xs text-slate-400' }, 'Vetted trade partners who claim and self-manage overflow jobs under the FTD referral network.')
      ]),
      userRole === 'admin' && h('button', {
        onClick: handleOpenAdd,
        className: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition-all'
      }, '+ Add New Partner Sub')
    ]),

    // PARTNER CARDS GRID
    partners.length === 0
      ? h('div', { key: 'empty-partners', className: 'bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center' }, [
          h('p', { className: 'text-sm font-semibold text-slate-400' }, 'No subcontractor partners registered yet.'),
          h('p', { className: 'text-xs text-slate-600 mt-1' }, 'Add your trusted trade subs here so they can be assigned to claimed queue jobs.')
        ])
      : h('div', { key: 'partners-grid', className: 'grid grid-cols-1 md:grid-cols-2 gap-4' }, 
          partners.map(sub => 
            h('div', { key: sub.id, className: 'bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative flex flex-col justify-between' }, [
              h('div', { className: 'space-y-2' }, [
                h('div', { className: 'flex items-center justify-between gap-2' }, [
                  h('h3', { className: 'text-base font-bold text-white' }, sub.name),
                  h('span', { 
                    className: `text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                      sub.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }` 
                  }, sub.status || 'Active')
                ]),

                h('div', { className: 'text-xs text-slate-400 space-y-0.5' }, [
                  h('p', null, `Contact: `, h('strong', { className: 'text-slate-200' }, sub.contact)),
                  h('p', null, `Phone: `, h('span', { className: 'text-amber-400 font-mono' }, sub.phone))
                ]),

                sub.specialties && sub.specialties.length > 0 && h('div', { className: 'flex flex-wrap gap-1.5 pt-1' }, 
                  sub.specialties.map((spec, idx) => 
                    h('span', { key: idx, className: 'text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md' }, spec)
                  )
                )
              ]),

              h('div', { className: 'pt-3 border-t border-slate-800 flex items-center justify-between' }, [
                h('div', { className: 'flex items-center gap-3 text-xs' }, [
                  h('span', { className: 'text-amber-400 font-bold' }, `★ ${sub.rating || 5.0}`),
                  h('span', { className: 'text-slate-600' }, '•'),
                  h('span', { className: 'text-slate-400' }, `${sub.completedJobs || 0} Jobs Done`)
                ]),

                userRole === 'admin' && h('div', { className: 'flex items-center gap-2' }, [
                  h('button', {
                    onClick: () => handleOpenEdit(sub),
                    className: 'text-xs text-blue-400 hover:underline'
                  }, 'Edit'),
                  h('button', {
                    onClick: () => setPartnerToDelete(sub),
                    className: 'text-xs text-red-400 hover:underline'
                  }, 'Remove')
                ])
              ])
            ])
          )
        ),

    // MODAL: ADD / EDIT PARTNER
    showModal && editingPartner && h('div', { key: 'partner-modal', className: 'fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50' }, [
      h('div', { className: 'bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 text-xs shadow-2xl relative' }, [
        h('h3', { className: 'text-base font-bold text-white' }, editingPartner.id ? 'Edit Partner Subcontractor' : 'Add New Partner Subcontractor'),
        
        h('form', { onSubmit: handleSubmit, className: 'space-y-3' }, [
          h('div', null, [
            h('label', { className: 'block text-slate-400 mb-1' }, 'Company / Trade Name'),
            h('input', {
              required: true,
              type: 'text',
              value: editingPartner.name,
              onChange: (e) => setEditingPartner({ ...editingPartner, name: e.target.value }),
              placeholder: 'e.g. Precision Finishers LLC',
              className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500'
            })
          ]),

          h('div', { className: 'grid grid-cols-2 gap-2' }, [
            h('div', null, [
              h('label', { className: 'block text-slate-400 mb-1' }, 'Contact Name'),
              h('input', {
                required: true,
                type: 'text',
                value: editingPartner.contact,
                onChange: (e) => setEditingPartner({ ...editingPartner, contact: e.target.value }),
                placeholder: 'e.g. Carlos Mendez',
                className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500'
              })
            ]),
            h('div', null, [
              h('label', { className: 'block text-slate-400 mb-1' }, 'Phone Number'),
              h('input', {
                required: true,
                type: 'text',
                value: editingPartner.phone,
                onChange: (e) => setEditingPartner({ ...editingPartner, phone: e.target.value }),
                placeholder: '(555) 000-0000',
                className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500'
              })
            ])
          ]),

          h('div', { className: 'grid grid-cols-2 gap-2' }, [
            h('div', null, [
              h('label', { className: 'block text-slate-400 mb-1' }, 'Status'),
              h('select', {
                value: editingPartner.status || 'Active',
                onChange: (e) => setEditingPartner({ ...editingPartner, status: e.target.value }),
                className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200'
              }, [
                h('option', { value: 'Active' }, 'Active Partner'),
                h('option', { value: 'On Hold' }, 'On Hold / Busy'),
                h('option', { value: 'Inactive' }, 'Inactive')
              ])
            ]),
            h('div', null, [
              h('label', { className: 'block text-slate-400 mb-1' }, 'Rating (1.0 - 5.0)'),
              h('input', {
                type: 'number',
                step: '0.1',
                max: '5.0',
                min: '1.0',
                value: editingPartner.rating || 5.0,
                onChange: (e) => setEditingPartner({ ...editingPartner, rating: parseFloat(e.target.value) }),
                className: 'w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200'
              })
            ])
          ]),

          h('div', { className: 'flex justify-end gap-2 pt-3 border-t border-slate-800' }, [
            h('button', {
              type: 'button',
              onClick: () => setShowModal(false),
              className: 'px-4 py-2 text-slate-400 hover:text-white'
            }, 'Cancel'),
            h('button', {
              type: 'submit',
              className: 'bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl'
            }, editingPartner.id ? 'Save Changes' : 'Add Partner')
          ])
        ])
      ])
    ]),

    // MODAL: DELETE CONFIRMATION
    partnerToDelete && h('div', { key: 'delete-partner-modal', className: 'fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50' }, [
      h('div', { className: 'bg-slate-900 border border-red-500/50 p-6 rounded-2xl max-w-sm w-full text-center space-y-3' }, [
        h('h3', { className: 'text-base font-bold text-white' }, 'Remove Subcontractor Partner?'),
        h('p', { className: 'text-xs text-slate-400' }, `Are you sure you want to remove `, h('strong', { className: 'text-white' }, partnerToDelete.name), ` from your network directory?`),
        h('div', { className: 'flex gap-2 pt-2' }, [
          h('button', {
            onClick: () => setPartnerToDelete(null),
            className: 'w-1/2 py-2 text-xs text-slate-400 hover:text-white'
          }, 'Cancel'),
          h('button', {
            onClick: () => {
              onDeletePartner(partnerToDelete.id);
              setPartnerToDelete(null);
            },
            className: 'w-1/2 bg-red-500 text-white font-bold py-2 rounded-xl text-xs'
          }, 'Confirm Delete')
        ])
      ])
    ])

  ]);
}
