'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '../../components/ui/sidebar';
import Link from 'next/link';
import { useAuthStore } from '../../store/useAuthStore';
import { getDashboardSidebar } from '../../constant/dashboardSidebarData';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import Image from 'next/image';
import { NavUser } from '../../components/nav-user';

const user = {
  name: 'Thikedaar',
  email: 'test@thikedaar.com',
  avatar: '/avatars/shadcn.jpg',
};

const SideNav = () => {
  const userType = useAuthStore(state => state.userType);
  const state = useAuthStore(state => state);
  const content = getDashboardSidebar(userType || 'ROLE_CLIENT');
  // const content = getDashboardSidebar(userType || 'ROLE_CLIENT');
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="bg-secondary">
        <SidebarGroup className="pr-0 pl-5">
          <SidebarHeader>
            <Link href={'/admin/home'} className="pt-[14px]">
              <img src="/logo_white.png" alt="log" className="h-9" />
            </Link>
          </SidebarHeader>
          <SidebarGroupContent>
            {content.map((item, index) => (
              <SidebarMenu key={item.name}>
                <SidebarGroupLabel className="text-[#8a8a8a] font-[700] text-[13px] font-ubuntu">
                  {item.name}
                </SidebarGroupLabel>
                <>
                  {item.menuItem.map(item => (
                    <SidebarMenuItem key={item.feildName}>
                      <SidebarMenuButton
                        className="pr-0 hover:bg-[#EEE9DA] hover:text-black"
                        asChild
                      >
                        <Link
                          className={cn(
                            'text-[#93BFCF] font-normal flex flex-row justify-between',
                            path.includes(item.path) ? 'text-[#EEE9DA] ' : ''
                          )}
                          href={item.path}
                        >
                          <div className="flex flex-row gap-2 text-base items-center">
                            <span>{item.iconName}</span>
                            <span>{item.feildName}</span>
                          </div>
                          {path.includes(item.path) && (
                            <span className="bg-[#EEE9DA] w-[6px] h-[140%] rounded-md" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
                {content.length - 1 === index ? (
                  ''
                ) : (
                  <hr className="border-[#565656] ml-2 my-4 w-[85%]" />
                )}
              </SidebarMenu>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-secondary">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;

// import { AppSidebar } from '../../components/app-sidebar';
// import { SidebarInset, SidebarProvider } from '../../components/ui/sidebar';

// export default function Page() {
//   return (
//     <SidebarProvider
//       style={{
//         '--sidebar-width': 'calc(var(--spacing) * 72)',
//         '--header-height': 'calc(var(--spacing) * 12)',
//       }}
//     >
//       <AppSidebar variant='inset' />
//       <SidebarInset>
//         <div className='flex flex-1 flex-col'>
//           <div className='@container/main flex flex-1 flex-col gap-2'>

//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }
