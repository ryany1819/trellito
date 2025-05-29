import { Button } from "./button";

export default {
    title: "UI/Button",
    component: Button,
};

export const Default = () => <Button>Click Me</Button>;
export const Outline = () => <Button variant="outline">Click Me</Button>;