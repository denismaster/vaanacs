import React, { FC } from 'react';
import { List, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { ProjectListModel } from '../models/ProjectListModel';
import { TagGroup } from '../../../components/TagGroup';

interface ProjectListProps {
    projects: ProjectListModel[];
}

export const ProjectsList: FC<ProjectListProps> = ({ projects }) => {
    const noDescriptionText = "Описание отсутствует"

    return (
        <List
            itemLayout="horizontal"
            dataSource={projects}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar>{item.name[0].toUpperCase()}</Avatar>}
                        title={<Link to={`/projects/` + item._id}>{item.name}</Link>}
                        description={item.description || noDescriptionText}
                    />
                    <TagGroup tags={item.tags}/>
                </List.Item>
            )}
        />
    );
}