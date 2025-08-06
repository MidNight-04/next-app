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
import Image from 'next/image';
import { useAuthStore } from '../../store/useAuthStore';
import { getDashboardSidebar } from '../../constant/dashboardSidebarData';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { NavUser } from '../../components/nav-user';
import { useRef } from 'react';
import { useContainerScrollRestore } from '../../hooks/useContainerScrollRestore';

const SideNav = () => {
  const containerRef = useRef(null);
  const userType = useAuthStore(state => state.userType);
  const username = useAuthStore(state => state.username);
  const email = useAuthStore(state => state.email);
  const profileImage = useAuthStore(state => state.profileImage);
  const hydrated = useAuthStore.persist?.hasHydrated();
  const content = getDashboardSidebar(userType) || [];
  const path = usePathname();

  useContainerScrollRestore(hydrated, containerRef);

  const user = {
    name: username || 'User',
    email: email || 'no-email@domain.com',
    avatar: profileImage || '/avatars/shadcn.jpg',
  };

  return (
    <Sidebar>
      <SidebarContent
        ref={containerRef}
        className="bg-secondary overflow-y-auto"
      >
        <SidebarGroup className="pr-0 pl-5">
          <SidebarHeader>
            <Link href="/admin/home" className="pt-[14px] block">
              <Image
                src="/logo_white.png"
                alt="logo"
                width={100}
                height={36}
                priority
                className="h-9 w-auto"
              />
            </Link>
          </SidebarHeader>

          <SidebarGroupContent>
            {content.map((section, index) => (
              <SidebarMenu key={section.name}>
                <SidebarGroupLabel className="text-[#8a8a8a] font-[700] text-[13px] font-ubuntu">
                  {section.name}
                </SidebarGroupLabel>

                {section.menuItem.map(menu => {
                  const isActive = path.startsWith(menu.path);
                  return (
                    <SidebarMenuItem key={menu.feildName}>
                      <SidebarMenuButton
                        className="pr-0 hover:bg-[#EEE9DA] hover:text-black"
                        asChild
                      >
                        <Link
                          href={menu.path}
                          className={cn(
                            'text-[#93BFCF] font-normal flex flex-row justify-between items-center',
                            isActive && 'text-[#EEE9DA]'
                          )}
                        >
                          <div className="flex flex-row gap-2 text-base items-center">
                            <span>{menu.iconName}</span>
                            <span>{menu.feildName}</span>
                          </div>
                          {isActive && (
                            <span className="bg-[#EEE9DA] w-[6px] h-full rounded-md" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {index !== content.length - 1 && (
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
