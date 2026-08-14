// js/app.js
import { 
  initAuth, 
  subscribeToJobs, 
  subscribeToPartners, 
  subscribeToCategories,
  saveJob,
  claimJob,
  deleteJobRecord,
  savePartner,
  deletePartnerRecord,
  saveCategory,
  deleteCategoryRecord
} from './firebase.js';

import { JobQueue } from './components/JobQueue.js';
import { LeadPipeline } from './components/LeadPipeline.js';
import { SubManager } from './components/SubManager.js';
import { Analytics } from './components/Analytics.js';
import { LeadModal } from './components/LeadModal.js';
import { DetailsModal } from './components/DetailsModal.js';
import { AdminPinModal } from './components/AdminPinModal.js';

const { useState, useEffect, createElement: h } = React;

const DEFAULT_ADMIN_PIN = "1234";

const DEFAULT_CATEGORIES = [
  { id: 'cat-patch', name: 'Patch & Repair' },
  { id: 'cat-taping', name: 'Taping & Finishing' },
  { id: 'cat-fullhouse', name: 'Full House / Renovation' },
  { id: 'cat-commercial', name: 'Commercial' }
];

const DEFAULT_SUBS = [
  { id: 'sub-1', name: 'Apex Drywall Systems', contact: 'Dave Reynolds', phone: '(555) 777-1010', rating: 4.9, completedJobs: 14, status: 'Active', specialties: ['Taping & Finishing', 'Full House / Renovation'] },
  { id: 'sub-2', name: 'Precision Finishers LLC', contact: 'Carlos Mendez', phone: '(555) 888-2020', rating: 4.8, completedJobs: 22, status: 'Active', specialties: ['Patch & Repair', 'Taping & Finishing'] }
];

export function App() {
  const [userRole, setUserRole] = useState('sub'); // 'admin' | 'sub'
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'pipeline' | 'subs' | 'analytics'
  
  // Data States
  const [jobs, setJobs] = useState([]);
  const [partners, setPartners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);

  // Modals & Auth States
  const [showPinModal, setShowPinModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // 1. Initialize Firestore Listeners
  useEffect(() => {
    const unsubAuth = initAuth((user) => {
      if (user) {
        subscribeToJobs(loadedJobs => setJobs(loadedJobs));
        subscribeToPartners(loadedPartners => {
          if (loadedPartners.length > 0) {
            setPartners(loadedPartners);
            if (!currentSub) setCurrentSub(loadedPartners[0]);
          } else {
            // Seed Default Partners if Firestore is empty
            DEFAULT_SUBS.forEach(s => savePartner(s));
          }
        });
        subscribeToCategories(loadedCats => {
          if (loadedCats.length > 0) {
            setCategories(loadedCats);
          } else {
            // Seed Default Categories if Firestore is empty
            DEFAULT_CATEGORIES.forEach(c => saveCategory(c.name));
          }
        });
      }
    });

    return () => unsubAuth && unsubAuth();
  }, []);

  // Handle Admin Role Switch Security
  const handleRoleSwitch = (targetRole) => {
    if (targetRole === 'admin' && userRole !== 'admin') {
      setShowPinModal(true);
    } else {
      setUserRole(targetRole);
      if (targetRole === 'sub' && (activeTab === 'pipeline' || activeTab === 'analytics')) {
        setActiveTab('queue');
      }
    }
  };

  const handleUnlockAdmin = (pinEntered) => {
    if (pinEntered === DEFAULT_ADMIN_PIN) {
      setUserRole('admin');
      setShowPinModal(false);
      return true;
    }
    return false;
  };

  return h('div', { className: 'min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans' }, [
    
    // HEADER BAR
    h('header', { key: 'header', className: 'sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl' }, [
      h('div', { className: 'max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4' }, [
        
        // Brand Title
        h('div', { className: 'flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start' }, [
          h('div', { className: 'flex items-center space-x-3' }, [
            h('div', { className: 'w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md border border-amber-300/40 text-xs' }, 'FTD'),
            h('div', null, [
              h('h1', { className: 'text-base font-black tracking-tight text-white uppercase' }, 'The Finishing Touch'),
              h('p', { className: 'text-[11px] text-amber-400 font-semibold' }, 'Drywall Dispatch Queue Network')
            ])
          ]),
          h('button', { 
            onClick: () => handleRoleSwitch(userRole === 'admin' ? 'sub' : 'admin'),
            className: 'sm:hidden text-[11px] font-bold px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-400'
          }, userRole === 'admin' ? 'Lock Admin' : 'Admin Login')
        ]),

        // Controls (Role Toggle, Sub Switcher, Post Lead)
        h('div', { className: 'flex items-center gap-3 w-full sm:w-auto justify-end' }, [
          h('div', { className: 'bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs' }, [
            h('button', {
              onClick: () => handleRoleSwitch('sub'),
              className: `px-3 py-1.5 rounded-lg font-bold transition-all ${userRole === 'sub' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`
            }, 'Sub Portal'),
            h('button', {
              onClick: () => handleRoleSwitch('admin'),
              className: `px-3 py-1.5 rounded-lg font-bold transition-all ${userRole === 'admin' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`
            }, 'FTD Admin')
          ]),

          userRole === 'sub' && partners.length > 0 && h('select', {
            value: currentSub?.id || '',
            onChange: (e) => setCurrentSub(partners.find(p => p.id === e.target.value)),
            className: 'bg-slate-800 border border-slate-700 text-xs rounded-xl px-2.5 py-2 text-slate-200 hidden lg:block'
          }, partners.map(p => h('option', { key: p.id, value: p.id }, `📱 Sub: ${p.name}`))),

          userRole === 'admin' && h('button', {
            onClick: () => setShowLeadModal(true),
            className: 'bg-amber-500 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-400'
          }, '+ Post Lead')
        ])
      ]),

      // NAVIGATION TABS
      h('div', { className: 'max-w-7xl mx-auto px-4 border-t border-slate-800/80' }, [
        h('nav', { className: 'flex space-x-6 overflow-x-auto no-scrollbar py-2' }, [
          h('button', {
            onClick: () => setActiveTab('queue'),
            className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'queue' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400'}`
          }, `⚡ Live FCFS Queue (${jobs.filter(j => j.status === 'AVAILABLE').length})`),

          userRole === 'admin' && h('button', {
            onClick: () => setActiveTab('pipeline'),
            className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'pipeline' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400'}`
          }, '📋 Dispatch Pipeline'),

          h('button', {
            onClick: () => setActiveTab('subs'),
            className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'subs' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400'}`
          }, `👥 Partner Network (${partners.length})`),

          userRole === 'admin' && h('button', {
            onClick: () => setActiveTab('analytics'),
            className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'analytics' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400'}`
          }, '📊 Referral Revenue')
        ])
      ])
    ]),

    // MAIN VIEW ROUTER
    h('main', { key: 'main', className: 'flex-1 max-w-7xl w-full mx-auto px-4 py-6' }, [
      activeTab === 'queue' && h(JobQueue, { 
        jobs, 
        categories, 
        userRole, 
        currentSub, 
        onSelectJob: setSelectedJob, 
        onClaimJob: (job) => claimJob(job.id, currentSub) 
      }),

      activeTab === 'pipeline' && userRole === 'admin' && h(LeadPipeline, { 
        jobs, 
        onSelectJob: setSelectedJob, 
        onUpdateStatus: (jobId, status) => saveJob({ id: jobId, status }), 
        onDeleteJob: deleteJobRecord 
      }),

      activeTab === 'subs' && h(SubManager, { 
        partners, 
        userRole, 
        onSavePartner: savePartner, 
        onDeletePartner: deletePartnerRecord 
      }),

      activeTab === 'analytics' && userRole === 'admin' && h(Analytics, { jobs })
    ]),

    // MODALS
    showPinModal && h(AdminPinModal, { 
      key: 'modal-pin',
      onUnlock: handleUnlockAdmin, 
      onClose: () => setShowPinModal(false) 
    }),

    showLeadModal && h(LeadModal, { 
      key: 'modal-lead',
      categories, 
      onSaveJob: saveJob, 
      onSaveCategory: saveCategory,
      onDeleteCategory: deleteCategoryRecord,
      userRole,
      onClose: () => setShowLeadModal(false) 
    }),

    selectedJob && h(DetailsModal, { 
      key: 'modal-details',
      job: selectedJob, 
      userRole, 
      currentSub, 
      onClaim: (job) => { claimJob(job.id, currentSub); setSelectedJob(null); },
      onSaveNotes: (jobId, notes, siteDone) => saveJob({ id: jobId, siteNotes: notes, siteVisitDone: siteDone }),
      onDeleteJob: (jobId) => { deleteJobRecord(jobId); setSelectedJob(null); },
      onClose: () => setSelectedJob(null) 
    })
  ]);
}

// Render React App to DOM
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(h(App));
}
