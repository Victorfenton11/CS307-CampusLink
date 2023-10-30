import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Forum.css';

const Posts = () => {

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
            {/* Navigation Bar */}
            <div class="navigate">
                <span><a href="#">My Forum | Forums</a> {'>>'} <a href="#">Random Topic</a></span>
            </div>

            <div class="posts-table">
                <div class="table-head">
                    {/*<div class="status">Status</div>*/}
                    <div class="subjects">Subjects</div>
                    <div class="replies">Replies/Views</div>
                    <div class="last-reply">Last Reply</div>
                </div>
                <div class="table-row">
                    <div class="subjects">
                        <div class="subjects"><a href="#">Is Python worth it?</a></div>
                        <span>Started by <b><a href="#">User</a></b>.</span>
                    </div>
                    <div class="replies">
                        2 replies | 125views
                    </div>
                    <div class="last-reply">
                        Oct 69, 2021
                        By <b><a href="#">User</a></b>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div class = "pagination">
                pages: <a href="#">1</a><a href="#">2</a><a href="#">3</a>
            </div>

            {/*}

            {/*
            <div className="forum-info"> 
                <div class="chart">
                    Forum Statistics 
                </div>
                <div class="stats">
                    <span><u>5,369</u> Posts, in <u>1069</u> Topics, by <u>6969</u> Users</span>
                    <span> Latest Post: <b><a href="#">Random Post</a></b> on Dec 31, 2069 by <a href="#">Random User</a></span>
                </div>
            </div>
            */}

        </div>

    </div>
  )
}

export default Posts;
