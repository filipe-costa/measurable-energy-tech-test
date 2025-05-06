import { Box, Tooltip, IconButton } from "@mui/material";
import { MRT_Row, MRT_TableInstance } from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CarbonIntensity } from "../types";

export const TableRowActions = ({
  row,
  table,
  onDelete,
}: {
  row: MRT_Row<CarbonIntensity>;
  table: MRT_TableInstance<CarbonIntensity>;
  onDelete: (row: MRT_Row<CarbonIntensity>) => void;
}) => {
  return (
    <Box sx={{ display: "flex", gap: "1rem" }}>
      <Tooltip title="Edit">
        <IconButton onClick={() => table.setEditingRow(row)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton color="error" onClick={() => onDelete(row)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
