import React from 'react';
import { Route } from "react-router";
import { Home } from "../pages/home/Home";
import { Projects } from "../pages/projects/Projects";
import { Link } from "react-router-dom";

export function AppLayout () { 
    return (
        <>
            <h1>vaanacs</h1>
            <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/projects/">Projects</Link>
            </li>
          </ul>
            <Route path="/" exact component={Home} />
            <Route path="/projects/" component={Projects} />
        </>
    )
}