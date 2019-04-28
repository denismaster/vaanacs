import React from 'react';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom';

export function Header() {
    return (
        <Menu mode="horizontal" style={{ lineHeight: '64px' }}>
            <Menu.Item key="1">
                <Link to="/">
                    <Icon type="pie-chart" />
                    <span>Главная</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link to="/projects">
                    <Icon type="file" />
                    <span>Проекты</span>
                </Link>
            </Menu.Item>
        </Menu>
    )
}