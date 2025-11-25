import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface ColumnDef<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface CategoryTableProps<T> {
  title: string;
  data: T[];
  columns: ColumnDef<T>[];
  highlightStore?: string;
}

const CategoryTable = <T extends { rank: number; storeName: string }>({ 
  title, 
  data, 
  columns,
  highlightStore 
}: CategoryTableProps<T>) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center sticky top-0 z-10">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
          {data.length} Stores
        </span>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 z-10">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, idx) => {
              const isHighlighted = highlightStore && item.storeName.toLowerCase() === highlightStore.toLowerCase();
              return (
                <tr 
                  key={idx} 
                  className={`
                    hover:bg-slate-50 transition-colors
                    ${isHighlighted ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                  `}
                >
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={`px-4 py-3 whitespace-nowrap text-slate-700 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${isHighlighted ? 'font-medium text-blue-800' : ''}`}
                    >
                      {col.accessor(item)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;