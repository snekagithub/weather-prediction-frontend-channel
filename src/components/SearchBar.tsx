import { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search, Send, X } from "lucide-react";

interface SearchBarProps {
  onSelect: (city: string) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const city = value.trim();
    if (!city) return;
    onSelect(city);
  };

  const clearInput = () => {
    setValue("");
    onSelect("");
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: { xs: 4, md: 6 },
        mb: { xs: 5, md: 7 },
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 560,
          borderRadius: "999px",
          p: 1,
          background:
            "linear-gradient(135deg, rgba(56,189,248,0.7), rgba(129,140,248,0.95), rgba(52,211,153,0.9))",
          boxShadow: "0 30px 80px rgba(15,23,42,0.95)",
        }}
      >
        <Box
          sx={{
            borderRadius: "999px",
            px: 2,
            py: 0.5,
            background:
              "radial-gradient(circle at 0% 0%, rgba(148,163,184,0.18), transparent 55%), rgba(15,23,42,0.98)",
            backdropFilter: "blur(18px)",
          }}
        >
          <TextField
            fullWidth
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            variant="outlined"
            autoComplete="off"
            placeholder='Search city…  (e.g. "Chennai")'
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                background: "transparent",
                color: "#e2e8f0",
                px: 0.5,
                "& fieldset": { border: "none" },
              },
              "& .MuiInputBase-input": {
                py: 1.5,
                fontSize: 15,
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(148,163,184,0.9)",
                opacity: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 34,
                      height: 34,
                      borderRadius: "999px",
                      background:
                        "radial-gradient(circle at 0% 0%, rgba(59,130,246,1), rgba(14,165,233,0.95))",
                      mr: 1,
                      boxShadow: "0 12px 30px rgba(15,23,42,0.95)",
                    }}
                  >
                    <Search size={18} />
                  </Box>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                    }}
                  >
                    {value && (
                      <IconButton
                        size="small"
                        onClick={clearInput}
                        sx={{
                          borderRadius: "999px",
                          background: "rgba(15,23,42,0.9)",
                          border: "1px solid rgba(148,163,184,0.7)",
                          "&:hover": {
                            background: "rgba(15,23,42,1)",
                          },
                        }}
                      >
                        <X size={16} />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={handleSubmit}
                      sx={{
                        borderRadius: "999px",
                        px: 1.8,
                        py: 0.75,
                        background:
                          "linear-gradient(120deg, rgba(96,165,250,0.95), rgba(129,140,248,1))",
                        boxShadow: "0 18px 40px rgba(15,23,42,0.95)",
                        "&:hover": {
                          background:
                            "linear-gradient(120deg, rgba(59,130,246,1), rgba(79,70,229,1))",
                        },
                      }}
                    >
                      <Send size={18} />
                    </IconButton>
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
