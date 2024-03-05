import { useState } from "react";
import { NavigationButtonInterface } from "../../../interfaces/Global";

interface TableContentsProps {
    header: string,
    data: NavigationButtonInterface[]
}



export const TableContents = ({ header, data }: TableContentsProps) => {
    const [active, setActive] = useState<number | null>(null)

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

    return (
        <div>
            <div>
                {header}
            </div>
            <nav>
                <ul>
                    {
                        data.map((item, index) => (
                            <li key={index}>
                                <button className={`cursor-pointer border-l pl-2 hover:border-gray-400 ${index === active && 'border-green-500 hover:border-green-500 text-green-500'} `} onClick={() => handlerMenuNav(item, index)} type="button">
                                    item.text
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </nav>
        </div >
    );
};
