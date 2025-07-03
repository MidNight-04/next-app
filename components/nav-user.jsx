'use client';

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const username = useAuthStore(state => state.username);
  const email = useAuthStore(state => state.email);
  const setLogout = useAuthStore(state => state.setLogout);

  const handleLogout = async () => {
    setLogout();
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar() {
    const name = username || 'user';
    const splitName = name.split(' ');
    const initials = splitName
      .map(n => n[0])
      .join('')
      .toUpperCase();
    const firstLetter = splitName[0][0].toUpperCase();
    const secondLetter = splitName[1] ? splitName[1][0].toUpperCase() : '';
    const initialsColor = stringToColor(initials);
    return {
      sx: {
        height: '24px',
        width: '24px',
        fontSize: '1rem',
        bgcolor: initialsColor,
      },
      children: `${firstLetter}${secondLetter}`,
    };
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-secondary data-[state=open]:text-sidebar-accent-foreground hover:bg-secondary hover:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback
                  className="rounded-lg text-white"
                  style={{ backgroundColor: stringAvatar()?.sx?.bgcolor }}
                >
                  {stringAvatar()?.children}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-primary font-medium">
                  {username}
                </span>
                <span className=" text-primary-foreground truncate text-xs">
                  {email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-primary" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-secondary text-primary"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback
                    className="rounded-lg"
                    style={{ backgroundColor: stringAvatar()?.sx?.bgcolor }}
                  >
                    {stringAvatar()?.children}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{username}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
