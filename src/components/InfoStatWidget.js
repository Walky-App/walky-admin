import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CIcon } from '@coreui/icons-react';
import { CTooltip } from '@coreui/react';
import { useTheme } from '../hooks/useTheme'; // 👈 import the hook
const InfoStatWidget = ({ icon, value, label, tooltip }) => {
    const { theme } = useTheme();
    const isDark = theme.isDark;
    return (_jsx(CTooltip, { content: tooltip, placement: "bottom", style: {
            '--cui-tooltip-bg': theme.isDark ? '#f8f9fa' : '#000',
            '--cui-tooltip-color': theme.isDark ? '#212529' : '#fff',
            '--cui-tooltip-border-color': theme.isDark ? '#adb5bd' : '#000',
        }, children: _jsxs("div", { className: "d-flex rounded border overflow-hidden", style: {
                width: '100%',
                maxWidth: '279px',
                height: '72px',
                borderColor: theme.colors.borderColor,
            }, children: [_jsx("div", { className: "d-flex align-items-center justify-content-center", style: {
                        width: '30%',
                        backgroundColor: isDark ? '#2a2d36' : '#fff',
                    }, children: _jsx(CIcon, { icon: icon, height: 32, width: 32, style: { color: isDark ? theme.colors.bodyColor : '#000' } }) }), _jsxs("div", { className: "d-flex flex-column justify-content-center align-items-start px-3", style: {
                        width: '70%',
                        backgroundColor: theme.colors.primary,
                        color: '#fff',
                    }, children: [_jsx("strong", { className: "fs-5", children: value }), _jsx("span", { children: label })] })] }) }));
};
export default InfoStatWidget;
