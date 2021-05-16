import { Layout, Menu, Dropdown, Space } from 'antd';
import { LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { Box, Text, Image } from 'rebass';
import Link from 'next/link';
import { useContext } from 'react';
import { AppContextComponent } from 'dsl-admin-base/lib/context';
import UserIcon from 'assets/icons/user.svg';

const { Header } = Layout;

export default function TheHeader() {
  const {
    state: { currentUser },
  } = useContext(AppContextComponent);

  const menu = (
    <Menu>
      <Menu.Item>
        <Link href="/profile">
          <Space size={10}>
            <ProfileOutlined /> Profile
          </Space>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/login">
          <Space size={10}>
            <LogoutOutlined></LogoutOutlined> Logout
          </Space>
        </Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <Box
      sx={{
        bg: 'white',
        position: 'relative',
        px: '22px',
      }}
    >
      <Header style={{ backgroundColor: '#fff' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box>
            {currentUser?.brand?.adminLogo && (
              <Image
                src={currentUser.brand.adminLogo}
                sx={{ height: 55, ml: 40, position: 'relative', top: '8px' }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown overlay={menu} trigger={['click']}>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 3 }}>
                <UserIcon />
                <Text sx={{ lineHeight: 1.6, ml: 2, fontWeight: 400 }}>
                  {currentUser?.firstName} {currentUser?.lastName}
                </Text>
              </Box>
            </Dropdown>
          </Box>
        </Box>
      </Header>
    </Box>
  );
}
