import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CIcon } from '@coreui/icons-react';
import { cilHamburgerMenu, cilBell, cilEnvelopeOpen, cilListRich, cilSun, cilMoon } from '@coreui/icons';
import { CAvatar, CNavbar, CContainer, CButton } from '@coreui/react';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';
export const Topbar = ({ onToggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme.isDark;
    const [hovered, setHovered] = useState(null);
    const [themeHovered, setThemeHovered] = useState(false);
    const iconColor = isDarkMode ? '#f8f9fa' : '#212529';
    const iconBtnStyle = {
        backgroundColor: 'transparent',
        border: 'none',
        padding: '0.5rem',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: iconColor,
    };
    const iconBtnHoverStyle = {
        ...iconBtnStyle,
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    };
    return (_jsx(CNavbar, { className: "shadow-sm px-4", style: { backgroundColor: theme.colors.cardBg }, children: _jsx(CContainer, { fluid: true, children: _jsxs("div", { className: "d-flex w-100 justify-content-between align-items-center", children: [_jsx("button", { onClick: onToggleSidebar, style: hovered === 'menu' ? iconBtnHoverStyle : iconBtnStyle, onMouseEnter: () => setHovered('menu'), onMouseLeave: () => setHovered(null), "aria-label": "Toggle Sidebar", children: _jsx(CIcon, { icon: cilHamburgerMenu, size: "lg", style: { color: iconColor } }) }), _jsxs("div", { className: "d-flex align-items-center", style: { gap: '1.5rem' }, children: [[{ id: 'bell', icon: cilBell }, { id: 'envelope', icon: cilEnvelopeOpen }, { id: 'list', icon: cilListRich }].map(({ id, icon }) => (_jsx("button", { style: hovered === id ? iconBtnHoverStyle : iconBtnStyle, onMouseEnter: () => setHovered(id), onMouseLeave: () => setHovered(null), "aria-label": id, children: _jsx(CIcon, { icon: icon, size: "lg", style: { color: iconColor } }) }, id))), _jsx("div", { className: "d-flex align-items-center px-3", style: {
                                    borderLeft: `1px solid var(--app-borderColor)`,
                                    borderRight: `1px solid var(--app-borderColor)`,
                                    height: '32px',
                                    backgroundColor: themeHovered
                                        ? isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                        : 'transparent',
                                    borderRadius: '6px',
                                    transition: 'background-color 0.2s ease',
                                    cursor: 'pointer',
                                }, onMouseEnter: () => setThemeHovered(true), onMouseLeave: () => setThemeHovered(false), children: _jsx(CButton, { color: "link", className: "p-0", onClick: toggleTheme, "aria-label": "Toggle theme", style: { color: iconColor }, children: _jsx(CIcon, { icon: isDarkMode ? cilSun : cilMoon, size: "lg" }) }) }), _jsx(CAvatar, { src: '/images/avatars/1.jpg', size: "lg" })] })] }) }) }));
};
