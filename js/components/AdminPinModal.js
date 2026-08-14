// js/components/AdminPinModal.js
const { useState, createElement: h } = React;

export function AdminPinModal({ onUnlock, onClose }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onUnlock(pin);
    if (!success) {
      setError(true);
      setPin('');
    }
  };

  return h('div', { className: 'fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50' }, [
    h('div', { className: 'bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xs w-full text-center space-y-4 shadow-2xl relative' }, [
      
      h('div', { className: 'space-y-1' }, [
        h('div', { className: 'w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 text-lg' }, '🔒'),
        h('h3', { className: 'text-base font-bold text-white' }, 'FTD Admin Passcode'),
        h('p', { className: 'text-xs text-slate-400' }, 'Enter secure PIN to access dispatch controls and revenue logs.')
      ]),

      h('form', { onSubmit: handleSubmit, className: 'space-y-3' }, [
        h('input', {
          type: 'password',
          maxLength: 6,
          autoFocus: true,
          value: pin,
          onChange: (e) => { setPin(e.target.value); setError(false); },
          placeholder: '••••',
          className: 'w-full bg-slate-950 text-center text-xl tracking-widest p-3 rounded-xl border border-slate-800 text-amber-400 focus:outline-none focus:border-amber-500 font-mono'
        }),

        error && h('p', { className: 'text-xs text-red-400 font-semibold' }, 'Incorrect passcode. Try again.'),

        h('div', { className: 'flex gap-2 pt-2' }, [
          h('button', {
            type: 'button',
            onClick: onClose,
            className: 'w-1/2 py-2 text-xs text-slate-400 hover:text-white'
          }, 'Cancel'),
          h('button', {
            type: 'submit',
            className: 'w-1/2 bg-amber-500 text-slate-950 font-black py-2 rounded-xl text-xs hover:bg-amber-400 transition-all'
          }, 'Unlock')
        ])
      ])

    ])
  ]);
}
