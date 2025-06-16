import { ComponentProps } from "react";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

export function EmptyHeart(props: ComponentProps<'div'>) {
    return (
        <div {...props}>
            <AiOutlineHeart />
        </div>
    )
}

export function FilledHeart(props: ComponentProps<'div'>) {
    const filledHeartStyle = {
        color: 'orange'
    };

    return (
        <div style={filledHeartStyle} {...props}>
            <AiFillHeart />
        </div>
    );
}
