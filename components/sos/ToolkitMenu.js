// components/sos/ToolkitMenu.js
// The toolkit's home screen: a grid of coping-tool cards rendered from
// SOS_TOOLS. Icon strings are mapped here so lib/sosTools.js stays free of MUI
// imports. Clicking a card calls onSelect(id); SosLauncher swaps in the tool.
import React from 'react';
import { Box, Typography, ButtonBase } from '@mui/material';
import { Air, Visibility, Waves, AcUnit, ArrowForward } from '@mui/icons-material';
import { tokens } from '../../lib/theme';
import { SOS_TOOLS } from '../../lib/sosTools';

const ICONS = { Air, Visibility, Waves, AcUnit };

export default function ToolkitMenu({ onSelect }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Whatever you&apos;re feeling right now, pick one. Each takes just a few minutes and works offline.
      </Typography>

      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {SOS_TOOLS.map((tool) => {
          const Icon = ICONS[tool.icon] || Air;
          return (
            <ButtonBase
              key={tool.id}
              onClick={() => onSelect(tool.id)}
              aria-label={`${tool.title} — ${tool.bestFor}`}
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                p: 2,
                borderRadius: '14px',
                border: `1px solid ${tokens.border}`,
                bgcolor: tokens.surface,
                transition: 'border-color .16s ease, transform .16s ease',
                '&:hover': { borderColor: tokens.teal, transform: 'translateY(-1px)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, width: '100%' }}>
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    color: tokens.teal,
                    bgcolor: tokens.tealSurface,
                  }}
                >
                  <Icon />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                    {tool.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {tool.subtitle}
                  </Typography>
                  <Typography variant="caption" sx={{ color: tokens.textFaint }}>
                    {tool.bestFor} · {tool.duration}
                  </Typography>
                </Box>
                <ArrowForward sx={{ color: tokens.textFaint, flexShrink: 0 }} />
              </Box>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
