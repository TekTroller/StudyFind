//// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 < 0.9.0;
pragma abicoder v2;

contract PatientFactory {
    address[] public deployedPatients;
    
    function createPatient(string memory fname, string memory lname, string memory bday, string memory sex) public returns(address){
        address patientAddress = address(new Patient(fname, lname, bday, sex));
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
    mapping(string => string) private tokens;
    string[] filenames;

    modifier fileExists(string memory filename) {
        require(bytes(tokens[filename]).length != 0);
        _;
    }

    modifier fileNotExists(string memory filename) {
        require(bytes(tokens[filename]).length == 0);
        _;
    }

    constructor(string memory fname, string memory lname, string memory bday, string memory gndr) {
        first_name = fname;
        last_name = lname;
        birthday = bday;
        gender = gndr;
    }

    function add_file(string memory filename, string memory token) public fileNotExists(filename) {
        filenames.push(filename);
        tokens[filename] = token;
    }

    function get_file(string memory filename) public view fileExists(filename) returns(string memory) {
        return tokens[filename];
    }

    function delete_file(string memory filename) public fileExists(filename) {
        tokens[filename] = "";
        for (uint256 i=0; i < filenames.length; i++) {
            if (keccak256(abi.encodePacked((filenames[i]))) == keccak256(abi.encodePacked((filename)))) {
                filenames[i] = filenames[filenames.length - 1];
                filenames.pop();
                break;
            }
        }
    }

    function change_filename(string memory old_filename, string memory new_filename) public fileExists(old_filename) fileNotExists(new_filename) {
        tokens[new_filename] = tokens[old_filename];
        tokens[old_filename] = "";
        for (uint256 i=0; i < filenames.length; i++) {
            if (keccak256(abi.encodePacked((filenames[i]))) == keccak256(abi.encodePacked((old_filename)))) {
                filenames[i] = new_filename;
            }
        }
    }
}