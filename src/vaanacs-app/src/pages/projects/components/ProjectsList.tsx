import React, { useEffect, useState } from 'react';
import { List, Avatar } from 'antd';
import { apiUrl } from '../../../constants';
import { Link } from 'react-router-dom';

export interface ProjectListModel {
    name: string;
    description: string;
    _id: string;
}

export function ProjectsList() {
    const [projects, setProjects] = useState<ProjectListModel[]>([])

    useEffect(() => {
        fetch(`${apiUrl}/api/projects`)
            .then(results => results.json())
            .then(data => setProjects(data))
            .catch(e=>alert(e));
    }, []);

    const noDescriptionText = "Описание отсутствует"

    return (
        <List
            itemLayout="horizontal"
            dataSource={projects}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar>{item.name[0].toUpperCase()}</Avatar>}
                        title={<Link to={`/projects/`+item._id}>{item.name}</Link>}
                        description={item.description || noDescriptionText }
                    />
                </List.Item>
            )}
        />
    );
}