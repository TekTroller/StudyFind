//// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 < 0.9.0;
pragma abicoder v2;

import './patient.sol';
import './login_database.sol';

contract Professional {
    address login_db_address = 0x07a3159b37F5e7f448419cbb324089Eee2fb6498;

    string private name;
    string private birthday;
    string private gender;
    string private email;
    string private institution;
    address private controller;

    LoginDatabase private login_db;

    mapping(string => address) patients_email_to_addr;
    string[] patients;


    constructor(string memory name_in, string memory birthday_in, string memory gender_in, string memory email_in, string memory institution_in) {
        name = name_in;
        birthday = birthday_in;
        gender = gender_in;
        email = email_in;
        institution = institution_in;

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


    function view_patient_file(string memory patient_email, string memory filename) external returns(string memory) {
        require(patients_email_to_addr[patient_email] != address(0));
        return PatientDatabase(patients_email_to_addr[patient_email]).view_file(filename);
    }

    function request_access(string memory patient_email) external {
        address patient_addr = login_db.get_patient_db_addr(patient_email);
        require(patient_addr != address(0));
        PatientDatabase(patient_addr).send_view_request(address(this), email);
    }
}