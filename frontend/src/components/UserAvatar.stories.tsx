import UserAvatar from "./UserAvatar";

export default {
  title: "Comp/UserAvatar",
  component: UserAvatar,
};

export const Default = () => <UserAvatar />;
export const LoggedIn = () => <UserAvatar isLoggedIn={false} />;
export const LoggedOut = () => <UserAvatar isLoggedIn={true} user={{name: 'John Doe'}} />;