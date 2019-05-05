import React, { Component, FC } from "react";
import { Tag, Tooltip } from "antd";

interface TagGroupProps {
    tags: string[];
}

export const TagGroup: FC<TagGroupProps> = ({ tags }) => {
    return (<div>
        {tags.map(tag => {
            const isLongTag = tag.length > 20;
            const tagElem = (
                <Tag key={tag}>
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </Tag>
            );
            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
    </div>)
}