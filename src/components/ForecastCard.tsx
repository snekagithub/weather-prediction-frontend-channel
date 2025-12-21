import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  alpha,
} from "@mui/material";
import {
  Thunderstorm,
  Umbrella,
  AcUnit,
  Cloud,
  WbSunny,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { ForecastDayUI } from "../types";
import AirIcon from "@mui/icons-material/Air";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import CompressIcon from "@mui/icons-material/Compress";

export default function ForecastCard({ day }: { day: ForecastDayUI }) {
  const cond =
    typeof day.condition === "string"
      ? day.condition.toLowerCase()
      : "";

  const iconSx = { fontSize: { xs: 22, sm: 26 } };
  console.log(cond)

  const getIcon = () => {
    const c = (cond || "").trim().toLowerCase();

    switch (c) {
      case "clouds":
      case "cloud":
        return <Cloud sx={iconSx} />;
      case "clear":
      case "sunny":
      case "sun":
        return <WbSunny sx={iconSx} />;
      case "snow":
        return <AcUnit sx={iconSx} />;
      case "rain":
        return <Umbrella sx={iconSx} />;
      case "thunder":
      case "thunderstorm":
        return <Thunderstorm sx={iconSx} />;
      default:
        return <Cloud sx={iconSx} />;
    }
  };

  const timeLabel = day.time || day.date || "";
  const hasAdvisories = day.advisories && day.advisories.length > 0;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.22 }}
      style={{ willChange: "transform" }}
    >
      <Card
        sx={{
          borderRadius: 2.5,
          background:
            "radial-gradient(circle at 0% 0%, rgba(148,163,184,0.12), rgba(15,23,42,0.98))",
          border: `1px solid ${alpha("#1f2937", 0.9)}`,
          boxShadow: "0 14px 30px rgba(15,23,42,0.9)",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: { xs: 170, sm: 190, md: 200 },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1.1, sm: 1.6 },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 0.7, sm: 1 },
            justifyContent: "space-between",
            "&:last-child": { pb: { xs: 1.1, sm: 1.6 } },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {timeLabel && (
              <Typography
                variant="caption"
                noWrap
                sx={{
                  maxWidth: "70%",
                  color: "#94a3b8",
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                  fontSize: { xs: 9, sm: 10 },
                }}
              >
                {timeLabel}
              </Typography>
            )}

            <Chip
              size="small"
              label={day.condition || "—"}
              sx={{
                bgcolor: alpha("#1d4ed8", 0.16),
                color: "#bfdbfe",
                fontSize: { xs: 9, sm: 10 },
                height: { xs: 18, sm: 20 },
                maxWidth: "40%",
              }}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 0.2 }}
          >
            <Box
              sx={{
                width: { xs: 38, sm: 44 },
                height: { xs: 38, sm: 44 },
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background:
                  "radial-gradient(circle at 0% 0%, rgba(37,99,235,0.55), rgba(15,23,42,0.96))",
                border: `1px solid ${alpha("#60a5fa", 0.6)}`,
                flexShrink: 0,
              }}
            >
              {getIcon()}
            </Box>

            <Stack
              spacing={0.2}
              alignItems="flex-end"
              sx={{ ml: 1.1, flex: 1 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  lineHeight: 1.05,
                  fontSize: { xs: 17, sm: 20 },
                }}
              >
                {day.tempC.toFixed(1)}°C
              </Typography>

              <Stack direction="row" spacing={0.5}>
                <Chip
                  size="small"
                  label={`H ${day.highC.toFixed(1)}°`}
                  sx={{
                    bgcolor: alpha("#60a5fa", 0.12),
                    color: "#bae6fd",
                    fontWeight: 600,
                    height: { xs: 18, sm: 20 },
                    fontSize: { xs: 9, sm: 10 },
                  }}
                />
                <Chip
                  size="small"
                  label={`L ${day.lowC.toFixed(1)}°`}
                  sx={{
                    bgcolor: alpha("#a78bfa", 0.12),
                    color: "#ddd6fe",
                    fontWeight: 600,
                    height: { xs: 18, sm: 20 },
                    fontSize: { xs: 9, sm: 10 },
                  }}
                />
              </Stack>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={0.6}
            sx={{
              mt: 0.4,
              width: "100%",
            }}
          >
            {[
              {
                icon: <AirIcon sx={{ fontSize: 14 }} />,
                label: `${day.windSpeed} km/h`,
              },
              {
                icon: <WaterDropIcon sx={{ fontSize: 14 }} />,
                label: `${day.humidity}%`,
              },
              {
                icon: <CompressIcon sx={{ fontSize: 14 }} />,
                label: `${day.pressure} hPa`,
              },
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  px: 0.6,
                  py: 0.3,
                  borderRadius: 999,
                  bgcolor: alpha("#0f172a", 0.9),
                  border: `1px solid ${alpha("#334155", 0.9)}`,
                  overflow: "hidden",
                }}
              >
                {item.icon}
                <Typography
                  sx={{ color: "#cbd5e1", fontSize: 10 }}
                  noWrap
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Box sx={{ mt: 0.4, minHeight: 14 }}>
            {hasAdvisories ? (
              <Typography
                sx={{
                  color: "#86efac",
                  fontSize: 10,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                • {day.advisories[0]}
              </Typography>
            ) : (
              <Typography
                sx={{
                  visibility: "hidden",
                  fontSize: 10,
                }}
              >
                • placeholder
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
