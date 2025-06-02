import UserAvatar from "./UserAvatar";

export default {
  title: "UI/Button",
  component: UserAvatar,
};

export const Default = () => <UserAvatar />;
export const LoggedIn = () => <UserAvatar />;
export const LoggedOut = () => <UserAvatar />;