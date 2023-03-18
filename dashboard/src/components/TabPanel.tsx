import { Box } from "@mui/material";

export const TabPanel = ({ active, children }: { active: boolean; children: React.ReactNode }) => {
  return (
    <Box role="tabpanel" hidden={!active}>
      {children}
    </Box>
  );
};
