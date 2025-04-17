import React from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CNavItem,
  CNavLink,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CNavTitle,
  CSidebarToggler,
} from '@coreui/react';
import { useHistory } from 'react-router-dom';
import { cilSpeedometer, cilList } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import Logo from '../assets/images/logo.svg';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const [sidebarShow, setSidebarShow] = React.useState(true);
  const [sidebarUnfoldable, setSidebarUnfoldable] = React.useState(false);
  const history = useHistory();

  const handleNavigation = (path: string) => {
    history.push(path);
  };

  return (
    <div className="wrapper d-flex flex-column min-vh-100 bg-light">
      <CHeader position="sticky" className="mb-4">
        <CContainer fluid>
          <CHeaderBrand className="mx-auto d-md-none">
            <img src={Logo} height={48} alt="Logo" />
          </CHeaderBrand>
          <CHeaderNav className="d-none d-md-flex me-auto">
            <CNavItem>
              <CNavLink 
                onClick={() => handleNavigation('/dashboard')} 
                style={{ cursor: 'pointer' }}
                active
              >
                <CIcon icon={cilSpeedometer} className="me-2" />
                Dashboard
              </CNavLink>
            </CNavItem>
          </CHeaderNav>
        </CContainer>
      </CHeader>

      <div className="body flex-grow-1 px-3">
        <CSidebar
          position="fixed"
          visible={sidebarShow}
          onVisibleChange={(visible: boolean) => setSidebarShow(visible)}
          unfoldable={sidebarUnfoldable}
        >
          <CSidebarBrand className="d-flex">
            <div className="sidebar-brand-full" style={{ width: '150px' }}>
              <img src={Logo} height={35} alt="Logo" className="me-2" />
              <span className={sidebarUnfoldable ? 'd-none' : ''}>FURNITURE</span>
            </div>
            <div className="sidebar-brand-narrow" style={{ width: '46px' }}>
              <img src={Logo} height={35} alt="Logo" />
            </div>
          </CSidebarBrand>
          <CSidebarNav>
            <CNavTitle className={sidebarUnfoldable ? 'd-none' : ''}>
              Navigation
            </CNavTitle>
            <CNavItem>
              <CNavLink 
                onClick={() => handleNavigation('/dashboard')} 
                style={{ cursor: 'pointer' }}
                active={history.location.pathname === '/dashboard'}
              >
                <CIcon icon={cilSpeedometer} className="nav-icon" />
                {!sidebarUnfoldable && 'Dashboard'}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink 
                onClick={() => handleNavigation('/bm01')} 
                style={{ cursor: 'pointer' }}
                active={history.location.pathname === '/bm01'}
              >
                <CIcon icon={cilList} className="nav-icon" />
                {!sidebarUnfoldable && 'BM01'}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink 
                onClick={() => handleNavigation('/bm02')} 
                style={{ cursor: 'pointer' }}
                active={history.location.pathname === '/bm02'}
              >
                <CIcon icon={cilList} className="nav-icon" />
                {!sidebarUnfoldable && 'BM02'}
              </CNavLink>
            </CNavItem>
          </CSidebarNav>
          <CSidebarToggler
            className="d-none d-lg-flex"
            onClick={() => setSidebarUnfoldable(!sidebarUnfoldable)}
          />
        </CSidebar>

        <CContainer lg>
          {children}
        </CContainer>
      </div>
    </div>
  );
};

export default DefaultLayout; 