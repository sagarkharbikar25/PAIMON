import React, { useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, CloudSun, Wind, Droplets, Sun, CloudRain, 
  CloudLightning, Thermometer, ChevronRight, Loader2
} from 'lucide-react';
import { BottomNav } from './Navigation';
import { cn } from '../lib/utils';
import apiFetch from '../services/api';

/* ── Types ── */
interface CurrentWeather {
  city: string;
  temp: number;
  humidity: number;
  description: string;
  icon: string;
}

interface ForecastDay {
  date: string;
  temp: number;
  description: string;
  icon: string;
}

interface WeatherAlert {
  type: 'RAIN' | 'HEAT' | 'COLD' | 'STORM';
  message: string;
}

/* ── Icon helper ── */
const getWeatherIcon = (desc: string) => {
  const d = desc.toLowerCase();
  if (d.includes('thunder') || d.includes('storm')) return CloudLightning;
  if (d.includes('rain') || d.includes('drizzle') || d.includes('shower')) return CloudRain;
  if (d.includes('cloud')) return CloudSun;
  return Sun;
};

const getIconColor = (desc: string) => {
  const d = desc.toLowerCase();
  if (d.includes('thunder') || d.includes('storm')) return 'text-purple-500';
  if (d.includes('rain') || d.includes('drizzle')) return 'text-blue-500';
  if (d.includes('cloud')) return 'text-primary';
  return 'text-amber-500';
};

const getDayName = (dateStr: string) => {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return days[new Date(dateStr).getDay()];
};

const alertColors: Record<string, string> = {
  RAIN:  'bg-blue-50 border-blue-200 text-blue-900',
  HEAT:  'bg-orange-50 border-orange-200 text-orange-900',
  COLD:  'bg-sky-50 border-sky-200 text-sky-900',
  STORM: 'bg-purple-50 border-purple-200 text-purple-900',
};

export const Weather = () => {
  const { setScreen } = useApp();

  const [current, setCurrent]   = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [alerts, setAlerts]     = useState<WeatherAlert[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // City from localStorage (set when a trip is active) or default
  const city = localStorage.getItem('pravas_current_city') || 'Kyoto';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError('');

        const [w, f, a] = await Promise.all([
          apiFetch(`/weather/current?city=${encodeURIComponent(city)}`),
          apiFetch(`/weather/forecast?city=${encodeURIComponent(city)}`),
          apiFetch(`/weather/alerts?city=${encodeURIComponent(city)}`),
        ]) as [any, any, any];

        setCurrent(w.weather as CurrentWeather);
        setForecast((f.forecast?.forecast ?? []) as ForecastDay[]);
        setAlerts((a.alerts ?? []) as WeatherAlert[]);
      } catch (err: any) {
        setError(err.message || 'Failed to load weather');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [city]);

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-6 border-b border-outline-variant/10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setScreen('dashboard')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-primary" />
            <h1 className="font-headline text-xl font-bold text-primary">Weather</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-28 px-6 space-y-8">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-on-surface-variant font-medium">Fetching weather for {city}…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-semibold">{error}</p>
            <p className="text-red-500 text-sm mt-1">Make sure the backend is running and OPENWEATHER_API_KEY is set.</p>
          </div>
        )}

        {/* Current Weather */}
        {!loading && current && (
          <section className="primary-gradient text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                  {current.city}
                </span>
              </div>
              <h2 className="text-8xl font-headline font-extrabold mb-4 tracking-tighter">
                {Math.round(current.temp)}°
              </h2>
              <div className="flex items-center gap-3 mb-8">
                {(() => { const Icon = getWeatherIcon(current.description); return <Icon className="w-8 h-8" />; })()}
                <span className="text-2xl font-headline font-bold capitalize">{current.description}</span>
              </div>

              <div className="grid grid-cols-3 w-full gap-4 pt-8 border-t border-white/10">
                <div className="flex flex-col items-center gap-1">
                  <Wind className="w-5 h-5 text-white/60" />
                  <span className="text-sm font-bold">— km/h</span>
                  <span className="text-[8px] uppercase font-bold text-white/40">Wind</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Droplets className="w-5 h-5 text-white/60" />
                  <span className="text-sm font-bold">{current.humidity}%</span>
                  <span className="text-[8px] uppercase font-bold text-white/40">Humidity</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Thermometer className="w-5 h-5 text-white/60" />
                  <span className="text-sm font-bold">{Math.round(current.temp)}°</span>
                  <span className="text-[8px] uppercase font-bold text-white/40">Feels Like</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 opacity-10">
              <Sun className="w-64 h-64" />
            </div>
          </section>
        )}

        {/* 5-Day Forecast */}
        {!loading && forecast.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="font-headline text-2xl font-bold text-primary">5-Day Forecast</h3>
              <button className="text-primary font-bold text-sm flex items-center gap-1">
                Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {forecast.map((day) => {
                const Icon = getWeatherIcon(day.description);
                return (
                  <div key={day.date} className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="w-12 font-headline font-bold text-primary">{getDayName(day.date)}</span>
                      <div className="flex items-center gap-3">
                        <Icon className={cn('w-6 h-6', getIconColor(day.description))} />
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest capitalize">
                          {day.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-headline font-extrabold text-primary">{Math.round(day.temp)}°</span>
                      <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(day.temp / 40) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Alerts */}
        {!loading && alerts.length > 0 && (
          <section className="space-y-4">
            {alerts.map((alert, i) => (
              <div key={i} className={cn('border rounded-[2rem] p-8 flex gap-4', alertColors[alert.type] || alertColors.RAIN)}>
                <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center flex-shrink-0">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-headline font-bold mb-1">{alert.type} Alert</h4>
                  <p className="text-xs font-medium leading-relaxed">{alert.message}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* No alerts placeholder */}
        {!loading && !error && alerts.length === 0 && current && (
          <section className="bg-green-50 border border-green-200 rounded-[2rem] p-8 flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-headline font-bold text-green-900 mb-1">All Clear!</h4>
              <p className="text-xs text-green-800 font-medium leading-relaxed">
                No weather alerts for {current.city} right now. Great time to travel!
              </p>
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
};