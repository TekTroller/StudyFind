//// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 < 0.9.0;
pragma abicoder v2;

import './patient.sol';
import './login_database.sol';

contract ProfessionalFactory {
    address login_db_address;
    mapping(string => address) private created_professional;

    constructor(address login_db_address_in) {
        login_db_address = login_db_address_in;
    }

    function create_professional(string memory name_in, string memory birthday_in, string memory gender_in, string memory email_in, string memory institution_in) public {
        ProfessionalController pc = new ProfessionalController(name_in, birthday_in, gender_in, email_in, institution_in, login_db_address);
        created_professional[email_in] = address(pc);
    }

    function get_created_professional(string memory email) public view returns(address) {
        return created_professional[email];
    }
}


contract ProfessionalController {
    address login_db_address;

    string private name;
    string private birthday;
    string private gender;
    string private email;
    string private institution;

    LoginDatabase private login_db;

    mapping(string => address) patient_addrs;
    mapping(string => address) pending_requests_addrs;
    string[] pending_requests;
    string[] patients;


    constructor(string memory name_in, string memory birthday_in, string memory gender_in, string memory email_in, string memory institution_in, address login_db_address_in) {
        name = name_in;
        birthday = birthday_in;
        gender = gender_in;
        email = email_in;
        institution = institution_in;
        login_db_address = login_db_address_in;

        login_db = LoginDatabase(login_db_address);
    }


    // getters for storage variables
    function get_name() public view returns (string memory) {
        return name;
    }
    
    function get_birthday() public view returns (string memory) {
        return birthday;
    }

    function get_gender() public view returns (string memory) {
        return gender;
    }

    function get_email() public view returns (string memory) {
        return email;
    }

    function get_institution() public view returns (string memory) {
        return institution;
    }



    function view_patient_file(string memory patient_email, string memory filename) external view returns(string memory) {
        require(patient_addrs[patient_email] != address(0));
        return PatientDatabase(patient_addrs[patient_email]).view_file(filename);
    }

    function get_patient_filenames(string memory patient_email) external view returns(string[] memory) {
        require(patient_addrs[patient_email] != address(0));
        return PatientDatabase(patient_addrs[patient_email]).get_filenames();
    }

    function request_access(string memory patient_email) external {
        require(pending_requests_addrs[patient_email] == address(0));
        address patient_addr = login_db.get_patient_db_addr(patient_email);
        require(patient_addr != address(0));

        pending_requests.push(patient_email);
        pending_requests_addrs[patient_email] = patient_addr;
        PatientDatabase(patient_addr).send_view_request(address(this), email);
    }

    function process_request(string memory patient_email, address patient_addr, bool approve) external {
        require(pending_requests_addrs[patient_email] != address(0));
        require(msg.sender == pending_requests_addrs[patient_email]);

        if (approve) {
            patients.push(patient_email);
            patient_addrs[patient_email] = patient_addr;
        }

        for (uint256 i=0; i < pending_requests.length; i++) {
            if (keccak256(abi.encodePacked((pending_requests[i]))) == keccak256(abi.encodePacked((patient_email)))) {
                pending_requests[i] = pending_requests[pending_requests.length - 1];
                break;
            }
        }
        pending_requests.pop();
        pending_requests_addrs[patient_email] = address(0);
    }

    function delete_patient(string memory patient_email) external {
        require(patient_addrs[patient_email] != address(0));
        require(msg.sender == patient_addrs[patient_email]);

        for (uint256 i=0; i < patients.length; i++) {
            if (keccak256(abi.encodePacked((patients[i]))) == keccak256(abi.encodePacked((patient_email)))) {
                patients[i] = patients[patients.length - 1];
                break;
            }
        }
        patients.pop();
        patient_addrs[patient_email] = address(0);
    }

    function get_pending_requests() external view returns(string[] memory) {
        return pending_requests;
    }

    function get_patients() external view returns(string[] memory) {
        return patients;
    }
}