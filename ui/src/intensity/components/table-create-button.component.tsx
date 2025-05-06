import { MRT_TableInstance } from "material-react-table";
import { CarbonIntensity } from "../types";
import { Button } from "@mui/material";

export const TableCreateButton = ({
  table,
}: {
  table: MRT_TableInstance<CarbonIntensity>;
}) => {
  return (
    <Button
      variant="contained"
      onClick={() => {
        table.setCreatingRow(true);
      }}
    >
      Create
    </Button>
  );
};
