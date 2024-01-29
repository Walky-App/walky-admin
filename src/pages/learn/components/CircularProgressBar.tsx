
import { useEffect, useState } from 'react';

interface ProgressData {
    progressData: {
        total: number,
        complete: number
    }
}


export default function CircularProgressBar({ progressData }: ProgressData) {
    const [currentSkill, setCurrentSkill] = useState(progressData);
    const percent = Math.floor((currentSkill.complete / currentSkill.total) * 100);

    const circumference = 2 * (22 / 7) * 30;
    const offset = circumference - (percent / 100) * circumference;

    useEffect(() => {
        const svgText: any = document.getElementById('svgText') as HTMLElement;
        const textBounding = svgText?.getBBox();
        const textWidth = textBounding?.width || 0;

        const adjustedOffset = offset + (circumference - textWidth) / 2;
        if (svgText) {
            svgText.style.strokeDashoffset = `${adjustedOffset}px`;
        }
    }, [percent, offset]);



    return (
        <svg className="transform w-24 h-full">
            <circle cx="48" cy="48" r="30" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-gray-300" />
            <circle
                cx="48"
                cy="48"
                r="30"
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${offset}px`}
                className="text-green-600"
                transform="rotate(-90 48 48)"
            />
            <text id="svgText" x="48" y="52" textAnchor="middle" fontSize="0.75em" fill="black">
                {`${currentSkill.complete} / ${currentSkill.total}`}
            </text>
        </svg>
    );
};
