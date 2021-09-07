//// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 < 0.9.0;
pragma abicoder v2;


contract LoginDatabase {
    struct User {
        bool usertype; // false = patient, true = doctor/researcher
        string password; // Should be encrypted
        address personal_database_addr;
    }

    mapping(string => User) private database;
    string[] public registered_users;

    function register(string memory email, string memory password, bool usertype, address personal) public {
        require(database[email].personal_database_addr == address(0x0)); // Make sure email is not yet registered

        User memory new_user = User({
            password: password,
            usertype: usertype,
            personal_database_addr: personal
        });
        database[email] = new_user;
        registered_users.push(email);
    }

    function update_password(string memory email, string memory password) public returns (bool) {
        require(database[email].personal_database_addr != address(0x0)); // Make sure email is registered
        User storage current = database[email];
        current.password = password;
        return true;
    }

    function verify(string memory email, string memory password, bool usertype) public view returns (bool) {
        require(database[email].personal_database_addr != address(0x0)); // Make sure email is registered
        
        string memory expected_password = database[email].password;
        bool expected_usertype = database[email].usertype;
        bool verified = keccak256(bytes(password)) == keccak256(bytes(expected_password));

        return verified && (usertype == expected_usertype);
    }

    function get_registered_users() public view returns (string[] memory) {
        return registered_users;
    }
}