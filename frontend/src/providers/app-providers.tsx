import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { AuthProvider } from "./auth-provider";
import { ThemeProvider } from "./theme-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <ReduxProvider store={store}>
        <AuthProvider>{children}</AuthProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
};
