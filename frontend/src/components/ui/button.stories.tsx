import { Button } from "./button";
import { ThemeProvider } from "@/providers/theme-provider";

export default {
  title: "UI/Button",
  component: Button,
  decorators: [
    (Story: any) => (
      <ThemeProvider defaultTheme="dark">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export const Default = () => <Button>Button</Button>;
export const Secondary = () => <Button variant="secondary">Secondary</Button>;
export const Destructive = () => (
  <Button variant="destructive">Destructive</Button>
);
export const Outline = () => <Button variant="outline">Outline</Button>;
export const Ghost = () => <Button variant="ghost">Ghost</Button>;
