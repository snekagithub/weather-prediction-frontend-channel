import {
  Box,
  Typography,
  Container,
  Stack,
  Chip,
  Skeleton,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { LocationOn, AccessTime, WbSunny } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

import SearchBar from "./SearchBar";
import ForecastCard from "./ForecastCard";
import { getForecast } from "../services/weatherService";
import type { ForecastDayUI } from "../types";
import { getLastFetchTime, ApiError } from "../services/api";

const groupByDate = (list: ForecastDayUI[]) => {
  return list.reduce((acc: Record<string, ForecastDayUI[]>, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
};

export default function Layout() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onCitySelect = async (c: string) => {
    const trimmed = c.trim();
    if (!trimmed) return;

    setCity(trimmed);
    setError(null);
    setLoading(true);

    try {
      const data = await getForecast(trimmed);
      setWeather(data);
      localStorage.setItem("lastCity", trimmed);
      setSelectedDate(null);
    } catch (err: any) {
      console.error("Weather fetch failed:", err);

      if (err instanceof ApiError) {
        if (err.isClientError) {
          // 4xx
          setError(
            err.message || "Invalid request. Please check the city name."
          );
        } else if (err.isServerError) {
          // 5xx
          setError(
            "The weather service is currently unavailable. Please try again later."
          );
        } else {
          // status 0 – network
          setError(
            "Network error. Please check your internet connection and try again."
          );
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("lastCity");
    if (saved) onCitySelect(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bg =
    "radial-gradient(circle at 0% 0%, #111827 0, transparent 40%)," +
    "radial-gradient(circle at 100% 0%, #0f172a 0, transparent 46%)," +
    "linear-gradient(180deg,#020617 0%,#020617 20%,#020617 100%)";

  const lastUpdatedLabel = getLastFetchTime();

  const grouped: Record<string, ForecastDayUI[]> = weather
    ? groupByDate(weather.all)
    : {};

  const dateKeys = Object.keys(grouped).slice(0, 5);

  const activeDate =
    selectedDate && grouped[selectedDate]
      ? selectedDate
      : dateKeys[0] || null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: bg,
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 4 }, pb: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 2, md: 3 },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 18, md: 22 },
                fontWeight: 800,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                background:
                  "linear-gradient(120deg,#e5e7eb,#93c5fd,#a855f7)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Weather Forecast
            </Typography>
            <Typography
              sx={{
                color: "#64748b",
                fontSize: 13,
              }}
            >
              Hyper-minimal weather dashboard.
            </Typography>
          </Box>

          {weather && !loading && lastUpdatedLabel && (
            <Chip
              icon={<AccessTime sx={{ fontSize: 16 }} />}
              label={`Last fetch · ${lastUpdatedLabel}`}
              sx={{
                bgcolor: "rgba(15,23,42,0.85)",
                color: "#e5e7eb",
                borderRadius: "999px",
                border: "1px solid rgba(148,163,184,0.4)",
                fontSize: 12,
              }}
              variant="outlined"
            />
          )}
        </Box>

        <SearchBar onSelect={onCitySelect} />

        {error && (
          <Box sx={{ mt: 1 }}>
            <Typography
              sx={{
                color: "#fecaca",
                fontSize: 12,
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        {weather && !loading && (
          <Box
            sx={{
              mt: 3,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "999px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "radial-gradient(circle at 0% 0%, #38bdf8, #1d4ed8)",
                }}
              >
                <LocationOn sx={{ color: "#e5e7eb", fontSize: 18 }} />
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: 26, md: 32 },
                  fontWeight: 800,
                  background:
                    "linear-gradient(120deg,#e5e7eb,#93c5fd,#a5b4fc)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {weather.city || city}
              </Typography>

              {weather.country && (
                <Chip
                  label={weather.country}
                  size="small"
                  sx={{
                    color: "#93c5fd",
                    borderColor: "#3b82f6",
                    fontWeight: 600,
                    height: 24,
                    borderRadius: "999px",
                  }}
                  variant="outlined"
                />
              )}
            </Stack>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 12,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              Today&apos;s snapshot & hourly breakdown
            </Typography>
          </Box>
        )}

        {loading && (
          <Box
            sx={{
              mt: 4,
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            }}
          >
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={180}
                sx={{ borderRadius: 4 }}
              />
            ))}
          </Box>
        )}

        {!loading && !weather && (
          <Typography
            sx={{
              color: "#cbd5e1",
              mt: 6,
              fontSize: 18,
              textAlign: "center",
            }}
          >
            Start by searching for a city above to see a live forecast.
          </Typography>
        )}

        {weather && !loading && (
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1.2fr 1fr",
                },
                alignItems: "stretch",
                mt: 1,
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  borderRadius: 3,
                  width: "100%",
                  p: 2.4,
                  background:
                    "linear-gradient(145deg, rgba(59,130,246,0.22), rgba(15,23,42,0.98))",
                  border: "1px solid rgba(37,99,235,0.6)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.4,
                }}
              >
                <Typography
                  sx={{
                    color: "#cbd5e1",
                    textTransform: "uppercase",
                    fontSize: 11,
                    letterSpacing: 1,
                  }}
                >
                  Now
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.6}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: 32, md: 36 },
                        fontWeight: 900,
                        lineHeight: 1,
                        background:
                          "linear-gradient(90deg,#e5e7eb,#93c5fd)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {weather.current.tempC.toFixed(1)}°C
                    </Typography>
                    <Typography
                      sx={{
                        color: "#cbd5e1",
                        fontSize: 13,
                        mt: 0.3,
                      }}
                    >
                      {weather.current.condition}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background:
                        "radial-gradient(circle at 30% 0%, rgba(96,165,250,0.9), rgba(15,23,42,1))",
                      border: "1px solid rgba(129,140,248,0.8)",
                    }}
                  >
                    <WbSunny sx={{ fontSize: 28, color: "#e5e7eb" }} />
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={0.8}
                  flexWrap="wrap"
                  sx={{ mt: 0.4 }}
                >
                  <Chip
                    size="small"
                    label={`Feels like ${weather.current.tempC.toFixed(
                      1
                    )}°C`}
                    sx={{
                      bgcolor: "rgba(15,23,42,0.85)",
                      color: "#e5e7eb",
                      borderColor: "rgba(148,163,184,0.5)",
                      fontSize: 11,
                      height: 24,
                    }}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={`Wind ${weather.current.windSpeed} km/h`}
                    sx={{
                      bgcolor: "rgba(15,23,42,0.85)",
                      color: "#e5e7eb",
                      borderColor: "rgba(148,163,184,0.5)",
                      fontSize: 11,
                      height: 24,
                    }}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={`Humidity ${weather.current.humidity}%`}
                    sx={{
                      bgcolor: "rgba(15,23,42,0.85)",
                      color: "#e5e7eb",
                      borderColor: "rgba(148,163,184,0.5)",
                      fontSize: 11,
                      height: 24,
                    }}
                    variant="outlined"
                  />
                </Stack>
              </Paper>

              <Paper
                elevation={6}
                sx={{
                  borderRadius: 3,
                  width: "100%",
                  p: 2.4,
                  background:
                    "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,64,175,0.6))",
                  border: "1px solid rgba(30,64,175,0.7)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.2,
                }}
              >
                <Typography
                  sx={{
                    color: "#e2e8f0",
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    fontSize: 13,
                    textTransform: "uppercase",
                  }}
                >
                  Summary
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mt: 0.2 }}
                >
                  <Chip
                    size="small"
                    label={`Day High ${weather.summary.highC.toFixed(
                      1
                    )}°C`}
                    sx={{
                      bgcolor: "rgba(22,163,74,0.15)",
                      color: "#bbf7d0",
                      fontSize: 11,
                      height: 24,
                    }}
                  />
                  <Chip
                    size="small"
                    label={`Night Low ${weather.summary.lowC.toFixed(
                      1
                    )}°C`}
                    sx={{
                      bgcolor: "rgba(59,130,246,0.15)",
                      color: "#bfdbfe",
                      fontSize: 11,
                      height: 24,
                    }}
                  />
                  <Chip
                    size="small"
                    label={`Daily Avg ${weather.summary.tempC.toFixed(
                      1
                    )}°C`}
                    sx={{
                      bgcolor: "rgba(129,140,248,0.2)",
                      color: "#e0e7ff",
                      fontSize: 11,
                      height: 24,
                    }}
                  />
                </Stack>

                {weather.summary.advisories &&
                  weather.summary.advisories.length > 0 && (
                    <Box sx={{ mt: 0.4 }}>
                      {weather.summary.advisories
                        .slice(0, 2)
                        .map((adv: string, i: number) => (
                          <Typography
                            key={i}
                            sx={{
                              color: "#bfdbfe",
                              fontSize: 11,
                              mb: 0.2,
                            }}
                          >
                            • {adv}
                          </Typography>
                        ))}
                    </Box>
                  )}
              </Paper>
            </Box>

            {activeDate && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: 13,
                    mb: 1.5,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Hourly timeline
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "260px 1fr",
                    },
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ pr: { xs: 0, md: 2 } }}>
                    <Box
                      sx={{
                        display: { xs: "grid", md: "flex" },
                        gridTemplateColumns: {
                          xs: "repeat(2, minmax(0, 1fr))",
                        },
                        rowGap: { xs: 1.2, md: 0 },
                        columnGap: { xs: 1.2, md: 0 },
                        flexDirection: { md: "column" },
                      }}
                    >
                      {dateKeys.map((date) => {
                        const isActive = date === activeDate;

                        return (
                          <motion.div
                            key={date}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.16 }}
                            style={{ width: "100%" }}
                          >
                            <Box
                              onClick={() => setSelectedDate(date)}
                              sx={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 1.1,
                                px: 1.6,
                                py: 0.9,
                                borderRadius: 999,
                                background:
                                  "radial-gradient(circle at 0% 0%, rgba(15,23,42,0.9), rgba(15,23,42,1))",
                                border: isActive
                                  ? "1px solid rgba(96,165,250,0.9)"
                                  : "1px solid rgba(30,64,175,0.7)",
                                boxShadow: isActive
                                  ? "0 12px 36px rgba(15,23,42,0.95)"
                                  : "0 4px 16px rgba(15,23,42,0.8)",
                                transition: "all 0.2s ease-out",
                                width: { xs: "100%", md: "auto" },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  background: isActive
                                    ? "radial-gradient(circle at 30% 30%,#bfdbfe,#3b82f6)"
                                    : "rgba(148,163,184,0.7)",
                                  boxShadow: isActive
                                    ? "0 0 0 6px rgba(59,130,246,0.35)"
                                    : "none",
                                  flexShrink: 0,
                                }}
                              />

                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: isActive
                                      ? "#e5e7eb"
                                      : "#9ca3af",
                                    fontSize: 13,
                                    fontWeight: isActive ? 600 : 500,
                                    letterSpacing: 0.3,
                                  }}
                                >
                                  {date}
                                </Typography>
                              </Box>
                            </Box>
                          </motion.div>
                        );
                      })}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      overflowX: { xs: "visible", md: "visible" },
                      pb: { xs: 1, md: 0 },
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeDate}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Box
                          sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: {
                              xs: "1fr",
                              sm: "repeat(2,1fr)",
                              md: "repeat(3,1fr)",
                              lg: "repeat(4,1fr)",
                            },
                          }}
                        >
                          {grouped[activeDate]?.map(
                            (d: ForecastDayUI, idx: number) => (
                              <ForecastCard key={idx} day={d} />
                            )
                          )}
                        </Box>
                      </motion.div>
                    </AnimatePresence>
                  </Box>
                </Box>
              </Box>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
