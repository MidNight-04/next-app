'use client';
import { redirect } from 'next/navigation';
// import AdminHeader from '../AdminHeader/AdminHeader';
import SideNav from '../SideNav/SideNav';
import { SidebarProvider,SidebarInset } from '../ui/sidebar';
import { useAuthStore } from '../../store/useAuthStore';

const AsideContainer = ({ children }) => {
  const isAuth = useAuthStore(state => state.isAuth);

  // if (!isAuth) {
  //   return redirect("/homepage");
  // }
  // console.log(isAuth);

  return (
    <SidebarProvider>
      <SideNav />
        <main className="min-h-100vh w-full bg-[#efefef]">
          {/* <AdminHeader /> */}
          <section className="px-5 -md:px-2">{children}</section>
        </main>
    </SidebarProvider>
  );
};

export default AsideContainer;
