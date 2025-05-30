import { Provider } from "react-redux";
import { store } from "@/store";
import CreateBoardDialog from "./CreateBoardDialog";

export default {
  title: "Components/CreateBoardDialog",
  component: CreateBoardDialog,
};

export const Default = {
  render: () => (
    <Provider store={store}>
      <CreateBoardDialog />,
    </Provider>
  ),
};
