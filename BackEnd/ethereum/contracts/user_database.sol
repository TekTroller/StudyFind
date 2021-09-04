pragma solidity ^0.4.17;

contract UserDatabase {
    struct User {
        string password; // Should be encrypted
        string name;
        string birthdate;
        uint8 sex; // 0 = female, 1 = male
        bool usertype; // 0 = patient, 1 = doctor/researcher
        address personal_database_contract_addr;
    }

    mapping(string => User) private database;
    string[] public registered_users;

    function register(string email, string password, string name, 
                    string birthdate, uint8 sex, bool usertype, address personal) public {
        User memory new_user = User({
            password: password,
            name: name,
            birthdate: birthdate,
            sex: sex,
            usertype: usertype,
            personal_database_contract_addr: personal
        });
        database[email] = new_user;
        registered_users.push(email);
    }

    function update_info(string email, string name, 
                    string birthdate, uint8 sex) public returns (bool) {
        require(database[email].personal_database_contract_addr != address(0x0)); // Make sure email is registered
        User storage current = database[email];
        current.name = name;
        current.birthdate = birthdate;
        current.sex = sex;
        return true;
    }

    function update_password(string email, string password) public returns (bool) {
        require(database[email].personal_database_contract_addr != address(0x0)); // Make sure email is registered
        User storage current = database[email];
        current.password = password;
        return true;
    }

    function verify(string email, string password) public view returns (bool) {
        require(database[email].personal_database_contract_addr != address(0x0)); // Make sure email is registered
        string memory expected_password = database[email].password;
        bool verified = keccak256(bytes(password)) == keccak256(bytes(expected_password));
        return verified;
    }
}