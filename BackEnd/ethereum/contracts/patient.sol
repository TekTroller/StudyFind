//// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 < 0.9.0;
pragma abicoder v2;

contract PatientFactory {
    address[] public deployedPatients;
    
    function createPatient(string memory fname, string memory lname, string memory bday, string memory sex, address manager) public returns(address){
        address patientAddress = address(new Patient(fname, lname, bday, sex, manager));
        deployedPatients.push(patientAddress);
        return patientAddress;
    }
    
    function getDeployedPatients() public view returns (address[] memory) {
        return deployedPatients;
    }
}

contract Patient {
    string public first_name;
    string public last_name;
    string public birthday;
    string public gender;
    address public owner;
    mapping(string => string) private tokens;
    mapping(address => bool) private authorized_accessors;
    string[] file_names;

    modifier owner_only() {
        require(msg.sender == owner);
        _;
    }

    modifier authorized_only() {
        require(authorized_accessors[msg.sender]);
        _;
    }

    constructor(string memory fname, string memory lname, string memory bday, string memory sex, address manager) {
        first_name = fname;
        last_name = lname;
        birthday = bday;
        gender = sex;
        owner = manager;
        authorized_accessors[owner] = true;
    }

    function add_token(string memory filename, string memory token) public owner_only {
        require(bytes(tokens[filename]).length == 0);
        file_names.push(filename);
        tokens[filename] = token;
    }

    function get_token(string memory filename) public view authorized_only returns(string memory){
        require(bytes(tokens[filename]).length == 0);
        return tokens[filename];
    }
}