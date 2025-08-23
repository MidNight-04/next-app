// 'use client';

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from '../../components/ui/sidebar';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useAuthStore } from '../../store/useAuthStore';
// import { getDashboardSidebar } from '../../constant/dashboardSidebarData';
// import { usePathname } from 'next/navigation';
// import { cn } from '../../lib/utils';
// import { NavUser } from '../../components/nav-user';
// import { useRef } from 'react';
// import { useContainerScrollRestore } from '../../hooks/useContainerScrollRestore';

// const SideNav = () => {
//   const containerRef = useRef(null);
//   const userType = useAuthStore(state => state.userType);
//   const username = useAuthStore(state => state.username);
//   const email = useAuthStore(state => state.email);
//   const profileImage = useAuthStore(state => state.profileImage);
//   const hydrated = useAuthStore.persist?.hasHydrated();
//   const content = getDashboardSidebar(userType) || [];
//   const path = usePathname();

//   useContainerScrollRestore(hydrated, containerRef);

//   const user = {
//     name: username || 'User',
//     email: email || 'no-email@domain.com',
//     avatar: profileImage || '/avatars/shadcn.jpg',
//   };

//   return (
//     <Sidebar>
//       <SidebarContent
//         ref={containerRef}
//         className="bg-secondary overflow-y-auto"
//       >
//         <SidebarGroup className="pr-0 pl-5">
//           <SidebarHeader>
//             <Link href="/admin/home" className="pt-[14px] block">
//               <Image
//                 src="/logo_white.png"
//                 alt="logo"
//                 width={100}
//                 height={36}
//                 priority
//                 className="h-9 w-auto"
//               />
//             </Link>
//           </SidebarHeader>

//           <SidebarGroupContent>
//             {content.map((section, index) => (
//               <SidebarMenu key={section.name}>
//                 <SidebarGroupLabel className="text-[#8a8a8a] font-[700] text-[13px] font-ubuntu">
//                   {section.name}
//                 </SidebarGroupLabel>

//                 {section.menuItem.map(menu => {
//                   const isActive = path.startsWith(menu.path);
//                   return (
//                     <SidebarMenuItem key={menu.feildName}>
//                       <SidebarMenuButton
//                         className="pr-0 hover:bg-[#EEE9DA] hover:text-black hover:scale-105 transition-all duration-100 ease-in-out"
//                         asChild
//                       >
//                         <Link
//                           href={menu.path}
//                           className={cn(
//                             'text-[#93BFCF] font-normal flex flex-row justify-between items-center',
//                             isActive && 'text-[#EEE9DA]'
//                           )}
//                         >
//                           <div className="flex flex-row gap-2 text-base items-center">
//                             <span>{menu.iconName}</span>
//                             <span>{menu.feildName}</span>
//                           </div>
//                           {isActive && (
//                             <span className="bg-[#EEE9DA] w-[6px] h-full rounded-md" />
//                           )}
//                         </Link>
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   );
//                 })}

//                 {index !== content.length - 1 && (
//                   <hr className="border-[#565656] ml-2 my-4 w-[85%]" />
//                 )}
//               </SidebarMenu>
//             ))}
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter className="bg-secondary">
//         <NavUser user={user} />
//       </SidebarFooter>
//     </Sidebar>
//   );
// };

// export default SideNav;

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
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { useContainerScrollRestore } from '../../hooks/useContainerScrollRestore';

// Constants for better maintainability
const SIDEBAR_COLORS = {
  text: '#93BFCF',
  active: '#EEE9DA',
  hover: '#EEE9DA',
  border: '#565656',
  label: '#8a8a8a',
};

const DEFAULT_USER = {
  name: 'User',
  email: 'no-email@domain.com',
  avatar: '/avatars/shadcn.jpg',
};

// Loading skeleton component
const SidebarSkeleton = () => (
  <Sidebar>
    <SidebarContent className="bg-secondary overflow-y-auto">
      <SidebarGroup className="pr-0 pl-5">
        <SidebarHeader className="px-0">
          <div className="pt-[14px] block">
            <div className="h-16 w-56 bg-gray-300 animate-pulse rounded" />
          </div>
        </SidebarHeader>
        <SidebarGroupContent>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-2 mb-6">
              <div className="h-6 w-40 bg-gray-300 animate-pulse rounded" />
              {[1, 2, 3].map(j => (
                <div
                  key={j}
                  className="h-8 w-full bg-gray-300 animate-pulse rounded"
                />
              ))}
            </div>
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter className="bg-secondary">
      <div className="h-12 w-full bg-gray-300 animate-pulse rounded" />
    </SidebarFooter>
  </Sidebar>
);

// Individual menu item component for better organization
const SidebarMenuItemComponent = ({ menu, isActive, onNavigate }) => {
  const handleClick = useCallback(
    e => {
      // Allow for custom navigation handling if needed
      if (onNavigate) {
        onNavigate(menu.path, e);
      }
    },
    [menu.path, onNavigate]
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={cn(
          'pr-0 transition-all duration-200 ease-in-out',
          'hover:bg-[var(--sidebar-hover)] hover:text-black hover:scale-105',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
        )}
        asChild
      >
        <Link
          href={menu.path}
          onClick={handleClick}
          aria-current={isActive ? 'page' : undefined}
          className={cn(
            'font-normal flex flex-row justify-between items-center',
            'focus:outline-none',
            isActive
              ? `text-[${SIDEBAR_COLORS.active}] font-medium`
              : `text-[${SIDEBAR_COLORS.text}]`
          )}
          style={{
            '--sidebar-hover': SIDEBAR_COLORS.hover,
          }}
        >
          <div className="flex flex-row gap-2 text-base items-center min-w-0">
            <span className="flex-shrink-0" aria-hidden="true">
              {menu.iconName}
            </span>
            <span className="truncate">{menu.feildName}</span>
          </div>
          {isActive && (
            <span
              className="flex-shrink-0 w-[6px] h-full rounded-md"
              style={{ backgroundColor: SIDEBAR_COLORS.active }}
              aria-hidden="true"
            />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

// Main sidebar section component
const SidebarSection = ({ section, path, onNavigate, isLastSection }) => {
  return (
    <>
      <SidebarMenu>
        <SidebarGroupLabel
          className="font-[700] text-[13px] font-ubuntu"
          style={{ color: SIDEBAR_COLORS.label }}
        >
          {section.name}
        </SidebarGroupLabel>

        {section.menuItem?.map(menu => {
          if (!menu.path || !menu.feildName) {
            console.warn('Invalid menu item:', menu);
            return null;
          }

          const isActive = path.startsWith(menu.path);

          return (
            <SidebarMenuItemComponent
              key={menu.feildName}
              menu={menu}
              isActive={isActive}
              onNavigate={onNavigate}
            />
          );
        })}
      </SidebarMenu>

      {!isLastSection && (
        <hr
          className="ml-2 my-4 w-[85%] border-t"
          style={{ borderColor: SIDEBAR_COLORS.border }}
        />
      )}
    </>
  );
};

const SideNav = () => {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { userType, username, email, profileImage } = useAuthStore.getState();
  const hydrated = useAuthStore.persist?.hasHydrated();
  const path = usePathname();

  const user = useMemo(
    () => ({
      name: username || DEFAULT_USER.name,
      email: email || DEFAULT_USER.email,
      avatar: profileImage || DEFAULT_USER.avatar,
    }),
    [username, email, profileImage]
  );

  // Memoized sidebar content with error handling
  const content = useMemo(() => {
    try {
      setError(null);
      const sidebarData = getDashboardSidebar(userType);

      if (!Array.isArray(sidebarData)) {
        throw new Error('Invalid sidebar data format');
      }

      return sidebarData;
    } catch (err) {
      console.error('Failed to load sidebar content:', err);
      setError(err.message || 'Failed to load navigation');
      return [];
    }
  }, [userType, retryCount]);

  // Custom scroll restoration
  useContainerScrollRestore(hydrated, containerRef);

  // Handle navigation events (optional custom logic)
  const handleNavigate = useCallback((path, event) => {
    // Add any custom navigation logic here
    // For example, analytics tracking, route guards, etc.
    console.debug('Navigating to:', path);
  }, []);

  // Retry mechanism for errors
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setError(null);
  }, []);

  // Effect for handling auth state changes
  useEffect(() => {
    if (hydrated && !userType) {
      console.warn('User type not found after hydration');
    }
  }, [hydrated, userType]);

  // Show loading state
  if (!hydrated) {
    return <SidebarSkeleton />;
  }

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarContent
        ref={containerRef}
        className="bg-secondary overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <SidebarGroup className="pr-0 pl-5">
          <SidebarHeader>
            <Link
              href="/admin/home"
              className="pt-[14px] block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
              aria-label="Go to dashboard home"
            >
              <Image
                src="/logo_white.png"
                alt="Company logo"
                width={100}
                height={36}
                priority
                className="h-9 w-auto"
                onError={e => {
                  console.error('Logo failed to load');
                  e.target.style.display = 'none';
                }}
              />
            </Link>
          </SidebarHeader>

          <SidebarGroupContent>
            {content.map((section, index) => (
              <SidebarSection
                key={`${section.name}-${index}`}
                section={section}
                path={path}
                onNavigate={handleNavigate}
                isLastSection={index === content.length - 1}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-secondary border-t border-gray-200">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;
