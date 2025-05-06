import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import {
  MRT_Cell,
  MRT_Column,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import { useState } from "react";

export type CustomDateTimePickerProps<TData extends Record<string, unknown>> = {
  cell: MRT_Cell<TData>;
  column: MRT_Column<TData>;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
};

export const CustomDateTimePicker = <TData extends Record<string, unknown>>({
  cell,
  column,
  row,
  table,
}: CustomDateTimePickerProps<TData>) => {
  const [value, setValue] = useState<Dayjs | null>(() =>
    dayjs(cell.getValue<string>())
  );

  const handleChange = (date: Dayjs | null) => {
    const newDate = date ? date : null;
    // @ts-expect-error this is how we are supposed to edit values in material-react-table
    row._valuesCache[column.id] = newDate?.toISOString();
    table.setEditingRow(row);
    setValue(newDate);
  };

  return <DateTimePicker value={value} onChange={handleChange} />;
};
