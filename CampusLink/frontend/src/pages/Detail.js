import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Forum.css';

const Detail = () => {

    const showComment = () => {
        document.getElementById("comment-area").classList.remove("hide");
        console.log("show comment");
    };

    const showReply = () => {
        document.getElementById("reply-area").classList.remove("hide");
        console.log("show reply");
    };
    
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
            <div class="navigate">
                <span><a href="#">My Forum | Forums</a> {'>>'} <a href="#">Random Forum</a></span>
            </div>

            <div class="topic-container">
                <div class="head">
                    <div class="authors">Author: Lil Asian</div>
                    <div class="content">Topic: post's title (Read 69 Times)</div>
                </div>
                <div class="body">
                    <div class="authors">
                        <div class="username"><a href="#"></a>Username</div> {/* who published the post */}
                        <div>Role</div>
                    </div>

                    <div class="content">
                        A random content about how to abduct children.
                        <br></br>
                        Nothing else...
                        <hr></hr>
                        Regards: Username

                        <div class="comment">
                            <button onClick={showComment}>Comment</button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Comment Section */}
            <div class="comment-area hide" id="comment-area">
                <textarea name="comment" id="" placeholder="comment here ....."></textarea>
                <input type="submit" name="" id="" value="submit"></input>  {/* type of a button */}
            </div>

            {/* Show Comments */}
            <div class="comments-container">
                <div class="head">
                    <div class="authors">Author: Lil Asian</div>
                    <div class="content">Comments</div>
                </div>
                <div class="body">
                    <div class="authors">
                        <div class="AnotherUser"><a href="#"></a>Username</div> {/* who published the post */}
                        <div>Role</div>
                    </div>

                    <div class="content">
                        A random comment about how to abduct children.
                        <br></br>
                        Nothing else...
                        <hr></hr>
                        Regards: Username

                        <div class="comment">
                            <button onClick={showReply}>Reply</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reply Section */}
            <div class="reply-area hide" id="reply-area">
                <textarea name="comment" id="" placeholder="Reply here ....."></textarea>
                <input type="submit" name="" id="" value="submit"></input>  {/* type of a button */}
            </div>

        </div>

    </div>
  )
}

export default Detail;
