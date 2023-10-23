import React, { useState } from 'react';
import dum_pic from '../../static/images/Test.jpg'
import '../styles/UserList.css'

const users = [
  {
    id: 1,
    username: 'user1',
    profilePicture: dum_pic,
    bio: 'Web Developer',
    email: 'user1@purdue.edu',
  },
  {
    id: 2,
    username: 'user2',
    profilePicture: dum_pic,
    bio: 'Designer',
    email: 'user2@purdue.edu',
  },
  {
    id: 3,
    username: 'user3',
    profilePicture: dum_pic,
    bio: 'Data Scientist',
    email: 'user3@purdue.edu',
  },
  {
    id: 4,
    username: 'user4',
    profilePicture: dum_pic,
    bio: 'Writer',
    email: 'user4@purdue.edu',
  },
  {
    id: 5,
    username: 'user5',
    profilePicture: dum_pic,
    bio: 'Photographer',
    email: 'user5@purdue.edu',
  },
];

const UserList = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <h1>User Profiles</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <img src={user.profilePicture} alt={`${user.username}'s profile`} />
            <p>{user.username}</p>
            {showDetails ? (
              <div className="user-details">
                <p>Bio: {user.bio}</p>
                <p>Email: {user.email}</p>
              </div>
            ) : null}
            <button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
