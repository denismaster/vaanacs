import React from 'react';
import { Route } from "react-router";
import { Home } from "../pages/home/Home";
import { Projects } from "../pages/projects/Projects";
import { Link } from "react-router-dom";
import { Layout } from 'antd';
import { Header } from './Header';

export function AppLayout() {
    return (
        <Layout className="layout">
            <Layout.Header style={{ backgroundColor: 'white' }}>
                <Header />
            </Layout.Header>
            <Layout.Content style={{ padding: '0 50px' }}>
                <Route path="/" exact component={Home} />
                <Route path="/projects/" component={Projects} />
            </Layout.Content>
        </Layout>
    )
}