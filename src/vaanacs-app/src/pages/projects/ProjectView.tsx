import React from 'react';
import { Card } from 'antd';
import { Typography } from 'antd';
import { RouteComponentProps } from 'react-router';
const { Title } = Typography;

interface ProjectViewRouteParams {
    id: string;
}

interface ProjectViewProps extends RouteComponentProps<ProjectViewRouteParams> {
}

export function ProjectView({match}:ProjectViewProps) {
    const userId = match.params.id;

    return (
        <div>
            <Title level={3}>Проект - { userId } </Title>
            <Card>
                
            </Card>
        </div>
    )
}
