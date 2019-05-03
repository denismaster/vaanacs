import React from 'react';
import { Card } from 'antd';
import { ProjectsList } from './components/ProjectsList';

import { Typography } from 'antd';
const { Title } = Typography;

export function Projects() {
    return (
        <div>
            <Title level={3}>Проекты</Title>
            <Card>
                <ProjectsList />
            </Card>
        </div>
    )
}

