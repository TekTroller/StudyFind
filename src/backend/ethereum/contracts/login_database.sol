//// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 < 0.9.0;
pragma abicoder v2;


contract LoginDatabase {
    struct User {
        bool usertype; // false = patient, true = doctor/researcher
        string password; // Should be encrypted
        address database_addr;
        address controller_addr;
    }

    mapping(string => User) private database;
    string[] public registered_patients;
    string[] public registered_professionals;

    function register(string memory email, string memory password, bool usertype, address db_addr, address controller_addr) public {
        require(database[email].controller_addr == address(0x0)); // Make sure email is not yet registered

        User memory new_user = User({
            password: password,
            usertype: usertype,
            database_addr: db_addr,
            controller_addr: controller_addr
        });
        database[email] = new_user;
        
        if (usertype) {
            registered_professionals.push(email);
        } else {
            registered_patients.push(email);
        }
    }

    function update_password(string memory email, string memory password) public {
        require(database[email].database_addr != address(0x0)); // Make sure email is registered
        User storage current = database[email];
        current.password = password;
    }

    function verify(string memory email, string memory password, bool usertype) public view returns (address) {
        require(database[email].database_addr != address(0x0)); // Make sure email is registered
        
        string memory expected_password = database[email].password;
        bool expected_usertype = database[email].usertype;
        bool verified = keccak256(bytes(password)) == keccak256(bytes(expected_password));

        if (verified && (usertype == expected_usertype)) {
            return database[email].controller_addr;
        } else {
            return address(0);
        }
    }

    function get_registered_patients() public view returns (string[] memory) {
        return registered_patients;
    }

    function get_registered_professionals() public view returns (string[] memory) {
        return registered_professionals;
    }

    function get_patient_db_addr(string memory email) external view returns(address) {
        require(database[email].database_addr != address(0));
        return database[email].database_addr;
    }
}