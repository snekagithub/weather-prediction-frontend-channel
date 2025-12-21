export interface CityInfo {
  name: string;
  country: string;
}

export interface WeatherBlock {
  date: string;
  time: string;
  temperature: number;
  temperatureMax: number;
  temperatureMin: number;
  windSpeed: number;
  humidity: number;
  pressure: number;
  weatherTypes: string[];
  recommendations: string[];
}

export interface ForecastResponse {
  cityInfo: CityInfo;
  current: WeatherBlock;
  days: WeatherBlock[];
  summary: WeatherBlock;
  links: {
    self: string;
    forecast: string;
  };
}

export interface ForecastDayUI {
  date: string;
  time: string;
  tempC: number;
  highC: number;
  lowC: number;
  condition: string;
  advisories: string[];
  windSpeed: number;
  humidity: number;
  pressure: number;
}

export interface ForecastUI {
  city: string;
  country: string;

  current: ForecastDayUI;  
  today: ForecastDayUI[]; 
  summary: ForecastDayUI; 
  all: ForecastDayUI[];   
}
