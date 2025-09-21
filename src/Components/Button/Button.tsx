import React from 'react'
import './Button.css'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface TextButton {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    icon: IconDefinition;
    color: string;
    typeBtn?: 'button' | 'ahref'
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
}

const Button: React.FC<TextButton> = ({ text, type = 'button', onClick, icon, color, typeBtn = 'button', href, target = '_blank', rel = 'noopener noreferrer' }) => {
    return (
        <>
            {typeBtn === 'button' ? (
                <button className={`button ${color}`} type={type} onClick={onClick}>
                    {text}
                    <FontAwesomeIcon icon={icon} />
                </button>
            ) : (
                <a
                    href={href}
                    target={target}
                    rel={rel}
                    className={`button ${color}`}
                >
                    {text}
                    <FontAwesomeIcon icon={icon} />
                </a>
            )
            }
        </>
    )
}

export default Button