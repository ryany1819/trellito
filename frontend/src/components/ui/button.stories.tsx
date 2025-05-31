import { Button } from "./button";

export default {
  title: "UI/Button",
  component: Button,
};

export const Default = () => <Button>Button</Button>;
export const Secondary = () => <Button variant="secondary">Secondary</Button>;
export const Destructive = () => <Button variant="destructive">Destructive</Button>;
export const Outline = () => <Button variant="outline">Outline</Button>;
export const Ghost = () => <Button variant="ghost">Ghost</Button>;
