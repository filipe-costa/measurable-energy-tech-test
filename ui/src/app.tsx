import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { CarbonIntensityPage } from "./intensity/intensity.page";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CarbonIntensityPage />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          theme="colored"
          hideProgressBar
        />
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
