
import React, { useState } from 'react';
import { LayoutDashboard, Store, UploadCloud, Search, Map, ChevronRight } from 'lucide-react';
import FileUpload from './components/FileUpload';
import CategoryTable from './components/CategoryTable';
import StoreDetail from './components/StoreDetail';
import { ParsedData, CATEGORY_LABELS, CategoryKey, PppData, ThirdPartyData, GlassData, PowerData, CampusData } from './types';
import { detectReportType } from './utils/parser';

// Define Columns for the tables
const formatCurrency = (val: number) => 
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
const formatPercent = (val: number) => 
  new Intl.NumberFormat('it-IT', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(val / 100);

const pppColumns = [
  { header: 'Rank', accessor: (d: PppData) => <span className="font-bold">#{d.rank}</span>, align: 'left' as const },
  { header: 'Name', accessor: (d: PppData) => d.storeName, align: 'left' as const },
  { header: 'Qty', accessor: (d: PppData) => d.qty, align: 'center' as const },
  { header: 'Fatturato', accessor: (d: PppData) => formatCurrency(d.revenue), align: 'right' as const },
  { header: 'B/F', accessor: (d: PppData) => <span className="font-medium text-slate-700">{formatPercent(d.pppPerTotal)}</span>, align: 'center' as const },
  { header: 'Attach %', accessor: (d: PppData) => <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{formatPercent(d.attachRate)}</span>, align: 'center' as const },
];

const thirdPartyColumns = [
  { header: 'Rank', accessor: (d: ThirdPartyData) => <span className="font-bold">#{d.rank}</span>, align: 'left' as const },
  { header: 'Name', accessor: (d: ThirdPartyData) => d.storeName, align: 'left' as const },
  { header: 'Fatt. 3PP', accessor: (d: ThirdPartyData) => formatCurrency(d.revenue3PP), align: 'right' as const },
  { header: 'Fatt. Tot', accessor: (d: ThirdPartyData) => formatCurrency(d.totalRevenue), align: 'right' as const },
  { header: 'Share %', accessor: (d: ThirdPartyData) => <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">{formatPercent(d.share)}</span>, align: 'center' as const },
];

const glassColumns = [
  { header: 'Rank', accessor: (d: GlassData) => <span className="font-bold">#{d.rank}</span>, align: 'left' as const },
  { header: 'Name', accessor: (d: GlassData) => d.storeName, align: 'left' as const },
  { header: 'iPhone Sell', accessor: (d: GlassData) => d.iphoneSell, align: 'center' as const },
  { header: 'Glass Sell', accessor: (d: GlassData) => d.glassSell, align: 'center' as const },
  { header: 'Attach %', accessor: (d: GlassData) => <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">{formatPercent(d.attachRate)}</span>, align: 'center' as const },
];

const powerColumns = [
  { header: 'Rank', accessor: (d: PowerData) => <span className="font-bold">#{d.rank}</span>, align: 'left' as const },
  { header: 'Name', accessor: (d: PowerData) => d.storeName, align: 'left' as const },
  { header: 'Power Sell', accessor: (d: PowerData) => d.powerSell, align: 'center' as const },
  { header: 'Attach %', accessor: (d: PowerData) => <span className="bg-red-100 text-red-800 px-2 py-1 rounded">{formatPercent(d.attachRate)}</span>, align: 'center' as const },
];

const campusColumns = [
  { header: 'Rank', accessor: (d: CampusData) => <span className="font-bold">#{d.rank}</span>, align: 'left' as const },
  { header: 'Name', accessor: (d: CampusData) => d.storeName, align: 'left' as const },
  { header: 'Qtà', accessor: (d: CampusData) => d.qty, align: 'center' as const },
  { header: '€/Fatt', accessor: (d: CampusData) => <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{formatPercent(d.revenuePerInvoice)}</span>, align: 'center' as const },
  { header: 'Fatturato', accessor: (d: CampusData) => formatCurrency(d.revenue), align: 'right' as const },
];

type ViewMode = 'store' | 'area';

const App: React.FC = () => {
  const [storeData, setStoreData] = useState<ParsedData | null>(null);
  const [areaData, setAreaData] = useState<ParsedData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('store');
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryKey>('ppp');

  const currentData = viewMode === 'store' ? storeData : areaData;
  const hasCurrentData = !!currentData;

  const handleDataLoaded = (data: ParsedData) => {
    const type = detectReportType(data);
    if (type === 'store') {
      setStoreData(data);
      if (viewMode === 'area') {
        // Automatically switch if we uploaded store data
        setViewMode('store');
      }
    } else {
      setAreaData(data);
      if (viewMode === 'store') {
         // Automatically switch if we uploaded area data
        setViewMode('area');
      }
    }
    // Reset selection on new data load
    setSelectedEntity(null);
  };

  const tabs = [
    { id: 'ppp', label: CATEGORY_LABELS.ppp },
    { id: 'thirdParty', label: CATEGORY_LABELS.thirdParty },
    { id: 'glass', label: CATEGORY_LABELS.glass },
    { id: 'power', label: CATEGORY_LABELS.power },
    { id: 'campus', label: CATEGORY_LABELS.campus },
  ] as const;

  const renderDashboard = () => {
    if (!currentData) return null;

    let tableContent;
    switch(activeTab) {
      case 'ppp':
        tableContent = <CategoryTable title={`PPP Leaderboard (${viewMode === 'store' ? 'Stores' : 'Areas'})`} data={currentData.ppp} columns={pppColumns} highlightStore={selectedEntity || undefined} />;
        break;
      case 'thirdParty':
        tableContent = <CategoryTable title={`Third Party Leaderboard (${viewMode === 'store' ? 'Stores' : 'Areas'})`} data={currentData.thirdParty} columns={thirdPartyColumns} highlightStore={selectedEntity || undefined} />;
        break;
      case 'glass':
        tableContent = <CategoryTable title={`Glass Leaderboard (${viewMode === 'store' ? 'Stores' : 'Areas'})`} data={currentData.glass} columns={glassColumns} highlightStore={selectedEntity || undefined} />;
        break;
      case 'power':
        tableContent = <CategoryTable title={`Power Leaderboard (${viewMode === 'store' ? 'Stores' : 'Areas'})`} data={currentData.power} columns={powerColumns} highlightStore={selectedEntity || undefined} />;
        break;
      case 'campus':
        tableContent = <CategoryTable title={`Campus Leaderboard (${viewMode === 'store' ? 'Stores' : 'Areas'})`} data={currentData.campus} columns={campusColumns} highlightStore={selectedEntity || undefined} />;
        break;
    }

    return (
      <div className="space-y-6">
        <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="h-[600px]">
          {tableContent}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden md:block">Retail Performance</h1>
          </div>

          {/* View Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => { setViewMode('store'); setSelectedEntity(null); }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'store' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Store className="w-4 h-4" />
              Stores
            </button>
            <button
              onClick={() => { setViewMode('area'); setSelectedEntity(null); }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'area' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Map className="w-4 h-4" />
              Areas
            </button>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Store/Area Selector */}
            {hasCurrentData && (
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  value={selectedEntity || ''}
                  onChange={(e) => setSelectedEntity(e.target.value || null)}
                  className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors w-48 sm:w-64"
                >
                  <option value="">Select {viewMode === 'store' ? 'a Store' : 'an Area'}...</option>
                  {currentData.allStores.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Upload Button */}
            {(storeData || areaData) && (
              <button 
                onClick={() => {
                   // Logic to handle re-upload could be more complex, 
                   // but for now we just clear the current view's data to trigger upload screen
                   if (viewMode === 'store') setStoreData(null);
                   else setAreaData(null);
                   setSelectedEntity(null);
                }}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title={`Upload ${viewMode === 'store' ? 'Store' : 'Area'} Report`}
              >
                <UploadCloud className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {!hasCurrentData ? (
          <div className="flex flex-col items-center">
            <div className="mb-8 text-center max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {viewMode === 'store' ? 'Store Dashboard' : 'Area Dashboard'}
              </h2>
              <p className="text-slate-500">
                You are currently viewing the {viewMode === 'store' ? 'Stores' : 'Areas'} section. 
                Please upload the corresponding CSV report to visualize performance.
              </p>
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} />
            
            {/* If the other dataset is loaded, give a quick link to switch */}
            {((viewMode === 'store' && areaData) || (viewMode === 'area' && storeData)) && (
              <div className="mt-8">
                <button 
                   onClick={() => setViewMode(viewMode === 'store' ? 'area' : 'store')}
                   className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  Switch to {viewMode === 'store' ? 'Areas' : 'Stores'} Dashboard <ChevronRight className="w-4 h-4"/>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Detail View */}
            {selectedEntity ? (
              <StoreDetail 
                storeName={selectedEntity} 
                data={currentData} 
                entityLabel={viewMode === 'store' ? 'Store' : 'Area'}
                relatedData={viewMode === 'area' ? storeData : null}
              />
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                 {viewMode === 'store' ? <Store className="w-12 h-12 text-blue-400 mx-auto mb-3" /> : <Map className="w-12 h-12 text-blue-400 mx-auto mb-3" />}
                 <h3 className="text-lg font-medium text-blue-900">Select {viewMode === 'store' ? 'a Store' : 'an Area'}</h3>
                 <p className="text-blue-700 mt-1">
                   Choose {viewMode === 'store' ? 'a store' : 'an area'} from the dropdown above to see a detailed performance report across all categories.
                 </p>
              </div>
            )}

            {/* Leaderboards */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {viewMode === 'store' ? 'Store' : 'Area'} Category Leaderboards
                </h2>
              </div>
              {renderDashboard()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
