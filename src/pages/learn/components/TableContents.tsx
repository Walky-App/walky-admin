import { useEffect, useState } from "react";
import { NavigationButtonInterface } from "../../../interfaces/Global";
import { useAdmin } from "../../../contexts/AdminContext";
import { Section } from "../../../interfaces/unit";

interface TableContentsProps {
    header: string,
}

export const TableContents = ({ header }: TableContentsProps) => {
    const [active, setActive] = useState<number | null>(null)
    const [dataContents, setDataContents] = useState<NavigationButtonInterface[]>([])
    const { unit } = useAdmin()

    const handlerMenuNav = (item: NavigationButtonInterface, index: number) => {
        scrollToElement(item.to)
        setActive(index)
    }

    const scrollToElement = (id: string) => {
        const headerHeight = document.getElementById('header-shell')?.offsetHeight || 0;
        const targetElement = document.getElementById(id);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (unit) {
            const data: NavigationButtonInterface[] = unit.sections.map((item: Section) => {
                return {
                    to: `${item.title.replace(' ', '-')}`,
                    text: item.title
                }
            });
            setDataContents(data)
        }
    }, [unit])


    return (
        <div>
            <div>
                {header}
            </div>
            <nav>
                <ul>
                    {
                        dataContents.map((item, index) => (
                            <li key={`content-item-${index}`}>
                                <button className={`cursor-pointer border-l pl-2 hover:border-gray-400 ${index === active && 'border-green-500 hover:border-green-500 text-green-500'} `} onClick={() => handlerMenuNav(item, index)} type="button">
                                    {item.text}
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </nav>
        </div >
    );
};
