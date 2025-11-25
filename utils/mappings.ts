
export const RAW_MAPPING_CSV = `Milano Piave;Milano Piave;Area Nord-Centro
Milano Porta Romana;Milano Porta Romana;Area Nord-Centro
Alessandria;Alessandria;Area Nord-Centro
Torino To Dream;Torino To Dream;Area Nord-Centro
Crema;Crema;Area Nord-Centro
Milano City Life;Milano City Life;Area Nord-Centro
Novara;Novara;Area Nord-Centro
Torino Lingotto;Torino Lingotto;Area Nord-Centro
Pavia;Pavia;Area Nord-Centro
Arese;Arese;Area Nord-Centro
Milano Valtellina;Milano Valtellina;Area Nord-Centro
Avellino;Avellino;Area Sud-Ovest
Pontecagnano;Pontecagnano;Area Sud-Ovest
Campobasso;Campobasso;Area Sud-Ovest
Giugliano;Giugliano;Area Sud-Ovest
Nola;Nola;Area Sud-Ovest
Potenza;Potenza;Area Sud-Ovest
Napoli Chiaia;Napoli Chiaia;Area Sud-Ovest
Pompei Maximall;Pompei Maximall;Area Sud-Ovest
Pompei Cartiera;Pompei Cartiera;Area Sud-Ovest
Napoli Vomero;Napoli Vomero;Area Sud-Ovest
Napoli Toledo;Napoli Toledo;Area Sud-Ovest
Roma Appio;Roma Appio;Area Centro-Sud
Roma EUR;Roma EUR;Area Centro-Sud
Roma Maximo;Roma Maximo;Area Centro-Sud
ReStore Carrobbio;ReStore Carrobbio;Area ReStore
ReStore Chiaia;ReStore Chiaia;Area ReStore
L'Aquila;L'Aquila;Area Centro-Sud
Roma Margherita;Roma Margherita;Area Centro-Sud
Caserta;Caserta;Area Centro-Sud
Vaticano;Vaticano;Area Centro-Sud
ReStore City Life;ReStore City Life;Area ReStore
ReStore Giordano;ReStore Giordano;Area ReStore
Macerata;Macerata;Area Centro-Est
Ascoli;Ascoli;Area Centro-Est
Fano;Fano;Area Centro-Est
Ravenna;Ravenna;Area Centro-Est
Pesaro;Pesaro;Area Centro-Est
Cesena;Cesena;Area Centro-Est
Chieti;Chieti;Area Centro-Est
Civitanova Marche;Civitanova Marche;Area Centro-Est
Ancona;Ancona;Area Centro-Est
Forlì;Forlì;Area Centro-Est
Teramo;Teramo;Area Centro-Est
Arezzo;Arezzo;Area Centro-Ovest
Siena;Siena;Area Centro-Ovest
Lucca;Lucca;Area Centro-Ovest
Valdichiana;Valdichiana;Area Centro-Ovest
Firenze;Firenze;Area Centro-Ovest
Livorno;Livorno;Area Centro-Ovest
Corciano Gherlinda;Corciano Gherlinda;Area Centro-Ovest
Trevi;Trevi;Area Centro-Ovest
Terni;Terni;Area Centro-Ovest
Grosseto;Grosseto;Area Centro-Ovest
Pisa;Pisa;Area Centro-Ovest
Venezia;Venezia;Area Nord-Est
Faenza;Faenza;Area Nord-Est
Treviso;Treviso;Area Nord-Est
Padova Venezia;Padova Venezia;Area Nord-Est
Verona;Verona;Area Nord-Est
Mantova;Mantova;Area Nord-Est
Ferrara;Ferrara;Area Nord-Est
Padova Cavour;Padova Cavour;Area Nord-Est
Brescia;Brescia;Area Nord-Est
Vicenza;Vicenza;Area Nord-Est
Trieste;Trieste;Area Nord-Est
Palermo Libertà;Palermo Libertà;Area Sud
Messina;Messina;Area Sud
Reggio Calabria;Reggio Calabria;Area Sud
Catanzaro;Catanzaro;Area Sud
Rende;Rende;Area Sud
Ragusa;Ragusa;Area Sud
Catania;Catania;Area Sud
Palermo Notarbartolo;Palermo Notarbartolo;Area Sud
Bologna Meridiana;Bologna Meridiana;Area Centro-Nord
Piacenza;Piacenza;Area Centro-Nord
Cremona;Cremona;Area Centro-Nord
Parma Marchesi;Parma Marchesi;Area Centro-Nord
Modena;Modena;Area Centro-Nord
Parma Barilla;Parma Barilla;Area Centro-Nord
Carpi;Carpi;Area Centro-Nord
Bologna Nova;Bologna Nova;Area Centro-Nord
Parma Mazzini;Parma Mazzini;Area Centro-Nord
Reggio Emilia;Reggio Emilia;Area Centro-Nord
Genova;Genova;Area Nord-Ovest
Sanremo;Sanremo;Area Nord-Ovest
Lecco;Lecco;Area Nord-Ovest
Savona;Savona;Area Nord-Ovest
Monza;Monza;Area Nord-Ovest
Sondrio;Sondrio;Area Nord-Ovest
Milano XXII Marzo;Milano XXII Marzo;Area Nord-Ovest
Cuneo;Cuneo;Area Nord-Ovest
Aosta;Aosta;Area Nord-Ovest
Milano Merlata;Milano Merlata;Area Nord-Ovest
Milano Caneva;Milano Caneva;Area Nord-Ovest
Varese;Varese;Area Nord-Ovest`;

// Map Area -> Store[]
let areaToStores: Record<string, string[]> | null = null;

const parseMapping = () => {
  if (areaToStores) return areaToStores;
  
  const map: Record<string, string[]> = {};
  const lines = RAW_MAPPING_CSV.split('\n');
  
  lines.forEach(line => {
    const parts = line.split(';');
    if (parts.length >= 3) {
      const storeName = parts[0].trim();
      const areaName = parts[2].trim();
      
      if (!map[areaName]) {
        map[areaName] = [];
      }
      map[areaName].push(storeName);
    }
  });
  
  // Sort stores alphabetically
  Object.keys(map).forEach(key => {
    map[key].sort();
  });
  
  areaToStores = map;
  return map;
};

export const getStoresForArea = (areaName: string): string[] => {
  const map = parseMapping();
  return map[areaName] || [];
};
