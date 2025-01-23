import { redirect } from "next/navigation";
import AdminHeader from "../AdminHeader/AdminHeader";
import SideNav from "../SideNav/SideNav";
import { SidebarProvider } from "../ui/sidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { ToastContainer } from "react-toastify";

const AsideContainer = ({ children }) => {
  const isAuth = useAuthStore(state => state.isAuth);

  // if (!isAuth) {
  //   return redirect("/homepage");
  // }

  return (
    <SidebarProvider>
      <SideNav />
      <main className="min-h-100vh w-full bg-[#efefef]">
        <AdminHeader />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <section className="px-5 -md:px-2">{children}</section>
      </main>
    </SidebarProvider>
  );
};

export default AsideContainer;
