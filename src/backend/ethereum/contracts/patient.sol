//// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 < 0.9.0;
pragma abicoder v2;

contract PatientFactory {
    address[] public deployedPatients;
    mapping(string => address) createdPatients;
    
    function createPatient(string memory fullname, string memory bday, string memory gndr, string memory identifier) public {
        address patientAddress = address(new Patient(fullname, bday, gndr));
        deployedPatients.push(patientAddress);
        createdPatients[identifier] = patientAddress;
    }
    
    function getCreatedPatient(string memory identifier) public view returns(address) {
        return createdPatients[identifier];
    }

    function getDeployedPatients() public view returns (address[] memory) {
        return deployedPatients;
    }
}

contract Patient {
    string public name;
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

    constructor(string memory fullname, string memory bday, string memory gndr) {
        name = fullname;
        birthday = bday;
        gender = gndr;
    }

    function add_file(string memory filename, string memory token) public fileNotExists(filename) {
        filenames.push(filename);
        tokens[filename] = token;
    }

    function view_file(string memory filename) public view fileExists(filename) returns(string memory) {
        return tokens[filename];
    }

    function delete_file(string memory filename) public fileExists(filename) {
        tokens[filename] = "";
        for (uint256 i=0; i < filenames.length; i++) {
            if (keccak256(abi.encodePacked((filenames[i]))) == keccak256(abi.encodePacked((filename)))) {
                filenames[i] = filenames[filenames.length - 1];
                break;
            }
        }
        filenames.pop();
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

    function get_filenames() public view returns (string[] memory) {
        return filenames;
    }
}