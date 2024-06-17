import { Outlet, useLoaderData } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "./style.module.css";

export default function AccountLayout() {
  const dataReceived = useLoaderData();
  const areaRefactor =
    dataReceived.area.charAt(0).toUpperCase() +
    dataReceived.area.slice(1).toLowerCase();
  return (
    <main className={style.accountContainer}>
      <Sidebar
        abbrevUserName={dataReceived.fullname.substring(0, 2).toUpperCase()}
        userName={dataReceived.fullname}
        userArea={areaRefactor}
        typeAccount={dataReceived.typeAccount}
      />
      <Outlet />
    </main>
  );
}
