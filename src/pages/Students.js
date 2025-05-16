import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as icon from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import InfoStatWidget from '../components/InfoStatWidget';
import StudentTable from '../components/StudentTable';
const Students = () => {
    const widgets = [
        { icon: icon.cilPeople, value: '1,283', label: 'Total Students', tooltip: 'Amount of Students' },
        { icon: icon.cilBirthdayCake, value: '22', label: 'Average Age', tooltip: 'Mean age of all students' },
        { icon: icon.cilLanguage, value: '37', label: 'Languages', tooltip: 'The number of different spoken languages' },
        { icon: icon.cilPushchair, value: '111', label: 'Parents', tooltip: 'Students who are parents' },
    ];
    return (_jsxs("div", { style: { padding: '2rem' }, children: [_jsx(CRow, { children: widgets.map((w, idx) => (_jsx(CCol, { xs: 12, sm: 6, md: 3, className: "mb-3", children: _jsx(InfoStatWidget, { ...w }) }, idx))) }), _jsx(StudentTable, {})] }));
};
export default Students;
