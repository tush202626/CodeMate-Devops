import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { USER_CONNECTION_STATUS } from '../../types/user';

const getAvatarUrl = (username) => {
    // DiceBear avatar API - style can be customized (e.g., "bottts", "avataaars", "identicon")
    return `https://ui-avatars.com/api/?name=${username}`;
};

const User = ({ user, avatarUrl }) => {
    const { username, status } = user;
    const title = `${username} - ${status === USER_CONNECTION_STATUS.ONLINE ? "online" : "offline"}`;
    const { currentUser } = useAppContext();

    return (
        <div
            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            title={title}
        >
            <div className="relative">
                <img
                    src={avatarUrl}
                    alt={`${username}'s avatar`}
                    className="w-12 h-12 rounded-full"
                />
                <div
                    className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${
                        status === USER_CONNECTION_STATUS.ONLINE ? 'bg-green-500' : 'bg-red-500'
                    } border border-white`}
                ></div>
            </div>
            <p className="text-gray-800 font-medium">
                {currentUser.username === username ? `${username} (You)` : username}
            </p>
        </div>
    );
};

const Users = () => {
    const { users } = useAppContext();
    const [userAvatars, setUserAvatars] = useState({});

    useEffect(() => {
        const avatarMap = {};
        users.forEach((user) => {
            avatarMap[user.socketId] = getAvatarUrl(user.username);
        });
        setUserAvatars(avatarMap);
    }, [users]);

    return (
        <div className="flex flex-col gap-4">
            {users.map((user) => (
                <User key={user.socketId} user={user} avatarUrl={userAvatars[user.socketId]} />
            ))}
        </div>
    );
};

export default Users;
