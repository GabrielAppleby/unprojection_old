import React from "react";
import { Link } from 'react-router-dom';
import {Navbar, Nav} from "react-bootstrap";

export default class DashboardNav extends React.Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Link className='navbar-brand' to="/">Home</Link>
                <Nav>
                    <Link className='nav-link' to="/interpolation">Interpolation</Link>
                    <Link className='nav-link' to="/comparison">Comparison</Link>
                    <Link className='nav-link' to="/classifiers">Classifiers</Link>
                    <Link className='nav-link' to="/validation">Validation</Link>
                    <Link className='nav-link' to="/gradient">Gradient</Link>
                </Nav>
            </Navbar>
        );
    }
}