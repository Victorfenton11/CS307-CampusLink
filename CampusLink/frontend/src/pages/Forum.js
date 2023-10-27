import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Forum.css';

const Forum = () => {

  return (
    <div>
        <header>
            <div className="navbar">
                <nav className="navigation">
                    <ul className="nav-list">
                        {/*<span class="close-icon"><i class="fa fa-close"></i></span>*/}
                        {/*show the links that we create*/}
                        <li className="nav-item">
                            <a href="#">General</a>
                        </li>
                        <li className="nav-item">
                            <a href="#">Forum</a>
                        </li>
                        <li className="nav-item">
                            <a href="#">Detail</a>
                        </li>
                    </ul>
                </nav>
                {/*<a href="#" class="bar-icon"><i class="fa fa-bars"></i></a>*/}
                {/*<div class="brand">My Forum</div>*/}
            </div>
            {/*Search Bar*/}
            <div class="search-box">
                <div>
                    <select name="" id=""> 
                        <option value="everything">Everything</option>
                        <option value="titles">Titles</option>
                        <option value="descriptions">Descriptions</option>
                    </select>
                    <input type="text" name="" id="" placeholder="search ..."></input>
                    <button>Search</button>
                </div>
            </div>
        </header>

        <div className="container">
            <div className="subforum">
                <div className="subforum-title">
                    <h1>General Information</h1>
                </div>
                <div className="subforum-row">
                    {/*}
                    <div class="subforum-icon">
                        <i class="fa fa-car"></i>
                    </div>
                    */}
                    
                    <div className="subforum-description subforum-column">
                        <h1><a href="">Description Title</a></h1>
                        <p>Description Content: bla bla bla</p>
                    </div>
                    {/*statistics of each Forum */}
                    <div className="subforum-stats subforum-column center">
                        <span>24 posts | 15 Topics</span>
                    </div>
                    {/*display the last post of each Forum */}
                    <div className="subforum-info subforum-column">
                        <b><a href="">Last Post</a></b> by <a href="">Mike</a>
                        <br></br>
                        on <small>Oct 26 2021</small>
                    </div>
                </div>
                <hr className = "subforum-devider"></hr>
            </div>

            <div className="forum-info"> 
                <div class="chart">
                    Forum Statistics 
                </div>
                <div class="stats">
                    <span><u>5,369</u> Posts, in <u>1069</u> Topics, by <u>6969</u> Users</span>
                    <span> Latest Post: <b><a href="#">Random Post</a></b> on Dec 31, 2069 by <a href="#">Random User</a></span>
                </div>
            </div>

        </div>

    </div>
  )
}

export default Forum;
