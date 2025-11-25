import { ParsedData, PppData, ThirdPartyData, GlassData, PowerData, CampusData } from '../types';

// Helper to parse European formatted numbers (e.g., "1.234,56" or "12,5%")
const parseEuroNum = (str: string | undefined): number => {
  if (!str) return 0;
  // Remove currency symbols, % and spaces
  let clean = str.replace(/[€%\s]/g, '');
  // Remove thousands separator (.)
  clean = clean.replace(/\./g, '');
  // Replace decimal separator (,) with (.)
  clean = clean.replace(',', '.');
  const val = parseFloat(clean);
  return isNaN(val) ? 0 : val;
};

// Helper to clean store names (remove extra spaces, standardize)
const cleanStoreName = (name: string | undefined): string => {
  if (!name) return '';
  return name.trim();
};

const parseRank = (str: string | undefined): number => {
  if (!str) return 999;
  return parseInt(str.replace('°', '')) || 999;
};

export const detectReportType = (data: ParsedData): 'store' | 'area' => {
  // Heuristic: If significant number of "stores" start with "Area", it's an Area report.
  const areaCount = data.allStores.filter(s => s.trim().toLowerCase().startsWith('area')).length;
  const total = data.allStores.length;
  if (total === 0) return 'store';
  
  // If > 40% start with Area, assume Area report
  return (areaCount / total) > 0.4 ? 'area' : 'store';
};

export const parseCSV = (csvText: string): ParsedData => {
  const lines = csvText.split('\n');
  
  const pppList: PppData[] = [];
  const thirdPartyList: ThirdPartyData[] = [];
  const glassList: GlassData[] = [];
  const powerList: PowerData[] = [];
  const campusList: CampusData[] = [];
  const storeSet = new Set<string>();

  // Start from line 2 (index 2) assuming line 0 is header, line 1 is "CATENA" summary
  // Adjusting based on user input sample:
  // Row 1: Headers
  // Row 2: "CATENA" totals
  // Row 3+: Data
  
  for (let i = 2; i < lines.length; i++) {
    // Handle CSV split respecting quotes is complex, but the provided data looks simple enough to try basic split first.
    // However, some fields like "12,4%" contain commas. We need a regex splitter.
    
    // Simple regex to split by comma, ignoring commas inside quotes
    const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    // The above regex is a bit flaky for all edge cases. Let's use a robust approach for "comma separated values allowing quoted commas"
    
    // Alternate approach: Split by comma but respect quotes
    const row: string[] = [];
    let current = '';
    let inQuote = false;
    const line = lines[i];
    
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        row.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current);

    // Clean up quotes from values
    const cleanRow = row.map(cell => cell.trim().replace(/^"|"$/g, ''));

    if (cleanRow.length < 5) continue; // Skip empty rows

    // --- Section 1: PPP (Indices 0-6) ---
    // 0: Rank, 1: Store, 2: Qty, 3: Revenue, 4: TotRev, 5: PPP/Tot, 6: AR
    if (cleanRow[1]) {
      const store = cleanStoreName(cleanRow[1]);
      if (store && store !== 'CATENA') {
        storeSet.add(store);
        pppList.push({
          rank: parseRank(cleanRow[0]),
          storeName: store,
          qty: parseEuroNum(cleanRow[2]),
          revenue: parseEuroNum(cleanRow[3]),
          totalRevenue: parseEuroNum(cleanRow[4]),
          pppPerTotal: parseEuroNum(cleanRow[5]),
          attachRate: parseEuroNum(cleanRow[6]),
        });
      }
    }

    // --- Section 2: Third Party (Indices 8-12) ---
    // 8: Rank, 9: Store, 10: 3PP Rev, 11: TotRev, 12: %
    if (cleanRow[9]) {
      const store = cleanStoreName(cleanRow[9]);
      if (store && store !== 'CATENA') {
        storeSet.add(store);
        thirdPartyList.push({
          rank: parseRank(cleanRow[8]),
          storeName: store,
          revenue3PP: parseEuroNum(cleanRow[10]),
          totalRevenue: parseEuroNum(cleanRow[11]),
          share: parseEuroNum(cleanRow[12]),
        });
      }
    }

    // --- Section 3: VETRI (Indices 14-19) ---
    // 14: Rank, 15: Store, 16: iPhone Sell, 17: Vetri Sell, 18: €, 19: AR %
    if (cleanRow[15]) {
      const store = cleanStoreName(cleanRow[15]);
      if (store && store !== 'CATENA') {
        storeSet.add(store);
        glassList.push({
          rank: parseRank(cleanRow[14]),
          storeName: store,
          iphoneSell: parseEuroNum(cleanRow[16]),
          glassSell: parseEuroNum(cleanRow[17]),
          revenue: parseEuroNum(cleanRow[18]),
          attachRate: parseEuroNum(cleanRow[19]),
        });
      }
    }

    // --- Section 4: ALIM (Indices 21-26) ---
    // 21: Rank, 22: Store, 23: iPhone Sell, 24: Alim Sell, 25: €, 26: AR %
    if (cleanRow[22]) {
      const store = cleanStoreName(cleanRow[22]);
      if (store && store !== 'CATENA') {
        storeSet.add(store);
        powerList.push({
          rank: parseRank(cleanRow[21]),
          storeName: store,
          iphoneSell: parseEuroNum(cleanRow[23]),
          powerSell: parseEuroNum(cleanRow[24]),
          revenue: parseEuroNum(cleanRow[25]),
          attachRate: parseEuroNum(cleanRow[26]),
        });
      }
    }

    // --- Section 5: CAMPUS (Indices 28-32) ---
    // 28: Rank, 29: Store, 30: Qty, 31: €, 32: €/fatt (likely avg ticket or similar)
    if (cleanRow[29]) {
      const store = cleanStoreName(cleanRow[29]);
      if (store && store !== 'CATENA') {
        storeSet.add(store);
        campusList.push({
          rank: parseRank(cleanRow[28]),
          storeName: store,
          qty: parseEuroNum(cleanRow[30]),
          revenue: parseEuroNum(cleanRow[31]),
          revenuePerInvoice: parseEuroNum(cleanRow[32]),
        });
      }
    }
  }

  return {
    ppp: pppList,
    thirdParty: thirdPartyList,
    glass: glassList,
    power: powerList,
    campus: campusList,
    allStores: Array.from(storeSet).sort(),
  };
};