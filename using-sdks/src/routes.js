import Home from "./pages/Home";
import Firestore from "./pages/Firestore";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/firestore",
    component: Firestore,
  },
];

export default routes;
