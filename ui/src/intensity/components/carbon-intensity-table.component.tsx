import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";

import { useCallback, useMemo, useState } from "react";
import { CarbonIntensity } from "../types";
import {
  useCreateCarbonIntensity,
  useDeleteCarbonIntensity,
  useGetCarbonIntensities,
  useUpdateCarbonIntensity,
} from "../api";

import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { TableRowActions } from "./table-row-actions.component";
import { ErrorMessages } from "./table-error-messages.component";
import { TableCreateButton } from "./table-create-button.component";
import dayjs from "dayjs";
import { CustomDateTimePicker } from "./custom-date-time-picker.component";

const CARBON_INTENSITY_INDICES = ["low", "moderate", "high", "very high"];

const formatDate = (date: string) => dayjs(date).format("LLLL").toString();

export const CarbonIntensityTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const { data = [], isLoading, isError } = useGetCarbonIntensities();

  const handleError = useCallback((error: Error | AxiosError) => {
    if (axios.isAxiosError(error)) {
      const messages = Array.isArray(error.response?.data.message)
        ? error.response?.data.messages
        : [error.response?.data.message];
      toast.error(<ErrorMessages messages={messages} />);
    }
  }, []);

  const handleSave = useCallback(({ id }: CarbonIntensity) => {
    toast.success(`Carbon Intensity with ID ${id} has been saved.`);
  }, []);

  const handleDelete = useCallback(({ id }: Pick<CarbonIntensity, "id">) => {
    toast.success(`Carbon Intensity with ID ${id} has been deleted.`);
  }, []);

  const {
    mutateAsync: createCarbonIntensity,
    isPending: isCreatingCarbonIntensity,
  } = useCreateCarbonIntensity({
    onError: handleError,
    onSuccess: handleSave,
  });
  const {
    mutateAsync: updateCarbonIntensity,
    isPending: isUpdatingCarbonIntensity,
  } = useUpdateCarbonIntensity({
    onError: handleError,
    onSuccess: handleSave,
  });

  const {
    mutateAsync: deleteCarbonIntensity,
    isPending: isDeletingCarbonIntensity,
  } = useDeleteCarbonIntensity({
    onError: handleError,
    onSuccess: handleDelete,
  });

  const handleCreate: MRT_TableOptions<CarbonIntensity>["onCreatingRowSave"] =
    async ({ table, values }) => {
      const newValidationErrors = isValidCarbonIntensity(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createCarbonIntensity(values);
      table.setCreatingRow(null);
    };

  const handleUpdate: MRT_TableOptions<CarbonIntensity>["onEditingRowSave"] =
    async ({ table, values }) => {
      const newValidationErrors = isValidCarbonIntensity(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateCarbonIntensity(values);
      table.setEditingRow(null);
    };

  const columns = useMemo<MRT_ColumnDef<CarbonIntensity>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 30,
        enableEditing: false,
        Edit: () => null,
      },
      {
        accessorKey: "from",
        header: "From",
        Cell: (props) => {
          return formatDate(props.cell.getValue<string>());
        },
        Edit: (props) => <CustomDateTimePicker {...props} />,
        muiEditTextFieldProps: {
          error: !!validationErrors?.from,
          helperText: validationErrors?.from,
        },
      },
      {
        accessorKey: "to",
        header: "To",
        Cell: (props) => {
          return formatDate(props.cell.getValue<string>());
        },
        Edit: (props) => <CustomDateTimePicker {...props} />,
        muiEditTextFieldProps: {
          error: !!validationErrors?.to,
          helperText: validationErrors?.to,
        },
      },
      {
        accessorKey: "actual",
        header: "Actual",
        muiEditTextFieldProps: {
          required: true,
          type: "number",
          error: !!validationErrors?.actual,
          helperText: validationErrors?.actual,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              actual: undefined,
            }),
        },
      },
      {
        accessorKey: "forecast",
        header: "Forecast",
        muiEditTextFieldProps: {
          required: true,
          type: "number",
          error: !!validationErrors?.forecast,
          helperText: validationErrors?.forecast,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              forecast: undefined,
            }),
        },
      },
      {
        accessorKey: "index",
        header: "Index",
        editVariant: "select",
        editSelectOptions: CARBON_INTENSITY_INDICES,
        muiEditTextFieldProps: {
          select: true,
          required: true,
          error: !!validationErrors?.index,
          helperText: validationErrors?.index,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              index: undefined,
            }),
        },
      },
    ],
    [validationErrors]
  );

  const table = useMaterialReactTable({
    data,
    columns,
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    getRowId: (row) => `${row.id}`,
    onCreatingRowSave: handleCreate,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleUpdate,
    onEditingRowCancel: () => setValidationErrors({}),
    renderRowActions: ({ row, table }) => (
      <TableRowActions
        row={row}
        table={table}
        onDelete={(row) => deleteCarbonIntensity(row.id)}
      />
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <TableCreateButton table={table} />
    ),
    state: {
      isLoading,
      isSaving:
        isCreatingCarbonIntensity ||
        isUpdatingCarbonIntensity ||
        isDeletingCarbonIntensity,
      showAlertBanner: isError,
    },
    enableFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
  });

  return <MaterialReactTable table={table} />;
};

const isPositive = (value: number) => value > 0;
const isNotEmpty = (value: string) => !!value.length;
const isValidDate = (val: string) => isNotEmpty(val) && dayjs(val).isValid();

const isValidateNumberString = (val: number | string) => {
  const newVal = Number(val);
  return isPositive(newVal);
};

const isValidCarbonIntensity = ({
  from,
  to,
  actual,
  forecast,
  index,
}: CarbonIntensity) => {
  return {
    from: !isValidDate(from) ? "Invalid date format" : "",
    to: !isValidDate(to) ? "Invalid date format" : "",
    actual: !isValidateNumberString(actual) ? "Invalid number format" : "",
    forecast: !isValidateNumberString(forecast) ? "Invalid number format" : "",
    index: !isNotEmpty(index) ? "Required" : "",
  };
};
