
import React, { useMemo } from 'react';
import { 
  ParsedData, 
} from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Trophy, TrendingUp, Smartphone, Zap, GraduationCap, ShieldCheck, Box, MapPin, Store } from 'lucide-react';
import { getStoresForArea } from '../utils/mappings';

interface StoreDetailProps {
  storeName: string;
  data: ParsedData;
  entityLabel?: string;
  relatedData?: ParsedData | null; // Optional: Stores data when viewing Area
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

const formatPercent = (val: number) => 
  new Intl.NumberFormat('it-IT', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(val / 100);

const RankBadge = ({ rank }: { rank: number }) => {
  let colorClass = 'bg-slate-100 text-slate-600';
  if (rank === 1) colorClass = 'bg-yellow-100 text-yellow-700 border border-yellow-200';
  if (rank === 2) colorClass = 'bg-slate-200 text-slate-700 border border-slate-300';
  if (rank === 3) colorClass = 'bg-amber-100 text-amber-800 border border-amber-200';
  if (rank <= 10 && rank > 3) colorClass = 'bg-blue-50 text-blue-700 border border-blue-100';

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold w-fit ${colorClass}`}>
      <Trophy className="w-4 h-4" />
      <span>Rank #{rank}</span>
    </div>
  );
};

const StoreDetail: React.FC<StoreDetailProps> = ({ storeName, data, entityLabel = 'Store', relatedData }) => {
  const ppp = useMemo(() => data.ppp.find(s => s.storeName === storeName), [storeName, data.ppp]);
  const thirdParty = useMemo(() => data.thirdParty.find(s => s.storeName === storeName), [storeName, data.thirdParty]);
  const glass = useMemo(() => data.glass.find(s => s.storeName === storeName), [storeName, data.glass]);
  const power = useMemo(() => data.power.find(s => s.storeName === storeName), [storeName, data.power]);
  const campus = useMemo(() => data.campus.find(s => s.storeName === storeName), [storeName, data.campus]);

  // Get associated stores if viewing an Area
  const areaStores = useMemo(() => {
    if (entityLabel !== 'Area') return [];
    return getStoresForArea(storeName);
  }, [entityLabel, storeName]);

  // Sort area stores by B/F (PPP per Total) if data exists
  const sortedAreaStores = useMemo(() => {
    if (!relatedData) return areaStores;
    
    return [...areaStores].sort((a, b) => {
      const pppA = relatedData.ppp.find(s => s.storeName === a);
      const pppB = relatedData.ppp.find(s => s.storeName === b);
      // Sort descending by B/F (pppPerTotal)
      return (pppB?.pppPerTotal || 0) - (pppA?.pppPerTotal || 0);
    });
  }, [areaStores, relatedData]);

  const chartData = [
    { name: 'PPP', rank: ppp?.rank || 0, score: ppp?.attachRate || 0, fill: '#3b82f6' },
    { name: '3PP', rank: thirdParty?.rank || 0, score: thirdParty?.share || 0, fill: '#10b981' },
    { name: 'Vetri', rank: glass?.rank || 0, score: glass?.attachRate || 0, fill: '#f59e0b' },
    { name: 'Alim', rank: power?.rank || 0, score: power?.attachRate || 0, fill: '#ef4444' },
  ];

  if (!ppp && !thirdParty && !glass && !power && !campus) {
    return <div className="text-center p-12 text-slate-500">No data found for {storeName}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-800">{storeName}</h2>
           <p className="text-slate-500">{entityLabel} Performance Summary Report</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* PPP Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShieldCheck className="w-5 h-5"/></div>
              {ppp && <RankBadge rank={ppp.rank} />}
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">PPP (Protection)</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{formatPercent(ppp?.attachRate || 0)}</span>
              <span className="text-xs text-slate-400">Attach Rate</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
               <span className="text-slate-500">Fatt.: {formatCurrency(ppp?.revenue || 0)}</span>
               <span className="text-slate-500">Qtà: {ppp?.qty}</span>
            </div>
          </div>
        </div>

        {/* 3PP Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Box className="w-5 h-5"/></div>
              {thirdParty && <RankBadge rank={thirdParty.rank} />}
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Third Party</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{formatPercent(thirdParty?.share || 0)}</span>
              <span className="text-xs text-slate-400">Share</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
               <span className="text-slate-500">Fatt.: {formatCurrency(thirdParty?.revenue3PP || 0)}</span>
               <span className="text-slate-500">Fatt. Tot: {formatCurrency(thirdParty?.totalRevenue || 0)}</span>
            </div>
          </div>
        </div>

         {/* Vetri Card */}
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Smartphone className="w-5 h-5"/></div>
              {glass && <RankBadge rank={glass.rank} />}
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Glass (Vetri)</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{formatPercent(glass?.attachRate || 0)}</span>
              <span className="text-xs text-slate-400">Attach Rate</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
               <span className="text-slate-500">Qtà: {glass?.glassSell}</span>
               <span className="text-slate-500">Fatt.: {formatCurrency(glass?.revenue || 0)}</span>
            </div>
          </div>
        </div>

         {/* Power Card */}
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-red-300 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Zap className="w-5 h-5"/></div>
              {power && <RankBadge rank={power.rank} />}
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Power (Alim)</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{formatPercent(power?.attachRate || 0)}</span>
              <span className="text-xs text-slate-400">Attach Rate</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
               <span className="text-slate-500">Qtà: {power?.powerSell}</span>
               <span className="text-slate-500">Fatt.: {formatCurrency(power?.revenue || 0)}</span>
            </div>
          </div>
        </div>

         {/* Campus Card */}
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><GraduationCap className="w-5 h-5"/></div>
              {campus && <RankBadge rank={campus.rank} />}
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Campus</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{formatCurrency(campus?.revenue || 0)}</span>
              <span className="text-xs text-slate-400">Total Rev</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
               <span className="text-slate-500">Qtà: {campus?.qty}</span>
               <span className="text-slate-500">€/Fatt: {formatPercent(campus?.revenuePerInvoice || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-400"/>
            Performance Rates Comparison
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 'auto']} hide />
                <YAxis dataKey="name" type="category" width={50} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}%`, 'Value']}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Ranking Overview</h3>
            <div className="space-y-4">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-16 font-medium text-slate-600">{item.name}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    {/* Visual representation of rank (inverse logic, lower rank is better) */}
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${Math.max(5, 100 - (item.rank / 100 * 100))}%`, 
                        backgroundColor: item.fill 
                      }} 
                    />
                  </div>
                  <div className="w-20 text-right font-bold text-slate-700">#{item.rank}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-6 text-center">
              Lower rank # indicates better performance relative to other {entityLabel.toLowerCase()}s.
            </p>
        </div>
      </div>

      {/* Stores in Area Section */}
      {entityLabel === 'Area' && areaStores.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in mt-8">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
               <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Stores in {storeName}</h3>
              <p className="text-sm text-slate-500">{areaStores.length} stores associated</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Store Name</th>
                  {relatedData ? (
                    <>
                      <th className="px-6 py-3 text-center">PPP Rank</th>
                      <th className="px-6 py-3 text-center">B/F</th>
                      <th className="px-6 py-3 text-center">PPP Attach</th>
                      <th className="px-6 py-3 text-center">3PP Share</th>
                    </>
                  ) : (
                    <th className="px-6 py-3 text-right">Status</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedAreaStores.map((store, idx) => {
                  const storePpp = relatedData?.ppp.find(s => s.storeName === store);
                  const store3pp = relatedData?.thirdParty.find(s => s.storeName === store);

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-700 flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {store}
                      </td>
                      {relatedData ? (
                        <>
                          <td className="px-6 py-3 text-center">
                            {storePpp ? (
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${storePpp.rank <= 10 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                #{storePpp.rank}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-3 text-center font-medium text-slate-700">
                             {storePpp ? formatPercent(storePpp.pppPerTotal) : '-'}
                          </td>
                          <td className="px-6 py-3 text-center text-slate-600">
                            {storePpp ? formatPercent(storePpp.attachRate) : '-'}
                          </td>
                          <td className="px-6 py-3 text-center text-slate-600">
                            {store3pp ? formatPercent(store3pp.share) : '-'}
                          </td>
                        </>
                      ) : (
                        <td className="px-6 py-3 text-right text-slate-400 italic">
                          No store data uploaded
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDetail;
