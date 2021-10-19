//// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 < 0.9.0;
pragma abicoder v2;


/**
 * Factory contract for deploying new patient database and controller contracts
 */
contract PatientFactory {
    mapping(string => address) private created_patients;
    
    function createPatient(string memory name_in, string memory birthday_in, string memory gender_in, string memory email_in) public {
        address new_controller = address(new PatientController());
        address new_patient_db = address(new PatientDatabase(name_in, birthday_in, gender_in, email_in, new_controller));
        created_patients[email_in] = new_patient_db;
    }
    
    function getCreatedPatient(string memory email_in) public view returns(address) {
        return created_patients[email_in];
    }
}



/**
 * Stores patient information and access tokens for patients' files
 */
contract PatientDatabase {
    // basic infos
    string public name;
    string public birthday;
    string public gender;
    string public email;

    // the patient controller that manages interaction with this contract
    address private controller;

    // data storage
    mapping(string => string) private tokens;
    string[] private filenames;

    // data structures to manage accessibility of patient's data
    mapping(address => bool) private has_access;
    address[] private view_requests;
    struct professional {
        string name;
        string gender;
        string institution;
    }
    

    modifier file_exists(string memory filename) {
        require(bytes(tokens[filename]).length != 0);
        _;
    }

    modifier file_not_exists(string memory filename) {
        require(bytes(tokens[filename]).length == 0);
        _;
    }

    modifier owner_restricted() {
        require(msg.sender == address(this));
        _;
    }

    modifier authorized_restricted() {
        require(has_access[msg.sender]);
        _;
    }


    constructor(string memory name_in, string memory birthday_in, string memory gender_in, string memory email_in, address owner_in) {
        name = name_in;
        birthday = birthday_in;
        gender = gender_in;
        email = email_in;
        controller = owner_in;
        has_access[owner_in] = true;
    }

    function add_file(string memory filename, string memory token) external file_not_exists(filename) owner_restricted {
        filenames.push(filename);
        tokens[filename] = token;
    }

    function view_file(string memory filename) external view file_exists(filename) authorized_restricted returns(string memory) {
        return tokens[filename];
    }

    function delete_file(string memory filename) external file_exists(filename) owner_restricted {
        tokens[filename] = "";
        for (uint256 i=0; i < filenames.length; i++) {
            if (keccak256(abi.encodePacked((filenames[i]))) == keccak256(abi.encodePacked((filename)))) {
                filenames[i] = filenames[filenames.length - 1];
                break;
            }
        }
        filenames.pop();
    }

    function change_filename(string memory old_filename, string memory new_filename) external file_exists(old_filename) file_not_exists(new_filename) owner_restricted {
        tokens[new_filename] = tokens[old_filename];
        tokens[old_filename] = "";
        for (uint256 i=0; i < filenames.length; i++) {
            if (keccak256(abi.encodePacked((filenames[i]))) == keccak256(abi.encodePacked((old_filename)))) {
                filenames[i] = new_filename;
            }
        }
    }

    function get_filenames() external view authorized_restricted returns (string[] memory) {
        return filenames;
    }

    function send_view_request() external {
        
    }
}



/** 
 * Contract for interaction with patients' database.
 * Adds a layer of indirection to control accessibility associated with ethereum address thus ensuring security
*/
contract PatientController {
    // ensures the controller only binds with the database contract at deploy time by the factory contract
    bool private binded;

    // the database contract for this specific patient
    PatientDatabase private database;


    constructor() {
        binded = false;
    }

    function bind(address patient_db_addr) external {
        require(!binded);
        database = PatientDatabase(patient_db_addr);
        binded = true;
    }
    
    function add_file(string memory filename, string memory token) external {
        database.add_file(filename, token);
    }

    function view_file(string memory filename) external view returns(string memory) {
        return database.view_file(filename);
    }

    function delete_file(string memory filename) external {
        database.delete_file(filename);
    }

    function change_filename(string memory old_filename, string memory new_filename) external {
        database.change_filename(old_filename, new_filename);
    }

    function get_filenames() external view returns (string[] memory) {
        return database.get_filenames();
    }
}