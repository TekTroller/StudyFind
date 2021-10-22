//// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 < 0.9.0;
pragma abicoder v2;

import './professional.sol';

/**
 * Factory contract for deploying new patient database and controller contracts
 */
contract PatientFactory {
    struct PatientAddrs {
        address database;
        address controller;
    }
    mapping(string => PatientAddrs) private created_patients;
    
    function create_patient(string memory name_in, string memory birthday_in, string memory gender_in, string memory email_in) public {
        PatientController pc = new PatientController();
        address new_controller = address(pc);
        address new_patient_db = address(new PatientDatabase(name_in, birthday_in, gender_in, email_in, new_controller));

        pc.bind(new_patient_db);
        created_patients[email_in] = PatientAddrs({
            database: new_patient_db,
            controller: new_controller
        });
    }
    
    function get_created_patient(string memory email_in) public view returns(address, address) {
        return (created_patients[email_in].database, created_patients[email_in].controller);
    }
}



/**
 * Stores patient information and access tokens for patients' files
 */
contract PatientDatabase {
    // basic infos
    string private name;
    string private birthday;
    string private gender;
    string private email;

    // the patient controller that manages interaction with this contract
    address private controller;

    // data storage
    mapping(string => string) private tokens;
    string[] private filenames;

    // data structures to manage accessibility of patient's data
    mapping(address => bool) private has_access;
    mapping(string => address) private authorized_email_to_addr;
    string[] private authorized_professionals;

    // data structures for users to handle access requests
    mapping(string => address) private requests_received;
    string[] private unprocessed_requests;

    // professional information struct
    struct ProfessionalInfo {
        string name;
        string gender;
        string email;
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
        require(msg.sender == controller);
        _;
    }

    modifier authorized_restricted() {
        require(has_access[msg.sender]);
        _;
    }


    constructor(string memory name_in, string memory birthday_in, string memory gender_in, string memory email_in, address controller_in) {
        name = name_in;
        birthday = birthday_in;
        gender = gender_in;
        email = email_in;
        controller = controller_in;
        has_access[controller_in] = true;
    }

    // getters for storage variables
    function get_name() public authorized_restricted view returns (string memory) {
        return name;
    }
    
    function get_birthday() public authorized_restricted view returns (string memory) {
        return birthday;
    }

    function get_gender() public authorized_restricted view returns (string memory) {
        return gender;
    }

    function get_email() public authorized_restricted view returns (string memory) {
        return email;
    }


    // functions related to file management
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


    // functions related to accessibility management
    function send_view_request(address professional_addr, string memory professional_email) external {
        require(!has_access[professional_addr]);
        require(requests_received[professional_email] == address(0));

        unprocessed_requests.push(professional_email);
        requests_received[professional_email] = professional_addr;
    }

    function process_request(string memory professional_email, bool approve) external owner_restricted {
        require(requests_received[professional_email] != address(0));

        has_access[requests_received[professional_email]] = approve;
        if (approve) {
            authorized_professionals.push(email);
            authorized_email_to_addr[email] = requests_received[professional_email];
        }

        for (uint256 i=0; i < unprocessed_requests.length; i++) {
            if (keccak256(abi.encodePacked((unprocessed_requests[i]))) == keccak256(abi.encodePacked((professional_email)))) {
                unprocessed_requests[i] = unprocessed_requests[unprocessed_requests.length - 1];
                break;
            }
        }
        unprocessed_requests.pop();
        requests_received[professional_email] = address(0);
    }

    function ban_professional(string memory professional_email) external owner_restricted {
        require(has_access[authorized_email_to_addr[professional_email]]);

        has_access[authorized_email_to_addr[professional_email]] = false;
        authorized_email_to_addr[professional_email] = address(0);

        for (uint256 i=0; i < authorized_professionals.length; i++) {
            if (keccak256(abi.encodePacked((authorized_professionals[i]))) == keccak256(abi.encodePacked((professional_email)))) {
                authorized_professionals[i] = authorized_professionals[authorized_professionals.length - 1];
                break;
            }
        }
        authorized_professionals.pop();
    }

    function get_unprocessed_requests() external owner_restricted view returns(ProfessionalInfo[] memory) {
        ProfessionalInfo[] memory professional_requests = new ProfessionalInfo[](unprocessed_requests.length);

        for (uint256 i = 0; i < unprocessed_requests.length; i++) {
            ProfessionalController p = ProfessionalController(requests_received[unprocessed_requests[i]]);

            ProfessionalInfo memory p_info = ProfessionalInfo({
                name: p.get_name(),
                gender: p.get_gender(),
                email: p.get_email(),
                institution: p.get_institution()
            });
            professional_requests[i] = p_info;
        }

        return professional_requests;
    }

    function get_authorized_professionals() external owner_restricted view returns(ProfessionalInfo[] memory){
        ProfessionalInfo[] memory authorized = new ProfessionalInfo[](authorized_professionals.length);

        for (uint256 i = 0; i < authorized_professionals.length; i++) {
            ProfessionalController p = ProfessionalController(authorized_email_to_addr[authorized_professionals[i]]);

            ProfessionalInfo memory p_info = ProfessionalInfo({
                name: p.get_name(),
                gender: p.get_gender(),
                email: p.get_email(),
                institution: p.get_institution()
            });
            authorized[i] = p_info;
        }

        return authorized;
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

    function process_request(string memory professional_email, bool approve) external {
        database.process_request(professional_email, approve);
    }

    function ban_professional(string memory professional_email) external {
        database.ban_professional(professional_email);
    }

    function get_unprocessed_requests() external view returns(PatientDatabase.ProfessionalInfo[] memory) {
        return database.get_unprocessed_requests();
    }

    function get_authorized_professionals() external view returns(PatientDatabase.ProfessionalInfo[] memory) {
        return database.get_authorized_professionals();
    }

    function get_name() public view returns (string memory) {
        return database.get_name();
    }
    
    function get_birthday() public view returns (string memory) {
        return database.get_birthday();
    }

    function get_gender() public view returns (string memory) {
        return database.get_gender();
    }

    function get_email() public view returns (string memory) {
        return database.get_email();
    }
}