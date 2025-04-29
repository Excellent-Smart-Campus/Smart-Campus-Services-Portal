import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Avatar, Header } from 'rsuite';

function Navigation() {
    return (
        <Header>
            <Navbar>
                <Navbar.Brand href="#">RSUITE</Navbar.Brand>
    
                <Nav pullRight className='navRight'>
                    <Nav.Menu >
                        <Nav.Item>Profile</Nav.Item>
                        <Nav.Item>Settings</Nav.Item>
                        <Nav.Item>Logout</Nav.Item>
                    </Nav.Menu>
                </Nav>
            </Navbar>
        </Header>
    )
}
export default Navigation;